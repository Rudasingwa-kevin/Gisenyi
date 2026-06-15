const { z } = require('zod');

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data;
    next();
  };
}

const schemas = {
  login: z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
  }),

  place: z.object({
    name: z.string().min(1, 'Name is required'),
    category: z.string().min(1, 'Category is required'),
    description: z.string().optional().default(''),
    latitude: z.coerce.number().min(-90).max(90).optional(),
    longitude: z.coerce.number().min(-180).max(180).optional(),
    address: z.string().optional().default(''),
    phone: z.string().optional().default(''),
    website: z.string().optional().default(''),
    image: z.string().optional().default(''),
    rating: z.coerce.number().min(0).max(5).optional().default(0),
    priceLevel: z.coerce.number().min(0).max(4).optional().default(0),
  }),

  event: z.object({
    title: z.string().min(1, 'Title is required'),
    date: z.string().min(1, 'Date is required'),
    time: z.string().optional().default(''),
    location: z.string().optional().default(''),
    description: z.string().optional().default(''),
    category: z.string().optional().default(''),
    image: z.string().optional().default(''),
    ticketLink: z.string().optional().default(''),
  }),

  calendarItem: z.object({
    title: z.string().min(1, 'Title is required'),
    date: z.string().min(1, 'Date is required'),
    category: z.string().optional().default(''),
    description: z.string().optional().default(''),
    time: z.string().optional().default(''),
  }),

  category: z.object({
    id: z.string().min(1, 'ID is required'),
    label: z.string().min(1, 'Label is required'),
    icon: z.string().optional().default('📍'),
    color: z.string().optional().default('#C9A84C'),
  }),

  galleryItem: z.object({
    url: z.string().min(1, 'URL is required'),
    caption: z.string().optional().default(''),
    type: z.enum(['image', 'video']).optional().default('image'),
  }),

  feedback: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    rating: z.coerce.number().min(1).max(5).optional().default(5),
    message: z.string().min(1, 'Message is required'),
    page: z.string().optional().default(''),
  }),
};

module.exports = { validate, schemas };
