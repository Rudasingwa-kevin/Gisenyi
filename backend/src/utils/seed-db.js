const prisma = require('./prisma');

const CATEGORY_MAP = {
  hotel: 'hotels',
  restaurant: 'dining',
  cafe: 'dining',
  bar: 'dining',
  shop: 'shopping',
  practical: 'practical',
  attraction: 'activities',
  culture: 'activities',
  other: 'activities',
};

const CATEGORIES = {
  hotels: { label: 'Hotels', icon: 'hotel', color: '#C9A84C' },
  dining: { label: 'Dining', icon: 'utensils', color: '#E8593C' },
  nightlife: { label: 'Nightlife', icon: 'cocktail', color: '#7B3FA0' },
  beach: { label: 'Beach', icon: 'umbrella-beach', color: '#1A8A9A' },
  wellness: { label: 'Wellness', icon: 'spa', color: '#2D8A5E' },
  activities: { label: 'Activities', icon: 'hiking', color: '#F39C12' },
  shopping: { label: 'Shopping', icon: 'shopping-bag', color: '#E91E63' },
  practical: { label: 'Practical', icon: 'info-circle', color: '#4A6A8A' },
};

async function seed() {
  console.log('🌱 Seeding database...');

  for (const [id, cat] of Object.entries(CATEGORIES)) {
    await prisma.category.upsert({
      where: { id },
      update: cat,
      create: { id, ...cat },
    });
  }
  console.log('✅ Categories seeded');

  const snapshot = require('./snapshot.json');
  const rawPlaces = Array.isArray(snapshot) ? snapshot : (snapshot.places || []);

  const existingCount = await prisma.place.count();
  if (existingCount > 0) {
    console.log(`⚠️  ${existingCount} places already exist — clearing...`);
    await prisma.place.deleteMany();
  }

  let seeded = 0;
  for (const p of rawPlaces) {
    const rawCat = p.cat || p.category || 'other';
    const catKey = CATEGORY_MAP[rawCat] || 'activities';

    const lat = p.lat || p.coordinates?.latitude;
    const lon = p.lon || p.coordinates?.longitude;
    if (lat == null || lon == null) continue;

    await prisma.place.create({
      data: {
        osmId: p.id ? String(p.id) : `snapshot-${seeded}`,
        name: p.name || 'Unknown Place',
        lat,
        lon,
        catKey,
        description: p.desc || p.description || null,
        image: p.image || null,
        rating: p.rating ?? 4.5,
        tags: p.tags || p.details || {},
      },
    });
    seeded++;
  }

  console.log(`✅ ${seeded} places seeded`);

  await prisma.$disconnect();
  console.log('🎉 Database seeding complete!');
}

seed().catch((e) => {
  console.error('❌ Seed failed:', e);
  prisma.$disconnect().catch(() => {});
  process.exit(1);
});
