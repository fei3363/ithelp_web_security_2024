const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticle);
router.post('/', articleController.createArticle);
router.put('/:id', articleController.updateArticle);
router.delete('/:id', articleController.deleteArticle);

router.get('/space/:id', articleController.getArticleSpace2Comment);



module.exports = router;