require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../src/utils/prisma');

beforeAll(async () => {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const existing = await prisma.user.findUnique({ where: { username } });
  if (!existing) {
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { username, password: hashed } });
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});
