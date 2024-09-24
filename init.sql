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


-- 建立文章資料表（如果不存在）
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY, -- 文章 ID
    title VARCHAR(255) NOT NULL, -- 文章標題
    content TEXT, -- 文章內容
    author_id INTEGER REFERENCES users(id), -- 作者 ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 建立時間
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 更新時間
);

-- 建立 INDEX 以提高查詢效能
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);

-- 插入測試資料
INSERT INTO articles (title, content, author_id)
VALUES 
('第一篇文章', '這是第一篇文章的內容。', 1),
('關於 SQL 注入的防範', 'SQL 注入是一種常見的網路攻擊方式，本文將討論如何有效防範。', 1)
ON CONFLICT DO NOTHING;

-- 建立更新 updated_at 的觸發器
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_article_modtime
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();