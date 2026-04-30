const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const targetLat = -1.6989222617953061;
  const targetLon = 29.25542911630193;
  
  const place = await prisma.place.findFirst({
    where: {
      AND: [
        { lat: { gte: targetLat - 0.0001, lte: targetLat + 0.0001 } },
        { lon: { gte: targetLon - 0.0001, lte: targetLon + 0.0001 } }
      ]
    }
  });
  
  if (place) {
    console.log('Found place at these coordinates:', place);
  } else {
    console.log('No place found at exactly these coordinates.');
    // Check closest again with more precision
    const all = await prisma.place.findMany();
    let closest = null;
    let minDist = Infinity;
    all.forEach(p => {
        const d = Math.sqrt(Math.pow(p.lat - targetLat, 2) + Math.pow(p.lon - targetLon, 2));
        if (d < minDist) {
            minDist = d;
            closest = p;
        }
    });
    console.log('Closest place found:', closest.name, 'at', closest.lat, closest.lon, 'distance:', minDist);
  }
  await prisma.$disconnect();
}

check();
