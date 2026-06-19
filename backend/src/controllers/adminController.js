const os = require('os');
const prisma = require('../utils/prisma');

function paginate(page, limit) {
  const p = Math.max(1, parseInt(page) || 1);
  const l = Math.min(100, Math.max(1, parseInt(limit) || 20));
  return { skip: (p - 1) * l, take: l, page: p, limit: l };
}

exports.getPlaces = async (req, res, next) => {
  try {
    const { skip, take, page, limit } = paginate(req.query.page, req.query.limit);
    const where = {};
    const [data, total] = await Promise.all([
      prisma.place.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
      prisma.place.count({ where })
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
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      where.date = { gte: start, lt: end };
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

exports.getVisitorStats = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalVisits, uniqueVisitors, dailyVisits, topPages] = await Promise.all([
      prisma.visit.count(),
      prisma.visit.groupBy({ by: ['sessionId'], _count: true }),
      prisma.visit.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' }
      }),
      prisma.visit.groupBy({
        by: ['page'],
        _count: true,
        orderBy: { _count: { page: 'desc' } },
        take: 10
      })
    ]);

    const dailyMap = {};
    dailyVisits.forEach(v => {
      const day = v.createdAt.toISOString().slice(0, 10);
      dailyMap[day] = (dailyMap[day] || 0) + 1;
    });

    const daily = Object.entries(dailyMap).map(([date, count]) => ({ date, count }));

    res.json({
      totalVisits,
      uniqueVisitors: uniqueVisitors.length,
      daily,
      topPages: topPages.map(p => ({ page: p.page, count: p._count }))
    });
  } catch (error) { next(error); }
};

exports.getSystemInfo = async (req, res, next) => {
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbPing = Date.now() - start;

    const mem = process.memoryUsage();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();

    res.json({
      server: {
        uptime: process.uptime(),
        nodeVersion: process.version,
        platform: os.platform(),
        arch: os.arch(),
        hostname: os.hostname(),
        cpus: os.cpus().length,
        env: process.env.NODE_ENV || 'development'
      },
      memory: {
        process: { rss: mem.rss, heapUsed: mem.heapUsed, heapTotal: mem.heapTotal },
        system: { total: totalMem, free: freeMem, used: totalMem - freeMem }
      },
      database: { status: 'connected', pingMs: dbPing }
    });
  } catch (error) {
    res.json({
      server: {
        uptime: process.uptime(),
        nodeVersion: process.version,
        platform: os.platform(),
        arch: os.arch(),
        hostname: os.hostname(),
        cpus: os.cpus().length,
        env: process.env.NODE_ENV || 'development'
      },
      memory: {
        process: { rss: 0, heapUsed: 0, heapTotal: 0 },
        system: { total: os.totalmem(), free: os.freemem(), used: os.totalmem() - os.freemem() }
      },
      database: { status: 'disconnected', pingMs: null }
    });
  }
};
