const File = require('../models/file.model');
const fs = require('fs');
const path = require('path');

const create = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
  
      const { originalname, filename, mimetype, path: filePath, size } = req.file;
  
      // 建立檔案資料
      const file = {
        name: originalname,
        stored_name: filename,
        type: mimetype,
        path: filePath,
        size: size,
        creat_time: new Date(),
        update_time: new Date(),
      };
  
      // 儲存檔案資料到資料庫
      await File.create(file);
      res.status(201).send('檔案已成功上傳。');
    } catch (err) {
      console.error('Error in file upload:', err);
      // 如果出錯，刪除已上傳的文件（如果存在）
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting file:', unlinkErr);
          }
        });
      }
      res.status(500).send({
        message: err.message || '上傳檔案時發生錯誤。',
      });
    }
  };

// 取得所有檔案
const findAll = (req, res) => {
  // 查詢所有檔案
  File.findAll()
    .then((files) => {
      res.send(files);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || '取得檔案時發生錯誤。',
      });
    });
};

// 取得指定檔案
const findOne = (req, res) => {
  // 取得檔案 ID
  const id = req.params.id;
  // 查詢指定檔案
  File.findByPk(id)
    .then((file) => {
      if (file) {
        res.send(file);
      } else {
        res.status(404).send('找不到指定的檔案。');
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || '取得檔案時發生錯誤。',
      });
    });
};


// 更新檔案
const update = (req, res) => {
  // 取得檔案 ID
  const id = req.params.id;
  // 取得檔案資訊
  const { name, type, data } = req.file;
  // 建立檔案資料
  const file = {
    name,
    type,
    data,
    update_time: new Date(),
  };
  // 更新檔案資料
  File.update(file, { where: { id } })
    .then((num) => {
      if (num == 1) {
        res.send('檔案已成功更新。');
      } else {
        res.status(404).send('找不到指定的檔案。');
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || '更新檔案時發生錯誤。',
      });
    });
};

// 刪除檔案
const remove = (req, res) => {
  // 取得檔案 ID
  const id = req.params.id;
  // 刪除檔案
  File.destroy({ where: { id } })
    .then((num) => {
      if (num == 1) {
        res.send('檔案已成功刪除。');
      } else {
        res.status(404).send('找不到指定的檔案。');
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || '刪除檔案時發生錯誤。',
      });
    });
};

module.exports = {
  create,
  findAll,
  findOne,
  update,
  remove,
};


// Path: web/routes/file.routes.js