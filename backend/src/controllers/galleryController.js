const prisma = require('../utils/prisma');

exports.getAll = async (req, res, next) => {
  try {
    const items = await prisma.galleryItem.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(items);
  } catch (error) { next(error); }
};
