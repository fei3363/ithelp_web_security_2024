// routes/serializeRouter.js

const express = require('express');
const serializeController = require('../controllers/serializeController');
const serializeRouter = express.Router();

serializeRouter.post('/', serializeController.serialize);

module.exports = serializeRouter;