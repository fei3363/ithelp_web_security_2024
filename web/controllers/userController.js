const db = require('../db/postgres');

const userController = {
  // 建立使用者
  async createUser(req, res) {
    const { username, email, password } = req.body;
    try {
      const result = await db.query(
        'INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING *',
        [username, email, password]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 取得所有使用者
  async getAllUsers(req, res) {
    try {
      const result = await db.query('SELECT * FROM users');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 根據 ID 取得使用者
  async getUserById(req, res) {
    const { id } = req.params;
    try {
      const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: '使用者未找到' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 更新使用者
  async updateUser(req, res) {
    const { id } = req.params;
    const { username, email } = req.body;
    try {
      const result = await db.query(
        'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *',
        [username, email, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: '使用者未找到' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 刪除使用者
  async deleteUser(req, res) {
    const { id } = req.params;
    try {
      const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: '使用者未找到' });
      }
      res.json({ message: '使用者已成功刪除', deletedUser: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = userController;