const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const places = await prisma.place.findMany();
  
  // A rough heuristic for Lake Kivu in Gisenyi: 
  // The coast is roughly a line from [-1.695, 29.258] down to [-1.730, 29.270]
  // Anything South/West of this line might be in the water.
  
  const suspicious = places.filter(p => {
    // Simple checks for common "in-water" zones
    if (p.lat < -1.700 && p.lon < 29.255) return true;
    if (p.lat < -1.705 && p.lon < 29.260) return true;
    if (p.lat < -1.710 && p.lon < 29.263) return true;
    return false;
  });

  console.log(`Found ${suspicious.length} potentially in-water places:`);
  suspicious.forEach(p => {
    console.log(`[${p.lat.toFixed(4)}, ${p.lon.toFixed(4)}] ${p.name} (${p.catKey})`);
  });
  
  await prisma.$disconnect();
}

check();
