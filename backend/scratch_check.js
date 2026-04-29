const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const places = await prisma.place.findMany();
  
  // Let's print out places with longitude < 29.25 to see their names
  const westernPlaces = places.filter(p => p.lon < 29.25).sort((a, b) => a.lon - b.lon);
  
  console.log('Places ordered by longitude (West to East):');
  westernPlaces.forEach(p => {
    console.log(`[${p.lon.toFixed(4)}, ${p.lat.toFixed(4)}] ${p.name}`);
  });
  
  console.log(`Total places: ${places.length}`);
  console.log(`Places west of 29.245: ${places.filter(p => p.lon < 29.245).length}`);
  
  await prisma.$disconnect();
}

check();
