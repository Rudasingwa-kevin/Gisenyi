const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { validateQuery, validateId, schemas } = require('../middleware/validate');

router.get('/', validateQuery(schemas.calendarQuery), calendarController.getAll);
router.get('/:id', validateId, calendarController.getById);

module.exports = router;
