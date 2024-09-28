// db/mongoose.js

const mongoose = require('mongoose');
mongoose.set('sanitizeFilter', false); // 6.0.0 版本以上才有，但這是不安全的設定: 關閉自動過濾

// 連接 MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

module.exports = connectDB;
