// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// 路由設置
router.get('/list', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/filter', productController.filterProducts);
router.get('/filter-by-price', productController.filterProductsByPrice);

module.exports = router;
