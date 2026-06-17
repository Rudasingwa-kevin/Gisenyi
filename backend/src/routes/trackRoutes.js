const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const { validate, schemas } = require('../middleware/validate');

router.post('/', validate(schemas.track), async (req, res, next) => {
  try {
    const { sessionId, page, referrer } = req.body;
    await prisma.visit.create({
      data: { sessionId, page, referrer: referrer || null }
    });
    res.status(201).json({ ok: true });
  } catch (error) { next(error); }
});

module.exports = router;
