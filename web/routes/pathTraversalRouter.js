// routers/pathTraversalRouter.js
const express = require('express');
const pathTraversalController = require('../controllers/pathTraversalController');
const pathTraversalRouter = express.Router();


pathTraversalRouter.get('/', pathTraversalController.readFile);

module.exports = pathTraversalRouter;