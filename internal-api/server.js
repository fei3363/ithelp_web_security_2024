const express = require('express');
const app = express();
const port = 4000;

const sensitiveData = {
  admin: {
    username: 'admin',
    password: 'super_secret_password'
  },
  secretKey: process.env.SECRET_KEY || 'default_secret_key'
};

const localOnly = (req, res, next) => {
  const ip = req.ip.replace(/^::ffff:/, '');
  if (ip === '127.0.0.1' || ip.startsWith('172.') || ip.startsWith('192.168.')) {
    next();
  } else {
    res.status(403).send('Access denied');
  }
};

app.use(localOnly);

app.get('/api/sensitive', (req, res) => {
  res.json(sensitiveData);
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Internal API running on port ${port}`);
});