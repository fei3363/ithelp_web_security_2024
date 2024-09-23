const db = require('../db/postgres');


const authHandler = {

    async login(req, res) {
        // req 是請求物件，res 是回應物件
        const { username, password, safemode } = req.body;
        try {
            if (safemode === 'true') {
                // 查詢使用者(較安全寫法，但回傳訊息過於詳細與密碼沒有進行雜湊，因此也要避免)
                const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);


                // 如果沒有找到使用者，回傳 401 狀態碼，透別注意，這樣寫會讓駭客知道使用者不存在
                if (result.rows.length === 0) {
                    return res.status(401).json({ message: '使用者不存在' }); // 狀態過於詳細，不建議這樣寫，因為會讓駭客知道使用者不存在
                    // return res.status(401).json({ message: '使用者不存在或密碼錯誤' }); // 這樣寫比較好
                }

                // 驗證密碼
                const user = result.rows[0];

                // 沒有使用 bcrypt 進行雜湊，所以不用 await，直接比對密碼，但這樣不安全
                const isPasswordValid = password === user.password;

                // 要引入 bcrypt 進行雜湊，再比對密碼
                // const isPasswordValid = await bcrypt.compare(password, user.password); // 有使用 bcrypt，所以要引入 bcrypt 

                // 如果密碼不正確，回傳 401 狀態碼
                if (!isPasswordValid) {
                    return res.status(401).json({ message: '密碼錯誤' }); // 狀態過於詳細，不建議這樣寫，因為會讓駭客知道使用者存在，但密碼錯誤
                    // return res.status(401).json({ message: '使用者不存在或密碼錯誤' }); // 這樣寫比較好
                }
                // 將 req.session.userId 設為使用者 ID 代表已登入
                req.session.userId = user.id;
                req.session.username = user.username;

                // 回傳成功訊息
                res.json({ message: '登入成功', user: { id: user.id, username: user.username, email: user.email } });

            } else {

                // 不安全的寫法，容易被 SQL Injection 攻擊
                const result = await db.query(`SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`);

                if (result.rows.length === 0) {
                    return res.status(401).json({ message: '使用者不存在或密碼錯誤' });
                }

                try {
                    const user = result.rows[0];
                    req.session.userId = user.id;
                    req.session.username = user.username;
    
                    // 回傳成功訊息
                    res.json({ message: '登入成功', user: { id: user.id, username: user.username, email: user.email } });
      
                } catch (error) {
                    res.status(500).json({ error: error.message });
                    
                }

            }

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async logout(req, res) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: '登出失敗' });
            }
            res.json({ message: '登出成功' });
        });
    }

};



module.exports = authHandler;