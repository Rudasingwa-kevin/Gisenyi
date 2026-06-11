const prisma = require('../utils/prisma');

exports.getPlaces = async (req, res, next) => {
  try {
    const places = await prisma.place.findMany({ orderBy: { name: 'asc' } });
    res.json(places);
  } catch (error) { next(error); }
};

exports.getPlace = async (req, res, next) => {
  try {
    const place = await prisma.place.findUnique({ where: { id: req.params.id } });
    if (!place) return res.status(404).json({ error: 'Place not found' });
    res.json(place);
  } catch (error) { next(error); }
};

exports.createPlace = async (req, res, next) => {
  try {
    const place = await prisma.place.create({ data: req.body });
    res.status(201).json(place);
  } catch (error) { next(error); }
};

exports.updatePlace = async (req, res, next) => {
  try {
    const place = await prisma.place.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(place);
  } catch (error) { next(error); }
};

exports.deletePlace = async (req, res, next) => {
  try {
    await prisma.place.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) { next(error); }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { label: 'asc' } });
    res.json(categories);
  } catch (error) { next(error); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const category = await prisma.category.create({ data: req.body });
    res.status(201).json(category);
  } catch (error) { next(error); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(category);
  } catch (error) { next(error); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) { next(error); }
};
