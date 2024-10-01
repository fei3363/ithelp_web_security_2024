const express = require('express');
const path = require('path');
const pug = require('pug');
const router = express.Router();

// PugJS Demo GET 路由
router.get('/PugJS-demo', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pugJSDemo.html'));
});

// PugJS Demo POST 路由
router.post('/PugJS-demo', (req, res) => {
    const userInput = req.body.template;
    try {
        const template = pug.compile(userInput);
        res.send(`結果: ${template({})}`);
    } catch (error) {
        res.send(`錯誤: ${error.message}`);
    }
});

module.exports = router;
