// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// 路由設置
router.get('/list', productController.getAllProducts);
router.get('/search', productController.searchProducts);

module.exports = router;
