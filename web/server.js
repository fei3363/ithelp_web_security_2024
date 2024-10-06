// 引入模組
const express = require('express');
const path = require('path');
const libxmljs = require('libxmljs');
const fs = require('fs');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const session = require('express-session');
const axios = require('axios');

// 引入各個 SSTI 模組的路由
const jsRenderDemo = require('./ssti/jsRenderDemo');
const pugJSDemo = require('./ssti/pugJSDemo');
const nunjucksDemo = require('./ssti/nunjucksDemo');

// 引入路由
const brokenApiRouter = require('./routes/brokenApiRouter');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const articlesRouter = require('./routes/articlesRouter');
const productRoutes = require('./routes/productRoutes');
const fileRoutes = require('./routes/file.routes');
const serializeRouter = require('./routes/serializeRouter');
const authJWTRouter = require('./routes/authJWTRouter');
const cacheRouter = require('./routes/cacheRouter');


const { handleMethod, handleStatus } = require('./routes/httpHandlers');
const { authenticateBasic, protectedRoute } = require('./routes/authHandler');

const connectDB = require('./db/mongoose'); // 引入 MongoDB 連接
connectDB(); // 連接 MongoDB


const app = express();
// 設定伺服器監聽的埠號
const port = 3000;

// 使用 express.json() 來解析 JSON 格式的請求
app.use(express.json());

// 使用 express.urlencoded() 來解析 URL 編碼的請求
app.use(express.urlencoded({ extended: true }));

// 使用 session Middleware 來啟用 session 功能
app.use(session({
  secret: 'your_session_secret', // Hard-coded 密鑰，應該要更換
  // secret: process.env.SESSION_SECRET, // 從環境變數取得密鑰，比較安全
  resave: false, // 是否重新保存 session
  saveUninitialized: true, // 是否保存未初始化的 session
  cookie: { 
    httpOnly: false, // 是否只允許 JS 存取 cookie
    secure: false } // 在非 HTTPS 環境下也能使用 session
  // cookie: { secure: true } // 在 HTTPS 環境下使用 session
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 設定根路徑
app.get('/', (req, res) => {
  // 當存取根路徑時，請求 index.html 檔案
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 設定 form
app.get('/form', (req, res) => {
  // 當存取 form 路徑時，請求 form.html 檔案
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});


// 設定 API 路由
app.get('/api/hello', (req, res) => {
  // 當存取 /api/hello 路徑時，回傳 JSON 
  res.json({ message: 'Hello from the server!' });
});

// 設定搜尋路由
app.get('/search', (req, res) => {
  // 取得查詢字串參數
  const keyword = req.query.keyword;
  // 顯示查詢字串參數
  res.send(`你搜尋的關鍵字是：${keyword}`);
});

// 設定表單提交路由
app.post('/submit', (req, res) => {
  // 取得 POST 請求的參數
  const { username, password } = req.body;
  // 顯示 POST 請求的參數
  res.send(`你的帳號是 ${username}，密碼是 ${password}`);
});

// 設定重新導向的路由
app.get('/redirect', (req, res) => {
  const url = req.query.url;
  res.writeHead(302, { 'Location': url });
  res.end();
});

// 設定註冊的路由
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// 設定登入的路由
app.get('/login', (req, res) => {
  // 如果使用者已登入
  if (req.session.userId) {
    // 重新導向到 dashboard
    return res.redirect('/dashboard');
  }
  // 如果使用者未登入，回傳 login.html 檔案
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


app.get('/dashboard', (req, res) => {
  if (req.session.userId) {
    res.render('dashboard', {
      username: req.session.username,
    });
  } else {
    res.redirect('/login');
  }
});

// // 設定 dashboard
// app.get('/dashboard', (req, res) => {
//   // 如果使用者已登入
//   if (req.session.userId) {
//     // 取得使用者 ID
//     const userId = req.session.userId;
//     // 回傳 dashboard.html 檔案
//     return res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
//   }
//   // 如果使用者未登入，重新導向到登入頁面
//   res.redirect('/login');
// });

// 處理所有 HTTP 方法的路由
app.all('/method', handleMethod);

// 狀態碼處理路由
app.all('/status/:code', handleStatus);

// 設定受保護的路由
app.get('/protected', authenticateBasic, protectedRoute);

app.use('/api/users', userRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/articles', articlesRouter);

app.use('/api/files', fileRoutes);

app.use('/api/product', productRoutes);

app.use(express.json());

app.use('/api/broken', brokenApiRouter);

app.use('/api/serialize', serializeRouter);

app.use('/api/authJWT', authJWTRouter);


app.use('/api/cache', cacheRouter);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.get('/upload', (req, res) => {
  res.render('upload');
});

app.use('/files', express.static(path.join(__dirname, 'upload')));

app.use(express.text({ type: 'application/xml' }));

app.post('/load_xml', async function (req, res) {

  console.log('Received XML:', req.body);
  try {
      const xml = req.body;
      const doc = libxmljs.parseXml(xml, {noent: true});
      res.send(doc.toString({format: true}));
  } catch (err) {
      res.send(err.toString());
      res.sendStatus(500);
  }
});

app.post('/compress', async function (req, res) {
    const { filename } = req.body;

    // 如果 compress 資料夾不存在，則建立 compress 資料夾
    if (!fs.existsSync('compress')) {
        fs.mkdirSync('compress');
    }

    // 使用 exec 壓縮檔案
    exec(`zip compress/${filename}.zip test.txt`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            res.status(500).send(`Compression error: ${error}`);
            return;
        }

        

        // 檢查壓縮檔案是否存在
        const filePath = path.join(__dirname, 'compress', `${filename}.zip`);
        if (fs.existsSync(filePath)) {
            // 發送壓縮檔案給使用者
            res.download(filePath, `${filename}.zip`, (err) => {
                if (err) {
                    console.error(`Download error: ${err}`);
                    res.status(500).send('Download error');
                } else {
                    // 清空 compress 資料夾中的檔案
                    exec('rm compress/*', (rmError) => {
                        if (rmError) {
                            console.error(`Error cleaning compress folder: ${rmError}`);
                        }
                    });
                }
            });
        } else {
            // 如果檔案不存在，回傳錯誤訊息與 stdout
            res.status(404).send(stdout+'File not found');
        }
    });
});

// 使用 body-parser 來解析 JSON
app.use(bodyParser.json());

app.use('/ssti', jsRenderDemo);
app.use('/ssti', pugJSDemo);

// 設定 Nunjucks 模板引擎，並使用 .njk 擴展名
nunjucks.configure('views', {
  autoescape: false,  // 預設為 true，防止 XSS 攻擊
  express: app
});
app.set('view engine', 'njk');
app.use('/ssti', nunjucksDemo);

app.use(bodyParser.json());
app.get('/fetch', async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).send('URL parameter is required');
  }

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching URL');
  }
});


// 啟動伺服器
app.listen(port, () => {
  // 當伺服器成功啟動時，在控制台輸出訊息
  console.log(`Server running at http://localhost:${port}`);
});
