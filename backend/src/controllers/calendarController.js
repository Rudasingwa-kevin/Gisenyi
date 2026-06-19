const prisma = require('../utils/prisma');

exports.getAll = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const where = {};
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      where.date = { gte: start, lt: end };
    }
    const items = await prisma.calendarItem.findMany({ where, orderBy: [{ date: 'asc' }, { time: 'asc' }] });
    res.json(items);
  } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
  try {
    const item = await prisma.calendarItem.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Calendar item not found' });
    res.json(item);
  } catch (error) { next(error); }
};
