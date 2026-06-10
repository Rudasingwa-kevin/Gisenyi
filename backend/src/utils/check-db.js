const prisma = require('./prisma');

async function main() {
  const places = await prisma.place.findMany({ take: 5 });
  console.log('Sample places:', JSON.stringify(places, null, 2));

  const byCat = await prisma.place.groupBy({ by: ['catKey'], _count: true });
  console.log('\nBy category:', JSON.stringify(byCat, null, 2));

  const total = await prisma.place.count();
  console.log(`\nTotal places: ${total}`);

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
