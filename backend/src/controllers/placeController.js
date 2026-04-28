const prisma = require('../utils/prisma');

exports.getAllPlaces = async (req, res, next) => {
    try {
        const { category } = req.query;
        const where = category && category !== 'all' ? { catKey: category } : {};
        
        const places = await prisma.place.findMany({
            where,
            orderBy: { name: 'asc' }
        });
        res.json(places);
    } catch (error) {
        next(error);
    }
};

exports.getPlaceById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const place = await prisma.place.findUnique({
            where: { id }
        });
        if (!place) return res.status(404).json({ error: 'Place not found' });
        res.json(place);
    } catch (error) {
        next(error);
    }
};

exports.createPlace = async (req, res, next) => {
    try {
        const place = await prisma.place.create({
            data: req.body
        });
        res.status(201).json(place);
    } catch (error) {
        next(error);
    }
};
