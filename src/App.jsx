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
    try {
      const res = await fetch('http://localhost:3000/api/places');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setPlaces(data);
          setLoading(false);
        } else {
          throw new Error('No data in DB');
        }
      } else {
        throw new Error('Backend error');
      }
    } catch (e) {
      console.warn('Backend fetch failed, using fallback constants', e);
      setPlaces(FALLBACK_DATA);
      setLoading(false);
    }

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
