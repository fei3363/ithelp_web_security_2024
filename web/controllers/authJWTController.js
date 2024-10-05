const jwt = require('jsonwebtoken');
const db = require('../db/postgres');

const Secretkey = 'mysecret'; // 不安全的密鑰，應該使用環境變量

const authJWTHandler = {
    async login(req, res) {
        const { username, password } = req.body;
        try {
            const user = await db.query('SELECT * FROM users WHERE username = $1', [username]);
            if (user.rows.length === 0) {
                return res.status(401).json({ message: '使用者不存在或密碼錯誤' });
            }
            const userObj = user.rows[0];

            // 驗證密碼，不安全的寫法，因為密碼沒有進行雜湊
            const isPasswordValid = password === userObj.password;
            if (!isPasswordValid) {
                return res.status(401).json({ message: '使用者不存在或密碼錯誤' });
            }

            // 不安全寫法，將密碼也一起放入 token 中
            const token = jwt.sign({ id: userObj.id, username: userObj.username, password: userObj.password }, Secretkey);
            res.json({ message: '登入成功', token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async refresh(req, res) {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: '沒有提供 token' });
        }
        try {
            // 驗證 token，但沒有檢查是否過期
            const decoded = jwt.verify(token, Secretkey);
            // 產生新的 token
            const newToken = jwt.sign({ id: decoded.id, username: decoded.username }, Secretkey);
            res.json({ message: 'Token 更新成功', token: newToken });
        } catch (error) {
            res.status(401).json({ message: 'Token 驗證失敗' });
        }
    },

    // middleware 函數，檢查 token 是否存在
    insecureAuth(req, res, next) {
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ error: 'Access denied' });
        try {
            // 驗證 token
            const verified = jwt.verify(token, Secretkey);
            req.user = verified;
            next();
        } catch (err) {
            res.status(400).json({ error: 'Invalid token' });
        }
    },

    // 需要受保護的路由處理函數測試
    protectedRoute(req, res) {
        res.json({ message: 'This is a protected route', user: req.user });
    }
};

module.exports = authJWTHandler;
