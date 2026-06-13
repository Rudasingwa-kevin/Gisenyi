const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const items = [
  { title: 'Lake Kivu Boat Cruise', date: '2026-06-20', time: '10:00', type: 'event', description: 'Scenic boat cruise on Lake Kivu with sunset views', color: '#C9A84C', location: 'Lake Kivu Shore' },
  { title: 'Farmers Market', date: '2026-06-20', time: '08:00', type: 'event', description: 'Weekly farmers market featuring local produce and crafts', color: '#2D8A5E', location: 'Central Market' },
  { title: 'Yoga at the Lake', date: '2026-06-21', time: '06:30', type: 'event', description: 'Morning yoga session by the lake', color: '#4A90D9', location: 'Kivu Beach' },
  { title: 'Confirm hotel booking', date: '2026-06-18', type: 'reminder', description: 'Call Serena Hotel to confirm weekend reservation', color: '#E8593C' },
  { title: 'Cultural Dance Festival', date: '2026-07-04', time: '15:00', type: 'event', description: 'Traditional Rwandan dance performances', color: '#C9A84C', location: 'Petit Stade' },
];

async function seed() {
  for (const item of items) {
    await prisma.calendarItem.create({ data: item });
  }
  console.log('Seeded calendar items');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
