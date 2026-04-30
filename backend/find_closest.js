const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const places = await prisma.place.findMany();
  
  const targetLat = -1.6989222617953061;
  const targetLon = 29.25542911630193;
  
  let closestPlace = null;
  let minDistance = Infinity;
  
  places.forEach(p => {
    // Basic Euclidean distance for quick check
    const dist = Math.sqrt(Math.pow(p.lat - targetLat, 2) + Math.pow(p.lon - targetLon, 2));
    if (dist < minDistance) {
      minDistance = dist;
      closestPlace = p;
    }
  });

  console.log(`Closest place is: [${closestPlace.lat}, ${closestPlace.lon}] ${closestPlace.name} (Distance: ${minDistance})`);
  await prisma.$disconnect();
}

check();
