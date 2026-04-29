const axios = require('axios');
const prisma = require('./prisma');

const INTERPRETERS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://lz4.overpass-api.de/api/interpreter'
];

const QUERIES = [
    { key: 'hotels', q: '(node["tourism"~"hotel|guest_house|resort|hostel"](around:5000,-1.7019,29.2564);way["tourism"~"hotel|guest_house|resort|hostel"](around:5000,-1.7019,29.2564);)' },
    { key: 'dining', q: 'node["amenity"~"restaurant|cafe|bar|pub|nightclub"](around:5000,-1.7019,29.2564);' },
    { key: 'practical', q: 'node["amenity"~"bank|pharmacy|marketplace|hospital|clinic"](around:5000,-1.7019,29.2564);' },
    { key: 'leisure', q: 'node["leisure"](around:5000,-1.7019,29.2564);' },
    { key: 'shop', q: 'node["shop"](around:5000,-1.7019,29.2564);' },
    { key: 'tourism', q: 'node["tourism"~"attraction|viewpoint|museum|gallery|information"](around:5000,-1.7019,29.2564);' }
];

async function fetchWithRetry(query, retries = 3) {
    for (let i = 0; i < retries; i++) {
        const interpreter = INTERPRETERS[i % INTERPRETERS.length];
        try {
            const url = `${interpreter}?data=[out:json][timeout:90];${query}out body;%3E;out skel qt;`;
            const { data } = await axios.get(url, { timeout: 100000 });
            return data;
        } catch (err) {
            console.warn(`⚠️ Attempt ${i + 1} failed on ${interpreter}. Retrying...`);
            if (i === retries - 1) throw err;
            await new Promise(r => setTimeout(r, 3000 * (i + 1)));
        }
    }
}

async function seed() {
    console.log('🌱 Starting Resilient Data Synchronization for Gisenyi...');
    
    try {
        for (const { key, q } of QUERIES) {
            console.log(`📡 Fetching ${key}...`);
            let data;
            try {
                data = await fetchWithRetry(q);
            } catch (apiErr) {
                console.warn(`⚠️ API unreachable for ${key}. Checking local snapshot...`);
            }
            
            let places = [];

            if (data && data.elements) {
                places = data.elements.filter(e => e.tags?.name).map(e => {
                    let cat = key;
                    if (key === 'tourism' && (e.tags.tourism === 'hotel' || e.tags.tourism === 'guest_house')) cat = 'hotels';
                    return {
                        osmId: String(e.id),
                        name: e.tags.name,
                        lat: e.lat || e.center?.lat || -1.7019,
                        lon: e.lon || e.center?.lon || 29.2564,
                        catKey: cat,
                        tags: e.tags,
                        description: e.tags.description || e.tags.opening_hours || `Discover ${e.tags.name}, a prominent location in Gisenyi.`
                    };
                });
            } else {
                // Fallback to Snapshot for this category
                const snapshotData = require('./snapshot.json');
                const snapshotList = Array.isArray(snapshotData) ? snapshotData : (snapshotData.places || []);
                
                places = snapshotList.filter(s => {
                    const c = s.cat || s.category;
                    if (key === 'hotels' && (c === 'hotel' || c === 'hotels')) return true;
                    if (key === 'dining' && (c === 'restaurant' || c === 'cafe' || c === 'dining' || c === 'bar')) return true;
                    if (key === 'practical' && (c === 'practical' || c === 'wellness')) return true;
                    if (key === 'tourism' && (c === 'attraction' || c === 'tourism' || c === 'transport')) return true;
                    if (key === 'leisure' && (c === 'beach' || c === 'leisure' || c === 'nightlife' || c === 'activities')) return true;
                    if (key === 'shop' && (c === 'shop')) return true;
                    return c === key;
                }).map(s => {
                    const c = s.cat || s.category;
                    const cKey = c === 'hotel' ? 'hotels' : (c === 'restaurant' || c === 'cafe' || c === 'bar' ? 'dining' : (c === 'beach' ? 'leisure' : (c === 'attraction' || c === 'transport' ? 'tourism' : key)));
                    return {
                        osmId: s.id ? String(s.id) : `local-${s.name.replace(/\s+/g, '-').toLowerCase()}`,
                        name: s.name,
                        lat: s.lat || s.coordinates?.latitude,
                        lon: s.lon || s.coordinates?.longitude,
                        catKey: cKey,
                        tags: s.tags || s.details || {},
                        description: s.desc || s.details?.description
                    };
                });
                console.log(`💡 Loaded ${places.length} items from local snapshot for ${key}`);
            }

            for (const place of places) {
                await prisma.place.upsert({
                    where: { osmId: place.osmId },
                    update: place,
                    create: place
                });
            }
            if (places.length > 0) console.log(`✅ Synced ${places.length} items for ${key}`);
        }
        console.log('🚀 Database Synchronization Complete (Hybrid Mode)!');
    } catch (error) {
        console.error('❌ Massive failure after multiple retries:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
