const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const event = await prisma.event.findFirst();
  console.log(event ? 'Events in DB: YES' : 'Events in DB: NO');
  const place = await prisma.place.findFirst();
  console.log(place ? 'Places in DB: YES' : 'Places in DB: NO');
  const cat = await prisma.category.findFirst();
  console.log(cat ? 'Categories in DB: YES' : 'Categories in DB: NO');
  const cal = await prisma.calendarItem.findFirst();
  console.log(cal ? 'Calendar items in DB: YES' : 'Calendar items in DB: NO');
  await prisma.$disconnect();
}

test().catch(console.error);
