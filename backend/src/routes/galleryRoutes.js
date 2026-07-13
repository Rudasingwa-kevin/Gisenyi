const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', galleryController.getAll);
router.get('/:id', galleryController.getById);
router.post('/', authMiddleware, galleryController.create);
router.put('/:id', authMiddleware, galleryController.update);
router.delete('/:id', authMiddleware, galleryController.remove);

module.exports = router;
