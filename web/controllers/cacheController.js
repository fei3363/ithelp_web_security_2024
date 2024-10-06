// Controllers/cacheController.js

const NodeCache = require('node-cache');

const cache = new NodeCache();

const cacheController = {

   
    cache: function(req, res) {
        const userAgent = req.headers['user-agent'];
        
        // 以 URL 當作快取的鍵值，若有相同的 URL，則直接回傳快取的內容
        const cacheKey = req.url;

        if (cache.has(cacheKey)) {
            console.log('Serving from cache');
            return res.send(cache.get(cacheKey));
        }

        let content = `<h1>Welcome, ${userAgent}!</h1>`;
        cache.set(cacheKey, content);
        res.send(content);
    },

    // 針對所有快取進行清除
    flush: function(req, res) {
        cache.flushAll();
        res.send('Cache flushed');
    },

    // 取得快取統計資訊
    getStats: function(req, res) {
        res.send(cache.getStats());
    },

    // 取得所有快取的鍵值
    getKeys: function(req, res) {
        res.send(cache.keys());
    },

    // 取得快取的值
    get: function(req, res) {
        const key = req.params.key;
        res.send(cache.get(key));
    },


    // 取得所有快取的值
    getallvalue: function(req, res) {
        res.send(cache.mget(cache.keys()));
    },
        

    // 取得所有快取的 TTL(Time To Live)
    getallvaluettl: function(req, res) {
        try {
            const keys = cache.keys();
            const ttls = {};
            keys.forEach(key => {
                try {
                    ttls[key] = cache.getTtl(key);
                } catch (err) {
                    console.error(`Error getting TTL for key ${key}:`, err);
                    ttls[key] = null; // 或者其他表示錯誤的值
                }
            });
            res.send(ttls);
        } catch (err) {
            console.error('Error in getallvaluettl:', err);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = cacheController;