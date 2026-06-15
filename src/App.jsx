import { useState, useEffect, useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { API_BASE } from './utils/api';
import { trackPage } from './utils/tracker';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import StaysPage from './pages/StaysPage';
import MapPage from './pages/MapPage';
import GalleryPage from './pages/GalleryPage';
import AdminPage from './pages/AdminPage';
import PlaceDetailPage from './pages/PlaceDetailPage';
import EventsPage from './pages/EventsPage';
import CalendarPage from './pages/CalendarPage';
import AddPlacePage from './pages/AddPlacePage';
import AddCategoryPage from './pages/AddCategoryPage';
import AddEventPage from './pages/AddEventPage';
import AddCalendarItemPage from './pages/AddCalendarItemPage';
import LoginModal from './components/LoginModal';
import ErrorBoundary from './components/ErrorBoundary';
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
  useEffect(() => { trackPage(pathname); }, [pathname]);
  const isAdminPage = pathname.startsWith('/admin');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');
  const [wikiPhotos, setWikiPhotos] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [stats, setStats] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/places`);
      if (res.ok) {
        const data = await res.json();
        if (data?.length) { setPlaces(data); setLoading(false); return; }
      }
    } catch { /* ignore */ }
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
    } catch { /* ignore */ }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    if (places.length) {
      const cats = {};
      places.forEach(p => { cats[p.catKey] = (cats[p.catKey] || 0) + 1; });
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      {!isAdminPage && <Navbar />}

      <main className="flex-grow">
        <ErrorBoundary>
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
            <Route path="/admin/places/new" element={
              <AnimatedOutlet key="add-place">
                <AddPlacePage />
              </AnimatedOutlet>
            } />
            <Route path="/admin/categories/new" element={
              <AnimatedOutlet key="add-category">
                <AddCategoryPage />
              </AnimatedOutlet>
            } />
            <Route path="/admin/events/new" element={
              <AnimatedOutlet key="add-event">
                <AddEventPage />
              </AnimatedOutlet>
            } />
            <Route path="/admin/calendar/new" element={
              <AnimatedOutlet key="add-calendar">
                <AddCalendarItemPage />
              </AnimatedOutlet>
            } />
            <Route path="/events" element={
              <AnimatedOutlet key="events">
                <EventsPage />
              </AnimatedOutlet>
            } />
            <Route path="/calendar" element={
              <AnimatedOutlet key="calendar">
                <CalendarPage />
              </AnimatedOutlet>
            } />
            <Route path="/stays/:id" element={
              <AnimatedOutlet key="detail">
                <PlaceDetailPage places={places} />
              </AnimatedOutlet>
            } />
          </Routes>
        </AnimatePresence>
        </ErrorBoundary>
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
