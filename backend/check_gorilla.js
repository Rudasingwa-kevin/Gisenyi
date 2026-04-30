const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const place = await prisma.place.findFirst({
    where: { name: { contains: 'Gorillas Lake Kivu Hotel' } }
  });
  console.log('Gorillas Lake Kivu Hotel:', place);
  await prisma.$disconnect();
}

check();
