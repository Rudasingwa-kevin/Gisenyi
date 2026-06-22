const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const { validate, schemas } = require('../middleware/validate');

router.post('/', validate(schemas.track), (req, res) => {
  res.status(201).json({ ok: true });
  const { sessionId, page, referrer } = req.body;
  prisma.visit.create({
    data: { sessionId, page, referrer: referrer || null }
  }).catch(() => {});
});

module.exports = router;
