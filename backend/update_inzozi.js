const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function update() {
  const result = await prisma.place.updateMany({
    where: { name: 'Inzozi Nziza Café' },
    data: { lat: -1.6995, lon: 29.2580 } // Adjusting further inland
  });
  console.log(`✅ Updated coordinates for ${result.count} place(s) named "Inzozi Nziza Café". Moved to dry land.`);
  await prisma.$disconnect();
}

update();
