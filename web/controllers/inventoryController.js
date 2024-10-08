// controllers/inventoryController.js
const { broadcastInventoryUpdate } = require('../websocket');

// 模擬資料庫的庫存
let inventory = {
  'item1': 100,
  'item2': 200,
  'item3': 300
};

const inventoryController = {

    getALLInventory(req, res) {
        res.json(inventory);
    },

    updateInventory(req, res) {
        const { item, quantity } = req.body;

        if (item && quantity !== undefined) {
            inventory[item] = quantity;
            broadcastInventoryUpdate({ item, quantity });
            res.json({ message: '庫存已更新', item, quantity });
        } else {
            res.status(400).json({ error: '無效的請求' });
        }
    },


};

module.exports = inventoryController;