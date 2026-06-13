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

// Events CRUD
exports.getEvents = async (req, res, next) => {
  try {
    const events = await prisma.event.findMany({ orderBy: { date: 'asc' } });
    res.json(events);
  } catch (error) { next(error); }
};

exports.getEvent = async (req, res, next) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error) { next(error); }
};

exports.createEvent = async (req, res, next) => {
  try {
    const event = await prisma.event.create({ data: req.body });
    res.status(201).json(event);
  } catch (error) { next(error); }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(event);
  } catch (error) { next(error); }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) { next(error); }
};

// Calendar Items CRUD
exports.getCalendarItems = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const where = {};
    if (month && year) {
      const m = String(month).padStart(2, '0');
      where.date = { startsWith: `${year}-${m}` };
    }
    const items = await prisma.calendarItem.findMany({ where, orderBy: [{ date: 'asc' }, { time: 'asc' }] });
    res.json(items);
  } catch (error) { next(error); }
};

exports.getCalendarItem = async (req, res, next) => {
  try {
    const item = await prisma.calendarItem.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Calendar item not found' });
    res.json(item);
  } catch (error) { next(error); }
};

exports.createCalendarItem = async (req, res, next) => {
  try {
    const item = await prisma.calendarItem.create({ data: req.body });
    res.status(201).json(item);
  } catch (error) { next(error); }
};

exports.updateCalendarItem = async (req, res, next) => {
  try {
    const item = await prisma.calendarItem.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(item);
  } catch (error) { next(error); }
};

exports.deleteCalendarItem = async (req, res, next) => {
  try {
    await prisma.calendarItem.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) { next(error); }
};
