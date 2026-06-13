const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.event.deleteMany()
  .then(() => console.log('Deleted all events'))
  .then(() => prisma.$disconnect());
