-- 檢查 myapp 資料庫是否存在，如果不存在則建立資料庫
SELECT 'CREATE DATABASE myapp'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'myapp')\gexec

-- 連接到 myapp 資料庫
\c myapp

-- 建立表（如果不存在）
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入初始資料（如果表是空的）
INSERT INTO users (username, email, password)
SELECT 'testuser', 'testuser@example.com' , 'password123' 
WHERE NOT EXISTS (SELECT 1 FROM users);