// controllers/productController.js

const Product = require('../models/product.model');

// 列出所有商品
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).send("伺服器錯誤");
  }
};

// 商品搜尋 API
exports.searchProducts = async (req, res) => {
  const query = req.query.q;
  // query 不能是空字串
    if (!query) {
        return res.status(400).send("請提供搜尋字串");
    }
  console.log(query);
  try {
    const products = await Product.find({ name: new RegExp(query, 'i') });
    console.log(products);
    res.json(products);
  } catch (error) {
    res.status(500).send("伺服器錯誤");
  }
};
