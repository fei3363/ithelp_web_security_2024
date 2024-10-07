//controllers/pathTraversalController.js
const fs = require('fs');

const pathTraversalHandler = {


    // curl http://localhost:3000/api/pathTraversal?filename=../../package.json

    async readFile(req, res) {
        const { filename } = req.query;
        try {
            // 讀取檔案內容，並回傳，若檔案不存在，則回傳 404，並附上錯誤訊息
            const content = fs.readFileSync(`./upload/${filename}`, 'utf8');
            res.send(content);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }




    // async readFile(req, res) {
    //     const { filename } = req.params;
    //     try {
    //         // 讀取檔案內容，並回傳，若檔案不存在，則回傳 404，並附上錯誤訊息
    //         const content = fs.readFileSync(`./files/${filename}`, 'utf8');
    //         res.send(content);
    //     } catch (error) {
    //         res.status(404).json({ error: error.message });
    //     }
    // }
};


module.exports = pathTraversalHandler;