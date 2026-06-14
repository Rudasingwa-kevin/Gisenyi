const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');

router.post('/', async (req, res, next) => {
  try {
    const { name, email, rating, message, page } = req.body;
    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message are required' });
    }
    const feedback = await prisma.feedback.create({
      data: {
        name,
        email: email || null,
        rating: Math.min(5, Math.max(1, parseInt(rating) || 5)),
        message,
        page: page || null
      }
    });
    res.status(201).json(feedback);
  } catch (error) { next(error); }
});

module.exports = router;
