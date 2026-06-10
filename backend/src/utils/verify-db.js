const prisma = require('./prisma');

async function main() {
  const cats = await prisma.category.findMany();
  console.log('Categories:', JSON.stringify(cats, null, 2));

  const byCat = await prisma.place.groupBy({ by: ['catKey'], _count: true });
  console.log('\nPlaces by category:', JSON.stringify(byCat, null, 2));

  const total = await prisma.place.count();
  console.log(`\nTotal places: ${total}`);

  const sample = await prisma.place.findFirst();
  console.log('\nSample:', JSON.stringify(sample, null, 2));

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
