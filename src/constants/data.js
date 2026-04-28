export const CENTER = [-1.7019, 29.2564];

export const CATEGORIES = {
    all: { label: 'All', icon: '📍', color: '#C9A84C' },
    hotels: { label: 'Hotels', icon: '🏨', color: '#C9A84C' },
    dining: { label: 'Dining', icon: '🍽', color: '#E8593C' },
    nightlife: { label: 'Nightlife', icon: '🍹', color: '#7B3FA0' },
    beach: { label: 'Beach', icon: '🏖', color: '#1A8A9A' },
    wellness: { label: 'Wellness', icon: '🧘', color: '#2D8A5E' },
    activities: { label: 'Activities', icon: '🛶', color: '#F39C12' },
    practical: { label: 'Practical', icon: 'ℹ', color: '#4A6A8A' }
};

export const FALLBACK_DATA = [
    { id: 'f1', name: 'Serena Lake Kivu Hotel', lat: -1.6968, lon: 29.2619, catKey: 'hotels', tags: { stars: '5', description: '5-star lakeside resort' } },
    { id: 'f2', name: 'Paradise Malahide Hotel', lat: -1.7023, lon: 29.2587, catKey: 'hotels', tags: { description: 'Boutique lakeside' } },
    { id: 'f3', name: 'Kivu Sun Hotel', lat: -1.6998, lon: 29.2601, catKey: 'hotels', tags: { description: 'Lake views, full amenities' } },
    { id: 'f4', name: 'Home St Jean', lat: -1.7050, lon: 29.2545, catKey: 'hotels', tags: { description: 'Popular guesthouse' } },
    { id: 'f5', name: 'La Palmeraie Restaurant', lat: -1.7010, lon: 29.2598, catKey: 'dining', tags: { cuisine: 'International' } },
    { id: 'f6', name: 'Inzozi Nziza Café', lat: -1.7035, lon: 29.2560, catKey: 'dining', tags: { cuisine: 'Cafe', description: 'Famous ice cream café' } },
    { id: 'f7', name: 'Le Bistro du Lac', lat: -1.6990, lon: 29.2615, catKey: 'dining', tags: { cuisine: 'French' } },
    { id: 'f8', name: 'Lake Kivu Beach', lat: -1.7000, lon: 29.2630, catKey: 'beach', tags: { description: 'Main public beach' } },
    { id: 'f9', name: 'Rubavu Beach', lat: -1.6985, lon: 29.2640, catKey: 'beach', tags: { description: 'Popular lakeside' } },
    { id: 'f10', name: 'Congo-Rwanda Border', lat: -1.6890, lon: 29.2380, catKey: 'beach', tags: { description: 'Landmark crossing' } }
];

