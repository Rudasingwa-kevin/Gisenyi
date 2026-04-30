const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixWaterPlaces() {
  // Move Serena slightly inland / north
  await prisma.place.updateMany({
    where: { name: { contains: 'Serena' } },
    data: { lat: -1.6968, lon: 29.2619 }
  });

  // Move Hakuna Matata inland
  await prisma.place.updateMany({
    where: { name: { contains: 'Hakuna Matata' } },
    data: { lat: -1.7012, lon: 29.2585 }
  });

  // Move La Bella inland (east)
  await prisma.place.updateMany({
    where: { name: { contains: 'La Bella' } },
    data: { lat: -1.7315, lon: 29.2650 }
  });

  console.log('✅ Adjusted 5 shoreline properties onto dry land!');
  await prisma.$disconnect();
}

fixWaterPlaces();
