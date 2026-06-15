const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate, schemas } = require('../middleware/validate');

router.post('/login', validate(schemas.login), authController.login);

module.exports = router;
