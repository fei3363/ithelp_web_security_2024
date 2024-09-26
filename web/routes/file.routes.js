const fileController = require('../controllers/fileController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/') // 確保這個資料夾存在
  },
  filename: function (req, file, cb) {
    // 檢查文件是否已存在，如果存在則添加時間戳
    const filePath = path.join('upload', file.originalname);
    if (fs.existsSync(filePath)) {
      const nameArray = file.originalname.split('.');
      const extension = nameArray.pop();
      const name = nameArray.join('.');
      cb(null, `${name}-${Date.now()}.${extension}`);
    } else {
      cb(null, file.originalname);
    }
  }
});

const upload = multer({ storage: storage });

// 引用 express 模組
const express = require('express');

// 建立一個 Router 物件
const router = express.Router();

// 定義 /api/file 路由
router.post('/', upload.single('file'), fileController.create);

router.get('/', fileController.findAll);
router.get('/:id', fileController.findOne);
router.put('/:id', fileController.update);
router.delete('/:id', fileController.remove);


module.exports = router; // 匯出路由器