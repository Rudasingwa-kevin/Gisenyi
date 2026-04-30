const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const places = await prisma.place.findMany({
    where: {
      name: {
        contains: 'Inzozi',
        mode: 'insensitive'
      }
    }
  });
  console.log('Inzozi Places:', places.map(p => ({ id: p.id, name: p.name, lat: p.lat, lon: p.lon, cat: p.catKey })));
  await prisma.$disconnect();
}

check();
