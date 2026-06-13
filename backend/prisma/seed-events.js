const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const events = [
  { title: 'Lake Kivu Jazz Night', description: 'An evening of smooth jazz under the stars by the shores of Lake Kivu. Featuring local and regional jazz musicians.', date: 'June 20, 2026', time: '7:00 PM', location: 'Kivu Serena Hotel', category: 'concert', price: '15,000 RWF', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2d3b4a5f?auto=format&fit=crop&q=80&w=1200&h=600', ticketLink: 'https://example.com/jazz-night' },
  { title: 'Comedy Under the Stars', description: 'Laugh the night away with Rwanda\'s top comedians at this outdoor comedy special.', date: 'June 25, 2026', time: '6:30 PM', location: 'Petit Stade', category: 'comedy', price: '10,000 RWF', image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&q=80&w=1200&h=600', ticketLink: 'https://example.com/comedy' },
  { title: 'Gisenyi Film Festival', description: 'A weekend celebration of African cinema with screenings, panels, and workshops.', date: 'July 3, 2026', time: '10:00 AM', location: 'Ubumwe Cultural Centre', category: 'movie', price: '8,000 RWF', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1200&h=600', ticketLink: '' },
  { title: 'Rwandan Cultural Night', description: 'Experience traditional Rwandan dance, drumming, and storytelling.', date: 'July 10, 2026', time: '5:00 PM', location: 'Lake Kivu Beach', category: 'cultural', price: '5,000 RWF', image: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=1200&h=600', ticketLink: 'https://example.com/cultural-night' },
  { title: 'Artisan Market & Exhibition', description: 'Browse works from local painters, sculptors, and craftspeople.', date: 'July 17, 2026', time: '9:00 AM', location: 'Gisenyi Promenade', category: 'arts', price: 'Free', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1200&h=600', ticketLink: '' },
  { title: 'Kivu Reggae Fest', description: 'A full-day reggae festival with top East African acts.', date: 'August 1, 2026', time: '2:00 PM', location: 'Kivu Beach Club', category: 'concert', price: '25,000 RWF', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=1200&h=600', ticketLink: 'https://example.com/reggae-fest' },
  { title: 'Sunset Painting Workshop', description: 'Guided watercolor painting session capturing the Lake Kivu sunset.', date: 'August 8, 2026', time: '4:00 PM', location: 'Paradise Malahide', category: 'arts', price: '20,000 RWF', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1200&h=600', ticketLink: '' },
  { title: 'CineMama: Women in Film', description: 'Screening of award-winning films directed by African women.', date: 'August 15, 2026', time: '3:00 PM', location: 'Ubumwe Cultural Centre', category: 'movie', price: '5,000 RWF', image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&q=80&w=1200&h=600', ticketLink: 'https://example.com/cinemama' },
  { title: 'Lake Kivu Half Marathon', description: 'Scenic half marathon along the lake shore. All fitness levels welcome.', date: 'August 22, 2026', time: '6:00 AM', location: 'Starting at Gisenyi Beach', category: 'concert', price: '12,000 RWF', image: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?auto=format&fit=crop&q=80&w=1200&h=600', ticketLink: '' },
  { title: 'Karaoke Night at Kivu Lounge', description: 'Sing your heart out with live band accompaniment.', date: 'June 27, 2026', time: '8:00 PM', location: 'Kivu Lounge', category: 'concert', price: 'Free', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200&h=600', ticketLink: '' },
  { title: 'Drum Workshop & Performance', description: 'Learn traditional Rwandan drumming techniques from master drummers.', date: 'July 24, 2026', time: '10:00 AM', location: 'Ubumwe Cultural Centre', category: 'cultural', price: '8,000 RWF', image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&q=80&w=1200&h=600', ticketLink: '' },
  { title: 'Gisenyi Food & Wine Festival', description: 'Taste the best of Rwandan cuisine paired with regional wines.', date: 'May 30, 2026', time: '12:00 PM', location: 'Kivu Serena Hotel Gardens', category: 'arts', price: '30,000 RWF', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1200&h=600', ticketLink: 'https://example.com/food-festival' },
];

async function seed() {
  for (const event of events) {
    await prisma.event.create({ data: event });
  }
  console.log('Seeded events');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
