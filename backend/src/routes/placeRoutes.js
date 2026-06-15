const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');
const { validate, schemas } = require('../middleware/validate');

router.get('/', placeController.getAllPlaces);
router.get('/:id', placeController.getPlaceById);
router.post('/', validate(schemas.place), placeController.createPlace);

module.exports = router;
