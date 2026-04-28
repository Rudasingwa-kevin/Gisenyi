import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import StaysPage from './pages/StaysPage';
import MapPage from './pages/MapPage';
import GalleryPage from './pages/GalleryPage';
import { FALLBACK_DATA } from './constants/data';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const [isDark, setIsDark] = useState(true);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');
  const [wikiPhotos, setWikiPhotos] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const fetchAll = async () => {
    setLoading(true);
    const queries = [
      { key: 'hotels', q: '(node["tourism"="hotel"](around:4000,-1.7019,29.2564);node["tourism"="guest_house"](around:4000,-1.7019,29.2564);way["tourism"="hotel"](around:4000,-1.7019,29.2564);)' },
      { key: 'dining', q: '(node["amenity"="restaurant"](around:4000,-1.7019,29.2564);node["amenity"="cafe"](around:4000,-1.7019,29.2564);)' },
      { key: 'beach', q: '(node["natural"="beach"](around:4000,-1.7019,29.2564);node["leisure"="beach_resort"](around:4000,-1.7019,29.2564);)' },
      { key: 'nightlife', q: '(node["amenity"="bar"](around:4000,-1.7019,29.2564);node["amenity"="nightclub"](around:4000,-1.7019,29.2564);)' },
      { key: 'wellness', q: '(node["leisure"="spa"](around:4000,-1.7019,29.2564);node["amenity"="spa"](around:4000,-1.7019,29.2564);)' },
      { key: 'activities', q: '(node["tourism"~"attraction|viewpoint|museum|gallery"](around:4000,-1.7019,29.2564);node["leisure"~"park|sports_centre|water_park|swimming_pool|marina"](around:4000,-1.7019,29.2564);)' }
    ];

    let results = [];
    try {
      for (const { key, q } of queries) {
        try {
          const res = await fetch(`https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];${q}out body;%3E;out skel qt;`);
          if (!res.ok) continue;
          const data = await res.json();
          if (!data.elements) continue;
          const mapped = data.elements.filter(e => e.tags?.name).map(e => ({
            id: String(e.id), 
            name: e.tags.name, 
            lat: e.lat || e.center?.lat || -1.7019, 
            lon: e.lon || e.center?.lon || 29.2564, 
            catKey: key, 
            tags: e.tags
          }));
          results = [...results, ...mapped];
        } catch (err) {
          console.warn(`Failed to fetch ${key}:`, err);
        }
      }
    } catch (e) { console.error(e); }

    const combined = [...results, ...FALLBACK_DATA];
    const unique = Array.from(new Map(combined.map(item => [item.name, item])).values());
    setPlaces(unique);
    setLoading(false);

    try {
      const wRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=Gisenyi|Lake_Kivu&prop=pageimages&format=json&pithumbsize=1000&origin=*`);
      if (wRes.ok) {
        const wData = await wRes.json();
        if (wData.query?.pages) {
          setWikiPhotos(Object.values(wData.query.pages).map(p => p.thumbnail?.source).filter(Boolean));
        }
      }
    } catch (e) { console.warn('Wikimedia fetch failed', e); }
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = useMemo(() => {
    let p = places;
    if (activeCat !== 'all') p = p.filter(x => x.catKey === activeCat);
    if (search) p = p.filter(x => x.name.toLowerCase().includes(search.toLowerCase()));
    return p;
  }, [places, activeCat, search]);

  return (
    <Router>
      <ScrollToTop />
      <div className="font-outfit min-h-screen flex flex-col">
        <Navbar isDark={isDark} setIsDark={setIsDark} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/stays" element={
              <StaysPage 
                places={filtered} 
                loading={loading} 
                activeCat={activeCat} 
                setActiveCat={setActiveCat} 
                search={search} 
                setSearch={setSearch} 
                setSelectedPlace={setSelectedPlace}
              />
            } />
            <Route path="/map" element={
              <MapPage 
                places={places} 
                activeCat={activeCat} 
                selectedPlace={selectedPlace}
                setSelectedPlace={setSelectedPlace}
              />
            } />
            <Route path="/gallery" element={<GalleryPage photos={wikiPhotos} />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
