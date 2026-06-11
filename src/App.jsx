import { useState, useEffect, useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import StaysPage from './pages/StaysPage';
import MapPage from './pages/MapPage';
import GalleryPage from './pages/GalleryPage';
import AdminPage from './pages/AdminPage';
import LoginModal from './components/LoginModal';
import { AuthProvider } from './context/AuthContext';
import { FALLBACK_DATA } from './constants/data';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } }
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const AnimatedOutlet = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    {children}
  </motion.div>
);

function AppLayout() {
  const { pathname } = useLocation();
  const isAdminPage = pathname.startsWith('/admin');
  const [isDark, setIsDark] = useState(true);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');
  const [wikiPhotos, setWikiPhotos] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [stats, setStats] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/places');
      if (res.ok) {
        const data = await res.json();
        if (data?.length) { setPlaces(data); setLoading(false); return; }
      }
    } catch {}
    setPlaces(FALLBACK_DATA);
    setLoading(false);

    try {
      const wRes = await fetch('https://en.wikipedia.org/w/api.php?action=query&titles=Gisenyi|Lake_Kivu&prop=pageimages&format=json&pithumbsize=1000&origin=*');
      if (wRes.ok) {
        const wData = await wRes.json();
        if (wData.query?.pages) {
          setWikiPhotos(Object.values(wData.query.pages).map(p => p.thumbnail?.source).filter(Boolean));
        }
      }
    } catch {}
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    if (places.length) {
      const cats = {};
      places.forEach(p => { cats[p.catKey] = (cats[p.catKey] || 0) + 1; });
      setStats({ total: places.length, categories: cats });
    }
  }, [places]);

  const filtered = useMemo(() => {
    let p = places;
    if (activeCat !== 'all') p = p.filter(x => x.catKey === activeCat);
    if (search) p = p.filter(x => x.name.toLowerCase().includes(search.toLowerCase()));
    return p;
  }, [places, activeCat, search]);

  return (
    <div className="font-outfit min-h-screen flex flex-col">
      {!isAdminPage && <Navbar isDark={isDark} setIsDark={setIsDark} />}

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={
              <AnimatedOutlet key="home">
                <HomePage stats={stats} loading={loading} />
              </AnimatedOutlet>
            } />
            <Route path="/history" element={
              <AnimatedOutlet key="history">
                <HistoryPage />
              </AnimatedOutlet>
            } />
            <Route path="/stays" element={
              <AnimatedOutlet key="stays">
                <StaysPage
                  places={filtered}
                  loading={loading}
                  activeCat={activeCat}
                  setActiveCat={setActiveCat}
                  search={search}
                  setSearch={setSearch}
                  setSelectedPlace={setSelectedPlace}
                />
              </AnimatedOutlet>
            } />
            <Route path="/map" element={
              <AnimatedOutlet key="map">
                <MapPage
                  places={places}
                  activeCat={activeCat}
                  setActiveCat={setActiveCat}
                  selectedPlace={selectedPlace}
                  setSelectedPlace={setSelectedPlace}
                />
              </AnimatedOutlet>
            } />
            <Route path="/gallery" element={
              <AnimatedOutlet key="gallery">
                <GalleryPage photos={wikiPhotos} />
              </AnimatedOutlet>
            } />
            <Route path="/admin" element={
              <AnimatedOutlet key="admin">
                <AdminPage />
              </AnimatedOutlet>
            } />
          </Routes>
        </AnimatePresence>
      </main>

      {!isAdminPage && <Footer onAdminClick={() => setShowLogin(true)} />}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
