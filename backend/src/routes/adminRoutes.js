const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/places', adminController.getPlaces);
router.get('/places/:id', adminController.getPlace);
router.post('/places', adminController.createPlace);
router.put('/places/:id', adminController.updatePlace);
router.delete('/places/:id', adminController.deletePlace);

router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.createCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

router.get('/events', adminController.getEvents);
router.get('/events/:id', adminController.getEvent);
router.post('/events', adminController.createEvent);
router.put('/events/:id', adminController.updateEvent);
router.delete('/events/:id', adminController.deleteEvent);

module.exports = router;
