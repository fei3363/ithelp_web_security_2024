const { sequelize } = require('../db/postgres');
const { DataTypes } = require('sequelize');


// 制定 file 資料表的欄位資訊

const File = sequelize.define('file', 
  // 欄位資訊
  {
    id: {
      type: DataTypes.INTEGER, // 資料型別是整數
      autoIncrement: true, // 自動遞增
      primaryKey: true, // 主鍵
    },
    name: {
      type: DataTypes.STRING, // 資料型別是字串
      allowNull: false, // 不允許為空
    },
    stored_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING, // 資料型別是字串
      allowNull: false, // 不允許為空
    },
    creat_time: {
      type: DataTypes.DATE, // 資料型別是日期
      allowNull: false, // 不允許為空
    },
    update_time: {
      type: DataTypes.DATE, // 資料型別是日期
      allowNull: false, // 不允許為空
    },
  },
  // 資料表設定
  {
    tableName: 'file', // 指定資料表名稱
    timestamps: false, // 不使用 Sequelize 的時間戳記
  }
);

module.exports = File; // 匯出 File 模型
