const express = require('express');
const path = require('path');
const jsrender = require('jsrender');
const router = express.Router();

// JsRender Demo GET 路由
router.get('/JsRender-demo', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/jsRenderDemo.html'));
});

// JsRender SSTI Demo POST 路由
router.post('/jsRender-demo', (req, res) => {
    const userInput = req.body.payload;
    
    try {
        // 使用來自使用者的模板語法進行渲染
        const tmpl = jsrender.templates(userInput);
        const output = tmpl.render(); // 渲染模板
        res.send(`結果: ${output}`);
    } catch (error) {
        res.send(`錯誤: ${error.message}`);
    }
});

module.exports = router;