export const HISTORY_ERAS = [
    {
        id: 1,
        title: "PRE-COLONIAL",
        period: "Before 1885",
        text: "The indigenous Banyarwanda people settled these volcanic shores centuries before European contact. Lake Kivu — one of Africa's Great Rift Valley lakes — was sacred ground. Its waters fed entire communities through fishing; its fertile volcanic soil nourished banana, sorghum, and bean harvests. Gisenyi sat at the convergence of trade routes between the Kingdom of Rwanda and the Congo Basin. The lake was believed to hold ancestral spirits, and ceremonies were conducted at its shores during planting seasons and rites of passage. This was a land of extraordinary beauty — mist-draped mornings, volcanic mountains to the north, and waters so still they mirrored the heavens.",
        gradient: "linear-gradient(135deg, #051428 0%, #0a3060 50%, #1a6a8a 100%)",
        side: "left"
    },
    {
        id: 2,
        title: "GERMAN COLONIAL ERA",
        period: "1885–1916",
        text: "The 1885 Berlin Conference carved Africa into European spheres without African consent. Gisenyi fell under German East Africa — specifically Deutsch-Ostafrika — as Rwanda became a protectorate. German administrators arrived at Lake Kivu's shores, drawn by its strategic position and temperate climate. The first European-style administrative posts were established. Gisenyi's natural harbor made it a preferred landing point on the lake's eastern shore. The border between German Ruanda and Belgian Congo was formalized here — a line that would shape the city's identity forever. The Germans began modest infrastructure: a customs post, a small medical station, and rudimentary roads connecting to Kigali.",
        gradient: "linear-gradient(135deg, #1a0a05 0%, #4a1a0a 50%, #C9A84C 100%)",
        side: "right"
    },
    {
        id: 3,
        title: "BELGIAN ERA & THE COLONIAL RIVIERA",
        period: "1916–1962",
        text: "After World War I, Belgium assumed control under a League of Nations mandate. The Belgians saw Gisenyi's potential immediately — its cool altitude (1,465m), calm lake waters, and dramatic scenery were unlike anywhere else in Central Africa. Belgian colonial officers built lakeside villas, promenades, and European-style clubs along the shoreline. By the 1930s, Gisenyi had earned the nickname 'the Riviera of Central Africa' — a retreat where Leopoldville (Kinshasa) elites and Kigali officials would weekend. The Catholic Church established a major mission. Coffee and tea plantations climbed the surrounding hills. The twin-city relationship with Goma — just across the border in Belgian Congo — created a unique cross-cultural economy that still defines the region today.",
        gradient: "linear-gradient(135deg, #0A1628 0%, #C9A84C 100%)",
        side: "left"
    },
    {
        id: 4,
        title: "INDEPENDENCE & IDENTITY",
        period: "1962–1994",
        text: "Rwanda's independence on July 1, 1962 transformed Gisenyi into the capital of Gisenyi Prefecture — an administrative and commercial hub. The city inherited Belgian infrastructure but began charting its own course. Cross-border trade with Goma flourished; the Petite Barrière border crossing became one of the most active pedestrian crossings in all of Africa. Fishing cooperatives organized Lake Kivu's harvest. Tourism began growing organically — Rwandans and Congolese alike discovered Gisenyi's beaches. Hotels replaced colonial villas. Yet the city also carried tensions: ethnic politics that would eventually tear the nation apart were visible here, where communities lived in uncomfortable proximity. The lake, indifferent to human borders, continued its ancient rhythms.",
        gradient: "linear-gradient(135deg, #051410 0%, #1a6a5a 100%)",
        side: "right"
    },
    {
        id: 5,
        title: "SURVIVAL & REMEMBRANCE",
        period: "1994–2005",
        text: "The 1994 genocide against the Tutsi shattered Rwanda — and Gisenyi was not spared. The city sat at the epicenter of crisis: hundreds of thousands of refugees fled across the border into Goma as the génocidaires retreated. The subsequent DRC conflicts — the First and Second Congo Wars — sent waves of instability that lapped at Gisenyi's shores. Yet Rwanda's extraordinary recovery story is nowhere more visible than here. The national reconciliation program — gacaca community courts, memorial sites, a truth-telling culture — rebuilt social bonds. International organizations established offices. Infrastructure was repaired. Schools reopened. Gisenyi began, slowly and painfully, to breathe again.",
        gradient: "linear-gradient(135deg, #0a0515 0%, #1a0a30 50%, #4a1a6a 100%)",
        side: "left"
    },
    {
        id: 6,
        title: "RUBAVU & THE MODERN RENAISSANCE",
        period: "2006–Today",
        text: "Rwanda's 2006 administrative reorganization merged Gisenyi into the new Rubavu District, connecting it to a wider network of communities around Lake Kivu. What followed was a renaissance. President Kagame's Vision 2020 and Vision 2050 placed tourism at the heart of national development — and Gisenyi became a showpiece. World-class lakeside resorts opened. The annual Kwita Izina gorilla naming ceremony brought international attention. Boutique hotels and beach clubs appeared along the promenade. Young Rwandan entrepreneurs opened restaurants, surf schools, and cultural spaces. Today Gisenyi is Rwanda's premier weekend escape — a city where the volcanic earth, the endless lake, and a people of extraordinary resilience have created something genuinely beautiful.",
        gradient: "linear-gradient(135deg, #C9A84C 0%, #1a6a8a 100%)",
        side: "right"
    }
];
