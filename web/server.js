// 引入模組
const express = require('express');
const path = require('path');


const app = express();
// 設定伺服器監聽的埠號
const port = 3000;

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

// 使用 express.json() 來解析 JSON 格式的請求
app.use(express.json());

// 使用 express.urlencoded() 來解析 URL 編碼的請求
app.use(express.urlencoded({ extended: true }));

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

// 啟動伺服器
app.listen(port, () => {
  // 當伺服器成功啟動時，在控制台輸出訊息
  console.log(`Server running at http://localhost:${port}`);
});