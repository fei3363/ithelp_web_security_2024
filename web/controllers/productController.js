// controllers/productController.js

const Product = require('../models/product.model');
// mongoose
const mongoose = require('mongoose');

// 列出所有商品
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    // 印出錯誤訊息
    console.error(error);
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
    console.error(error);
    res.status(500).send("伺服器錯誤");
  }
};

exports.filterProducts = async (req, res) => {
  const { category } = req.query;
  let filter = {};

  try {
    // 不安全的字串查詢
    if (category.startsWith('{')) {
      filter.category = JSON.parse(category);
    } else {
      filter.category = category; // 普通字串查詢
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("伺服器錯誤");
  }
};


exports.filterProductsByPrice = async (req, res) => {
  let { minPrice, maxPrice } = req.query;
  let filter = {};

  try {
    // 處理 minPrice 和 maxPrice 範圍
    if (minPrice) {
      filter.price = { $gte: Number(minPrice) };  // 確保轉換為數字
    }

    if (maxPrice && !maxPrice.startsWith('{')) {
      filter.price = { ...filter.price, $lte: Number(maxPrice) };  // 確保是數字範圍
    }

    // 處理 $where 操作符
    if (maxPrice && maxPrice.startsWith('{')) {
      const parsedMaxPrice = JSON.parse(maxPrice);
      filter = { $where: parsedMaxPrice.$where };
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error("伺服器錯誤：", error);
    res.status(500).send("伺服器錯誤");
  }
};