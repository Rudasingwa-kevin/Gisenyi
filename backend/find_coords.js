const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const places = await prisma.place.findMany();
  
  // Find places very close to the user's coordinates
  const targetLat = -1.6989222617953061;
  const targetLon = 29.25542911630193;
  
  const matches = places.filter(p => {
    // Check within ~0.001 degrees
    return Math.abs(p.lat - targetLat) < 0.005 && Math.abs(p.lon - targetLon) < 0.005;
  });

  console.log(`Found ${matches.length} places near that coordinate:`);
  matches.forEach(p => {
    console.log(`[${p.lat}, ${p.lon}] ${p.name} (ID: ${p.id})`);
  });
  
  await prisma.$disconnect();
}

check();
