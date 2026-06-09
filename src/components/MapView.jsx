import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { Plus, Minus, Crosshair, Search, Navigation } from 'lucide-react';
import { CENTER, CATEGORIES } from '../constants/data';

const MapView = ({ places, activeCat, setActiveCat, selectedPlace }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markers = useRef(L.layerGroup());
  const userMarker = useRef(null);
  const [userPos, setUserPos] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        center: CENTER,
        zoom: 14,
        zoomControl: false
      });
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 16
      }).addTo(mapInstance.current);
      markers.current.addTo(mapInstance.current);
      setMapReady(true);
    }
  }, []);

  useEffect(() => {
    if (!mapReady) return;
    markers.current.clearLayers();

    const filtered = places.filter(p => {
      const matchesCat = activeCat === 'all' || p.catKey === activeCat;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });

    filtered.forEach(p => {
      const icon = L.divIcon({
        className: '',
        html: `<div class="group relative cursor-pointer">
          <div class="w-10 h-10 bg-navy-800/90 backdrop-blur rounded-2xl flex items-center justify-center shadow-2xl border border-gold-500/30 transition-all duration-300 hover:scale-125 hover:-translate-y-1">
            <span class="text-lg">${CATEGORIES[p.catKey]?.icon || '📍'}</span>
          </div>
        </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      L.marker([p.lat, p.lon], { icon })
        .bindPopup(`
          <div class="w-64 p-5 font-inter">
            <span class="text-[9px] font-poppins font-bold text-gold-500 uppercase tracking-widest block mb-2">${CATEGORIES[p.catKey]?.label || 'Place'}</span>
            <h4 class="font-sora font-extrabold text-xl mb-2 text-white">${p.name}</h4>
            <p class="text-xs text-white/50 mb-5 line-clamp-3">${p.tags?.description || 'Explore this location in Gisenyi.'}</p>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}" target="_blank" class="block w-full bg-gold-500 text-navy-900 py-3 rounded-xl font-poppins font-bold text-[10px] text-center uppercase tracking-widest hover:bg-gold-400 transition-all shadow-lg">
              Get Directions
            </a>
          </div>
        `, { className: 'gisenyi-popup', offset: [0, -10] })
        .addTo(markers.current);

      if (selectedPlace?.id === p.id) {
        markers.current.eachLayer(m => {
          if (m.getLatLng().lat === p.lat && m.getLatLng().lng === p.lon) {
            m.openPopup();
          }
        });
        mapInstance.current.flyTo([p.lat, p.lon], 16, { duration: 1.5 });
      }
    });

    if (userPos) {
      userMarker.current?.remove();
      const icon = L.divIcon({
        className: '',
        html: `<div class="relative w-6 h-6"><div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div><div class="relative w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      userMarker.current = L.marker(userPos, { icon }).addTo(mapInstance.current);
    }
  }, [places, activeCat, selectedPlace, userPos, mapReady, searchQuery]);

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      setUserPos([latitude, longitude]);
      mapInstance.current?.flyTo([latitude, longitude], 16);
    });
  };

  return (
    <section className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[10px] font-poppins font-bold text-gold-500 uppercase tracking-[0.3em]">Interactive Map</span>
          <h2 className="font-sora text-4xl md:text-5xl font-extrabold mt-2">Explore the <span className="text-gold-500">Shoreline</span></h2>
        </div>

        <div className="relative h-[600px] rounded-2xl overflow-hidden border border-white/10">
          <div ref={mapRef} className="h-full w-full" />

          <div className="absolute top-4 left-4 z-[1000] w-full max-w-sm">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl glass-dark shadow-2xl">
              <Search className="w-4 h-4 text-gold-500 shrink-0" />
              <input
                type="text"
                placeholder="Search on map..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-sm w-full font-inter placeholder:text-white/30"
              />
            </div>
            <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
              <button onClick={() => setActiveCat('all')}
                className={`px-4 py-1.5 rounded-lg text-[9px] font-poppins font-bold uppercase tracking-widest whitespace-nowrap transition-all shrink-0 ${
                  activeCat === 'all' ? 'bg-gold-500 text-navy-900' : 'glass-dark text-white/60 hover:text-white'
                }`}
              >
                All
              </button>
              {Object.entries(CATEGORIES).filter(([k]) => k !== 'all').map(([key, cat]) => (
                <button key={key} onClick={() => setActiveCat(key)}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-poppins font-bold uppercase tracking-widest whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 ${
                    activeCat === key ? 'bg-gold-500 text-navy-900' : 'glass-dark text-white/60 hover:text-white'
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
            <button onClick={() => mapInstance.current?.zoomIn()}
              className="w-10 h-10 rounded-xl glass-dark flex items-center justify-center text-gold-500 hover:bg-white/10 transition-all shadow-xl"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button onClick={() => mapInstance.current?.zoomOut()}
              className="w-10 h-10 rounded-xl glass-dark flex items-center justify-center text-gold-500 hover:bg-white/10 transition-all shadow-xl"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button onClick={handleLocate}
              className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center text-navy-900 hover:bg-gold-400 transition-all shadow-xl"
            >
              <Crosshair className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-dark shadow-2xl">
              <Navigation className="w-3.5 h-3.5 text-gold-500 animate-pulse" />
              <span className="text-[9px] font-poppins font-bold text-white/60 uppercase tracking-widest">Explorer Mode</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapView;
