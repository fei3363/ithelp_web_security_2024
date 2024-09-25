const db = require('../db/postgres');

const articlesHandler = {
    // 取得所有文章
    async getAllArticles(req, res) {
        try {
            const result = await db.query('SELECT * FROM articles ORDER BY created_at DESC');
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // 

    // 取得單一文章
    async getArticle(req, res) {
        const { id } = req.params;
        try {
            // 直接插入 id 練習學習 SQL Injection 的風險
            const result = await db.query(`SELECT * FROM articles WHERE id = ${id}`);

            // 使用參數化查詢，避免 SQL Injection
            // const result = await db.query('SELECT * FROM articles WHERE id = $1', [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: '文章不存在' });
            }
            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    // 新增文章
    async createArticle(req, res) {
        const { title, content } = req.body;
        const authorId = req.session.userId; // 假設使用 session 來儲存使用者 ID

        try {
            const result = await db.query(
                'INSERT INTO articles (title, content, author_id) VALUES ($1, $2, $3) RETURNING *',
                [title, content, authorId]
            );
            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 更新文章
    async updateArticle(req, res) {
        const { id } = req.params;
        const { title, content } = req.body;
        const authorId = req.session.userId;

        try {
            const result = await db.query(
                'UPDATE articles SET title = $1, content = $2 WHERE id = $3 AND author_id = $4 RETURNING *',
                [title, content, id, authorId]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({ message: '文章不存在或您沒有權限修改' });
            }
            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 刪除文章
    async deleteArticle(req, res) {
        const { id } = req.params;
        const authorId = req.session.userId;

        try {
            const result = await db.query(
                'DELETE FROM articles WHERE id = $1 AND author_id = $2 RETURNING *',
                [id, authorId]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({ message: '文章不存在或您沒有權限刪除' });
            }
            res.json({ message: '文章已成功刪除' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getArticleSpace2Comment(req, res) {
        const { id } = req.params;
        try {
            // 基本的安全檢查
            if (!/^\d+$/.test(id)) {
                // 檢查是否包含空格
                if (/\s/.test(id)) {
                    return res.status(400).json({ message: '檢測到非法字符（空格）' });
                }
        

                // 執行查詢
                const result = await db.query(`SELECT * FROM articles WHERE id = ${id}`);
                if (result.rows.length === 0) {
                    return res.status(404).json({ message: '文章不存在' });
                }
                res.json(result.rows[0]);
            } else {
                // 如果是純數字，直接執行查詢
                const result = await db.query(`SELECT * FROM articles WHERE id = ${id}`);
                if (result.rows.length === 0) {
                    return res.status(404).json({ message: '文章不存在' });
                }
                res.json(result.rows[0]);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

};

module.exports = articlesHandler;