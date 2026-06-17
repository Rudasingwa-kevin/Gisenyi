const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/auth');
const { validate, validateId, schemas } = require('../middleware/validate');

router.use(authMiddleware);

router.get('/places', adminController.getPlaces);
router.get('/places/:id', validateId, adminController.getPlace);
router.post('/places', validate(schemas.place), adminController.createPlace);
router.put('/places/:id', validateId, validate(schemas.place), adminController.updatePlace);
router.delete('/places/:id', validateId, adminController.deletePlace);

router.get('/categories', adminController.getCategories);
router.post('/categories', validate(schemas.category), adminController.createCategory);
router.put('/categories/:id', validateId, validate(schemas.category), adminController.updateCategory);
router.delete('/categories/:id', validateId, adminController.deleteCategory);

router.get('/events', adminController.getEvents);
router.get('/events/:id', validateId, adminController.getEvent);
router.post('/events', validate(schemas.event), adminController.createEvent);
router.put('/events/:id', validateId, validate(schemas.event), adminController.updateEvent);
router.delete('/events/:id', validateId, adminController.deleteEvent);

router.get('/calendar', adminController.getCalendarItems);
router.get('/calendar/:id', validateId, adminController.getCalendarItem);
router.post('/calendar', validate(schemas.calendarItem), adminController.createCalendarItem);
router.put('/calendar/:id', validateId, validate(schemas.calendarItem), adminController.updateCalendarItem);
router.delete('/calendar/:id', validateId, adminController.deleteCalendarItem);

router.get('/gallery', adminController.getGalleryItems);
router.get('/gallery/:id', validateId, adminController.getGalleryItem);
router.post('/gallery', validate(schemas.galleryItem), adminController.createGalleryItem);
router.put('/gallery/:id', validateId, validate(schemas.galleryItem), adminController.updateGalleryItem);
router.delete('/gallery/:id', validateId, adminController.deleteGalleryItem);

router.get('/feedback', adminController.getFeedback);

router.get('/visitor-stats', adminController.getVisitorStats);
router.get('/system', adminController.getSystemInfo);

module.exports = router;
