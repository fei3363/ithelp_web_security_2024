// routes/httpHandlers.js

// 處理所有 HTTP 方法的路由處理器
function handleMethod(req, res) {
    const method = req.method;
    res.send(`The HTTP method used was: ${method}`);
  }
  
  // 狀態碼處理路由處理器
  function handleStatus(req, res) {
    const code = parseInt(req.params.code);
    const message = getStatusMessage(code);
    res.status(code).json({ code, message });
  }
  
  // 輔助函數：取得狀態碼對應的訊息
  function getStatusMessage(code) {
    const messages = {
        // 1xx 訊息
        100: '繼續處理中',
        101: '切換協定',
        102: '處理中', // RFC 2518 WebDAV 擴充
  
        // 2xx 成功
        200: '請求成功',
        201: '資源已建立',
        202: '已接受處理，但尚未完成',
        204: '無內容，無需回應',
        206: '部分內容', // 針對範圍請求
  
        // 3xx 重定向
        300: '多種選擇',
        301: '資源永久移動',
        302: '資源暫時移動',
        303: '請查看其他位置',
        304: '資源未修改',
        307: '暫時重定向',
        308: '永久重定向',
  
        // 4xx 客戶端錯誤
        400: '錯誤的請求',
        401: '未授權，請登入',
        403: '禁止存取',
        404: '找不到資源',
        405: '不允許的請求方法',
        406: '不接受的回應格式',
        408: '請求超時',
        409: '資源衝突',
        410: '資源已永久移除',
        429: '請求次數過多，請稍後再試',
  
        // 5xx 伺服器錯誤
        500: '伺服器內部錯誤',
        501: '功能尚未實作',
        502: '錯誤的網關',
        503: '服務目前無法使用',
        504: '網關超時',
        505: '不支援的 HTTP 版本'
    };
    return messages[code] || '未知的狀態碼';
  }
  
  module.exports = {
    handleMethod,
    handleStatus
  };