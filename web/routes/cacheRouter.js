// routes/cacheRouter.js

const express = require('express');
const cacheController = require('../controllers/cacheController');

const cacheRouter = express.Router();

cacheRouter.get('/', cacheController.cache);
cacheRouter.get('/flush', cacheController.flush);
cacheRouter.get('/stats', cacheController.getStats);
cacheRouter.get('/keys', cacheController.getKeys);
cacheRouter.get('/getallvalue', cacheController.getallvalue);
cacheRouter.get('/getallttl', cacheController.getallvaluettl);


module.exports = cacheRouter;
