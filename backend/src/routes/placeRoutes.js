const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');
const { validate, validateQuery, validateId, schemas } = require('../middleware/validate');

router.get('/', validateQuery(schemas.placeQuery), placeController.getAllPlaces);
router.get('/featured', placeController.getFeaturedPlaces);
router.get('/:id', validateId, placeController.getPlaceById);
router.post('/', validate(schemas.place), placeController.createPlace);

module.exports = router;
