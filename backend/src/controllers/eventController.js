const prisma = require('../utils/prisma');

exports.getAllEvents = async (req, res, next) => {
  try {
    const { category } = req.query;
    const where = category && category !== 'all' ? { category } : {};
    const events = await prisma.event.findMany({
      where,
      orderBy: { date: 'asc' }
    });
    res.json(events);
  } catch (error) { next(error); }
};

exports.getEventById = async (req, res, next) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error) { next(error); }
};
