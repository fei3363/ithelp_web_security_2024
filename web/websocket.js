const WebSocket = require('ws');

let wss;
const clients = new Set();

function initWebSocket(server) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('新的 WebSocket 連接');

    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket 連接關閉');
    });
  });
}

function broadcastInventoryUpdate(update) {
  const message = JSON.stringify(update);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

module.exports = { initWebSocket, broadcastInventoryUpdate };