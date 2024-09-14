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

// 設定 API 路由
app.get('/api/hello', (req, res) => {
  // 當存取 /api/hello 路徑時，回傳 JSON 
  res.json({ message: 'Hello from the server!' });
});

// 啟動伺服器
app.listen(port, () => {
  // 當伺服器成功啟動時，在控制台輸出訊息
  console.log(`Server running at http://localhost:${port}`);
});