const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');

router.post('/', async (req, res, next) => {
  try {
    const { sessionId, page, referrer } = req.body;
    if (!sessionId || !page) return res.status(400).json({ error: 'sessionId and page are required' });
    await prisma.visit.create({
      data: { sessionId, page, referrer: referrer || null }
    });
    res.status(201).json({ ok: true });
  } catch (error) { next(error); }
});

module.exports = router;
