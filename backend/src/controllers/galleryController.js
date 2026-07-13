const prisma = require('../utils/prisma');

exports.getAll = async (req, res, next) => {
  try {
    const items = await prisma.galleryItem.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(items);
  } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
  try {
    const item = await prisma.galleryItem.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ data: item });
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const { url, caption, type } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });
    const item = await prisma.galleryItem.create({ data: { url, caption, type } });
    res.status(201).json(item);
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const { url, caption, type } = req.body;
    const item = await prisma.galleryItem.update({
      where: { id: req.params.id },
      data: { url, caption, type },
    });
    res.json(item);
  } catch (error) { next(error); }
};

exports.remove = async (req, res, next) => {
  try {
    await prisma.galleryItem.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) { next(error); }
};
