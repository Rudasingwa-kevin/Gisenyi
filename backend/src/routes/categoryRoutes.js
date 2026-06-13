const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { label: 'asc' } });
    res.json(categories);
  } catch (error) { next(error); }
});

module.exports = router;
