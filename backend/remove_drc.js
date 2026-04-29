const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function removeDRC() {
  const result = await prisma.place.deleteMany({
    where: {
      lon: {
        lt: 29.2435
      }
    }
  });
  console.log(`✅ Successfully filtered out ${result.count} locations located in the DRC (Goma).`);
  await prisma.$disconnect();
}

removeDRC();
