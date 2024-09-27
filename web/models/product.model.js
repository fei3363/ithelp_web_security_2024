// models/product.model.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  stock: Number
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
