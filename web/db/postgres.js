const { Pool } = require('pg');
const { Sequelize } = require('sequelize');

const parseDbUrl = (url) => {
  const params = new URL(url);
  return {
    username: params.username, // 使用者名稱
    password: params.password, // 使用者密碼
    host: params.hostname, // 連線的主機
    port: params.port, // 連線的 port
    database: params.pathname.split('/')[1], // 資料庫名稱
    dialect: 'postgres', // 使用的資料庫
    protocol: 'postgres', // 連線協定
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  };
};

const dbConfig = parseDbUrl(process.env.POSTGRES_URI); // 解析環境變數中的資料庫連線資訊

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host, // 連線的主機
  port: dbConfig.port, // 連線的 port
  dialect: dbConfig.dialect, // 使用的資料庫
  dialectOptions: {
    ssl: dbConfig.ssl, // 是否使用 SSL 連線
  },
  pool: { // 連線池的設定
    max: 20, // 最大連線數
    min: 0, // 最小連線數
    acquire: 30000, // 連線的等待時間
    idle: 10000 // 連線多久沒有使用會被釋放
  },
  logging: false  // 是否顯示 SQL 語句
});

const pool = new Pool({ // 建立一個連線池
  connectionString: process.env.POSTGRES_URI, // 連線資訊
});


const test_connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Sequelize連線已成功建立。');

    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('Pool連線測試成功。');
  } catch (error) {
    console.error('無法連接到資料庫:', error);
  }
};

test_connect();

module.exports = {
  sequelize, // 將 Sequelize 實體匯出
  query: (text, params) => pool.query(text, params), // 將查詢方法匯出
};