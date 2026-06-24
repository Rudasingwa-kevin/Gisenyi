import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

const routes = [
  {
    path: '/',
    title: 'Gisenyi | Explore Lake Kivu, Rwanda',
    description: 'Discover the beauty of Gisenyi, Rwanda — beaches, luxury stays, events, culture, and unforgettable experiences on the shores of Lake Kivu.',
    image: 'https://gisenyi.top/images/og-home.svg',
  },
  {
    path: '/stays',
    title: 'Luxury Stays in Gisenyi | Hotels & Resorts',
    description: 'Find the best hotels, resorts, and unique accommodations in Gisenyi.',
    image: 'https://gisenyi.top/images/og-stays.svg',
  },
  {
    path: '/events',
    title: 'Events in Gisenyi | Culture & Entertainment',
    description: 'Explore festivals, concerts, nightlife, and cultural events in Gisenyi.',
    image: 'https://gisenyi.top/images/og-events.svg',
  },
  {
    path: '/gallery',
    title: 'Gisenyi Gallery | Moments Around Lake Kivu',
    description: 'Experience the beauty of Gisenyi through breathtaking photography.',
    image: 'https://gisenyi.top/images/og-gallery.svg',
  },
  {
    path: '/map',
    title: 'Explore Gisenyi Map | Discover Attractions',
    description: 'Navigate beaches, hotels, restaurants, and attractions around Gisenyi.',
    image: 'https://gisenyi.top/images/og-map.svg',
  },
  {
    path: '/history',
    title: 'History of Gisenyi | Heritage & Legacy',
    description: 'Learn about the rich history and cultural heritage of Gisenyi, Rwanda.',
    image: 'https://gisenyi.top/images/og-history.svg',
  },
  {
    path: '/calendar',
    title: "Events Calendar | What's Happening in Gisenyi",
    description: 'Stay updated with upcoming events, festivals, and activities in Gisenyi.',
    image: 'https://gisenyi.top/images/og-calendar.svg',
  },
];

function generateHTML(route, indexContent) {
  const pageTitle = `${route.title} | Gisenyi | Lake Kivu, Rwanda`;
  
  return indexContent
    .replace(
      '<title>Gisenyi — The Riviera of Central Africa | Lake Kivu, Rwanda</title>',
      `<title>${pageTitle}</title>`
    )
    .replace(
      '<meta property="og:title" content="Gisenyi | Explore Lake Kivu, Rwanda" />',
      `<meta property="og:title" content="${pageTitle}" />`
    )
    .replace(
      '<meta property="og:description" content="Discover the beauty of Gisenyi, Rwanda — beaches, luxury stays, events, culture, and unforgettable experiences on the shores of Lake Kivu." />',
      `<meta property="og:description" content="${route.description}" />`
    )
    .replace(
      '<meta property="og:image" content="https://gisenyi.top/images/og-home.svg" />',
      `<meta property="og:image" content="${route.image}" />`
    )
    .replace(
      '<meta property="og:url" content="https://gisenyi.top" />',
      `<meta property="og:url" content="https://gisenyi.top${route.path}" />`
    )
    .replace(
      '<meta name="twitter:title" content="Gisenyi | Explore Lake Kivu, Rwanda" />',
      `<meta name="twitter:title" content="${pageTitle}" />`
    )
    .replace(
      '<meta name="twitter:description" content="Discover the beauty of Gisenyi, Rwanda — beaches, luxury stays, events, culture, and unforgettable experiences on the shores of Lake Kivu." />',
      `<meta name="twitter:description" content="${route.description}" />`
    )
    .replace(
      '<meta name="twitter:image" content="https://gisenyi.top/images/og-home.svg" />',
      `<meta name="twitter:image" content="${route.image}" />`
    )
    .replace(
      '<meta name="twitter:url" content="https://gisenyi.top" />',
      `<meta name="twitter:url" content="https://gisenyi.top${route.path}" />`
    )
    .replace(
      '<link rel="canonical" href="https://gisenyi.top" />',
      `<link rel="canonical" href="https://gisenyi.top${route.path}" />`
    )
    .replace(
      '<meta name="description" content="Discover Gisenyi — the Riviera of Central Africa. Explore hotels, restaurants, attractions and more on the shores of Lake Kivu, Rwanda." />',
      `<meta name="description" content="${route.description}" />`
    );
}

async function prerender() {
  const indexPath = path.join(distDir, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.error('dist/index.html not found. Run "npm run build" first.');
    process.exit(1);
  }
  
  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  
  for (const route of routes) {
    const routeDir = route.path === '/' ? distDir : path.join(distDir, route.path);
    
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    
    const html = generateHTML(route, indexContent);
    const outputPath = path.join(routeDir, 'index.html');
    
    fs.writeFileSync(outputPath, html, 'utf-8');
    console.log(`Prerendered: ${route.path} -> ${outputPath}`);
  }
  
  console.log('\nPrerendering complete! Social media crawlers can now read page-specific metadata.');
}

prerender().catch(console.error);
