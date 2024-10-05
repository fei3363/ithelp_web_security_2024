// router/authJWTController.js

const express = require('express');
const router = express.Router();
const authJWTHandler = require('../controllers/authJWTController');

router.post('/login', authJWTHandler.login);
router.post('/refresh', authJWTHandler.refresh);
router.get('/protected', authJWTHandler.insecureAuth, authJWTHandler.protectedRoute);
module.exports = router;

