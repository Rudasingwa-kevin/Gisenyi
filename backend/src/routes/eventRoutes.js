const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { validateId } = require('../middleware/validate');

router.get('/', eventController.getAllEvents);
router.get('/:id', validateId, eventController.getEventById);

module.exports = router;
