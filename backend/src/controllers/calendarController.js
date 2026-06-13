const prisma = require('../utils/prisma');

exports.getAll = async (req, res, next) => {
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

exports.getById = async (req, res, next) => {
  try {
    const item = await prisma.calendarItem.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Calendar item not found' });
    res.json(item);
  } catch (error) { next(error); }
};
