const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  // 1. Move Bistro Restaurant & Wine Garage inland
  await prisma.place.updateMany({
    where: { name: { contains: 'Bistro Restaurant & Wine Garage' } },
    data: { lat: -1.6990, lon: 29.2575 }
  });

  // 2. Remove Maison indienne and Maison biélorusse as they are in Goma (DRC)
  // These were missed by the previous cutoff
  const result = await prisma.place.deleteMany({
    where: {
      OR: [
        { name: 'Maison indienne' },
        { name: 'Maison biélorusse' },
        { lon: { lt: 29.245 } } // Tighten the cutoff to remove more DRC edge cases
      ]
    }
  });

  console.log(`✅ Moved Bistro Restaurant inland and removed ${result.count} more DRC locations.`);
  await prisma.$disconnect();
}

fix();
