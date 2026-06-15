const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

router.use(authMiddleware);

router.get('/places', adminController.getPlaces);
router.get('/places/:id', adminController.getPlace);
router.post('/places', validate(schemas.place), adminController.createPlace);
router.put('/places/:id', validate(schemas.place), adminController.updatePlace);
router.delete('/places/:id', adminController.deletePlace);

router.get('/categories', adminController.getCategories);
router.post('/categories', validate(schemas.category), adminController.createCategory);
router.put('/categories/:id', validate(schemas.category), adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

router.get('/events', adminController.getEvents);
router.get('/events/:id', adminController.getEvent);
router.post('/events', validate(schemas.event), adminController.createEvent);
router.put('/events/:id', validate(schemas.event), adminController.updateEvent);
router.delete('/events/:id', adminController.deleteEvent);

router.get('/calendar', adminController.getCalendarItems);
router.get('/calendar/:id', adminController.getCalendarItem);
router.post('/calendar', validate(schemas.calendarItem), adminController.createCalendarItem);
router.put('/calendar/:id', validate(schemas.calendarItem), adminController.updateCalendarItem);
router.delete('/calendar/:id', adminController.deleteCalendarItem);

router.get('/gallery', adminController.getGalleryItems);
router.get('/gallery/:id', adminController.getGalleryItem);
router.post('/gallery', validate(schemas.galleryItem), adminController.createGalleryItem);
router.put('/gallery/:id', validate(schemas.galleryItem), adminController.updateGalleryItem);
router.delete('/gallery/:id', adminController.deleteGalleryItem);

router.get('/feedback', adminController.getFeedback);

router.get('/visitor-stats', adminController.getVisitorStats);

module.exports = router;
