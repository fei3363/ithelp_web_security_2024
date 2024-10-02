// routers/brokenApiRouter.js
const express = require('express');
const router = express.Router();
const brokenApi = require('../controllers/brokenApiController');

router.post('/vm', brokenApi.runUserCode);
router.post('/require', brokenApi.dynamicRequire);


module.exports = router;