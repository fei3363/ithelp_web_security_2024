// routes/authHandler.js

// 模擬的使用者資料庫，應該要從資料庫查詢
const users = {
    'admin': 'password123',
    'user': 'userpass'
  };
  
  function authenticateBasic(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
      return res.status(401).send('認證失敗：需要提供認證資訊。');
    }
  
    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];
  
    if (users[user] && users[user] === pass) {
      next();
    } else {
      res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
      return res.status(401).send('認證失敗：使用者名稱或密碼錯誤。');
    }
  }
  
  // 受保護的路由處理器
  function protectedRoute(req, res) {
    res.send('歡迎來到受保護的區域！');
  }
  
  module.exports = {
    authenticateBasic,
    protectedRoute
  };