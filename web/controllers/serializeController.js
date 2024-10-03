const serialize = require('node-serialize');

const serializeController = {
    // 反序列化
    serialize: function(req, res) {
        try {
            // 不安全的反序列化
            const deserializedData = serialize.unserialize(req.body);
            res.status(200).json(deserializedData);
        } catch (error) {
            console.error('Error processing data:', error);
            res.status(400).send('Error processing data');
        }
    }
};

module.exports = serializeController;