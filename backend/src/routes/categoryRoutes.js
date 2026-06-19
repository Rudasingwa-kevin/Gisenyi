const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');

router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { label: 'asc' } });
    res.json(categories);
  } catch (error) { next(error); }
});

module.exports = router;
