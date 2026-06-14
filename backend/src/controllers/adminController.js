const prisma = require('../utils/prisma');

function paginate(page, limit) {
  const p = Math.max(1, parseInt(page) || 1);
  const l = Math.min(100, Math.max(1, parseInt(limit) || 20));
  return { skip: (p - 1) * l, take: l, page: p, limit: l };
}

exports.getPlaces = async (req, res, next) => {
  try {
    const { skip, take, page, limit } = paginate(req.query.page, req.query.limit);
    const [data, total] = await Promise.all([
      prisma.place.findMany({ skip, take, orderBy: { name: 'asc' } }),
      prisma.place.count()
    ]);
    res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
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
    const { skip, take, page, limit } = paginate(req.query.page, req.query.limit);
    const [data, total] = await Promise.all([
      prisma.category.findMany({ skip, take, orderBy: { label: 'asc' } }),
      prisma.category.count()
    ]);
    res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
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
    const { skip, take, page, limit } = paginate(req.query.page, req.query.limit);
    const [data, total] = await Promise.all([
      prisma.event.findMany({ skip, take, orderBy: { date: 'asc' } }),
      prisma.event.count()
    ]);
    res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
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
    const { month, year, page: pg, limit: lm } = req.query;
    const { skip, take, page, limit } = paginate(pg, lm);
    const where = {};
    if (month && year) {
      const m = String(month).padStart(2, '0');
      where.date = { startsWith: `${year}-${m}` };
    }
    const [data, total] = await Promise.all([
      prisma.calendarItem.findMany({ where, skip, take, orderBy: [{ date: 'asc' }, { time: 'asc' }] }),
      prisma.calendarItem.count({ where })
    ]);
    res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
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

// Gallery CRUD
exports.getGalleryItems = async (req, res, next) => {
  try {
    const { skip, take, page, limit } = paginate(req.query.page, req.query.limit);
    const [data, total] = await Promise.all([
      prisma.galleryItem.findMany({ skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.galleryItem.count()
    ]);
    res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};

exports.getGalleryItem = async (req, res, next) => {
  try {
    const item = await prisma.galleryItem.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Gallery item not found' });
    res.json(item);
  } catch (error) { next(error); }
};

exports.createGalleryItem = async (req, res, next) => {
  try {
    const item = await prisma.galleryItem.create({ data: req.body });
    res.status(201).json(item);
  } catch (error) { next(error); }
};

exports.updateGalleryItem = async (req, res, next) => {
  try {
    const item = await prisma.galleryItem.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(item);
  } catch (error) { next(error); }
};

exports.deleteGalleryItem = async (req, res, next) => {
  try {
    await prisma.galleryItem.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) { next(error); }
};

// Feedback
exports.getFeedback = async (req, res, next) => {
  try {
    const { skip, take, page, limit } = paginate(req.query.page, req.query.limit);
    const [data, total] = await Promise.all([
      prisma.feedback.findMany({ skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.feedback.count()
    ]);
    res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};
