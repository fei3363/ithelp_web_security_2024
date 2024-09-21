// 引入模組
const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const session = require('express-session');

const { handleMethod, handleStatus } = require('./routes/httpHandlers');
const { authenticateBasic, protectedRoute } = require('./routes/authHandler');

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
  cookie: { secure: false } // 在非 HTTPS 環境下也能使用 session
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

// 啟動伺服器
app.listen(port, () => {
  // 當伺服器成功啟動時，在控制台輸出訊息
  console.log(`Server running at http://localhost:${port}`);
});