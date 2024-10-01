const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');
const router = express.Router();

// Nunjucks 設定
nunjucks.configure({ autoescape: false });

// Nunjucks Demo GET 路由
router.get('/Nunjucks-demo', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/nunjucksDemo.html'));
});

// Nunjucks Demo POST 路由
router.post('/Nunjucks-demo', (req, res) => {
    const userInput = req.body.template;
    try {
        const output = nunjucks.renderString(userInput);
        res.send(`結果: ${output}`);
    } catch (error) {
        res.send(`錯誤: ${error.message}`);
    }
});

module.exports = router;
