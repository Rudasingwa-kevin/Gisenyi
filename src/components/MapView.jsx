import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import L from 'leaflet';
import {
  Plus, Minus, Crosshair, Search, Navigation, X, List,
  ChevronLeft, Loader2, AlertCircle, MapPin
} from 'lucide-react';
import { CENTER, CATEGORIES } from '../constants/data';

const MapView = ({ places, activeCat, setActiveCat, selectedPlace, setSelectedPlace }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersLayer = useRef(L.layerGroup());
  const userMarkerRef = useRef(null);
  const flyToDone = useRef(null);
  const [userPos, setUserPos] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapReady, setMapReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState(null);

  useEffect(() => {
    if (mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current, {
      center: CENTER,
      zoom: 14,
      zoomControl: false,
    });

    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      { attribution: 'Tiles &copy; Esri', maxZoom: 16 }
    ).addTo(mapInstance.current);

    markersLayer.current.addTo(mapInstance.current);
    setMapReady(true);
  }, []);

  useEffect(() => {
    if (!mapReady || !selectedPlace) return;

    const targetId = selectedPlace.id;
    if (flyToDone.current === targetId) return;
    flyToDone.current = targetId;

    const targetLat = selectedPlace.lat;
    const targetLon = selectedPlace.lon;

    mapInstance.current.flyTo([targetLat, targetLon], 16, { duration: 1.5 });

    const onMoveEnd = () => {
      markersLayer.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          const ll = layer.getLatLng();
          if (ll.lat === targetLat && ll.lng === targetLon) {
            layer.openPopup();
          }
        }
      });
      mapInstance.current.off('moveend', onMoveEnd);
    };

    mapInstance.current.on('moveend', onMoveEnd);

    return () => {
      mapInstance.current?.off('moveend', onMoveEnd);
    };
  }, [mapReady, selectedPlace]);

  const createMarkerIcon = useCallback((place, isSelected) => {
    const cat = CATEGORIES[place.catKey] || {};
    const color = cat.color || '#C9A84C';

    return L.divIcon({
      className: '',
      html: `
        <div class="gisenyi-marker ${isSelected ? 'gisenyi-marker-selected' : ''}">
          <div class="gisenyi-marker-inner" style="border-color: ${isSelected ? '#C9A84C' : color};">
            <span>${cat.icon || '📍'}</span>
          </div>
          <div class="gisenyi-marker-shadow"></div>
          ${isSelected ? '<div class="gisenyi-marker-pulse"></div>' : ''}
        </div>
      `,
      iconSize: [44, 54],
      iconAnchor: [22, 44],
    });
  }, []);

  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      const matchesCat = activeCat === 'all' || p.catKey === activeCat;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [places, activeCat, searchQuery]);

  useEffect(() => {
    if (!mapReady) return;
    markersLayer.current.clearLayers();

    if (filteredPlaces.length === 0) return;

    filteredPlaces.forEach((place) => {
      const isSelected = selectedPlace?.id === place.id;
      const cat = CATEGORIES[place.catKey] || {};

      const marker = L.marker([place.lat, place.lon], {
        icon: createMarkerIcon(place, isSelected),
      });

      const imageHtml = place.image
        ? `<img src="${place.image}" alt="${place.name}" class="w-full h-32 object-cover rounded-xl mb-4" />`
        : '';

      const ratingHtml = place.rating
        ? `<div class="flex items-center gap-1 mb-3">
            ${[1, 2, 3, 4, 5].map((i) =>
              `<span style="color: ${i <= Math.round(place.rating) ? '#C9A84C' : 'rgba(255,255,255,0.15)'}; font-size: 12px;">★</span>`
            ).join('')}
            <span style="color: rgba(255,255,255,0.4); font-size: 10px; margin-left: 4px;">${place.rating}</span>
          </div>`
        : '';

      marker.bindPopup(
        `<div class="w-72 p-5 font-inter">
          ${imageHtml}
          <span class="text-[9px] font-poppins font-bold text-gold-500 uppercase tracking-widest block mb-2">
            ${cat.icon || ''} ${cat.label || 'Place'}
          </span>
          <h4 class="font-sora font-extrabold text-xl mb-2 text-white">${place.name}</h4>
          ${ratingHtml}
          <p class="text-xs text-white/50 mb-5 line-clamp-3">${place.tags?.description || place.description || 'Explore this location in Gisenyi.'}</p>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}" target="_blank" rel="noopener noreferrer" class="block w-full bg-gold-500 text-navy-900 py-3 rounded-xl font-poppins font-bold text-[10px] text-center uppercase tracking-widest hover:bg-gold-400 transition-all shadow-lg">
            Get Directions
          </a>
        </div>`,
        { className: 'gisenyi-popup', offset: [0, -10], maxWidth: 320, minWidth: 288 }
      ).addTo(markersLayer.current);

      if (isSelected) {
        markersLayer.current.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            const ll = layer.getLatLng();
            if (Math.abs(ll.lat - place.lat) < 0.0001 && Math.abs(ll.lng - place.lon) < 0.0001) {
              setTimeout(() => layer.openPopup(), 1600);
            }
          }
        });
      }
    });
  }, [filteredPlaces, mapReady, selectedPlace, createMarkerIcon]);

  useEffect(() => {
    if (!mapReady) return;
    userMarkerRef.current?.remove();

    if (userPos) {
      const icon = L.divIcon({
        className: '',
        html: '<div class="relative w-6 h-6"><div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div><div class="relative w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      userMarkerRef.current = L.marker(userPos, { icon }).addTo(mapInstance.current);
    }
  }, [mapReady, userPos]);

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPos([latitude, longitude]);
        mapInstance.current?.flyTo([latitude, longitude], 16, { duration: 1.5 });
        setLocating(false);
      },
      (err) => {
        const msg = err.code === 1 ? 'Location access denied. Please enable permissions.' : 'Unable to retrieve your location.';
        setGeoError(msg);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handlePlaceClick = useCallback((place) => {
    setSelectedPlace(place);
    flyToDone.current = place.id;
    mapInstance.current?.flyTo([place.lat, place.lon], 16, { duration: 1.5 });
  }, [setSelectedPlace]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setActiveCat('all');
  }, [setActiveCat]);

  const resultCount = filteredPlaces.length;

  return (
    <section className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[10px] font-poppins font-bold text-gold-500 uppercase tracking-[0.3em]">Interactive Map</span>
          <h2 className="font-sora text-4xl md:text-5xl font-extrabold mt-2">Explore the <span className="text-gold-500">Shoreline</span></h2>
        </div>

        <div className="relative h-[600px] rounded-2xl overflow-hidden border border-white/10">
          <div ref={mapRef} className="h-full w-full" />

          {/* TOP-LEFT: Search + Category filters */}
          <div className="absolute top-4 left-4 z-[1000] w-full max-w-sm space-y-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl glass-dark shadow-2xl">
              <Search className="w-4 h-4 text-gold-500 shrink-0" />
              <input
                type="text"
                placeholder="Search places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-sm w-full font-inter placeholder:text-white/30"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="shrink-0 text-white/40 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => setActiveCat(key)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-poppins font-bold uppercase tracking-widest transition-all ${
                    activeCat === key
                      ? 'bg-gold-500 text-navy-900 shadow-lg shadow-gold-500/20'
                      : 'glass-dark text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: key === 'all' ? '#C9A84C' : cat.color }}
                  />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* TOP-RIGHT: Sidebar toggle + Zoom controls + Locate */}
          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-xl ${
                sidebarOpen ? 'bg-gold-500 text-navy-900' : 'glass-dark text-gold-500 hover:bg-white/10'
              }`}
              title={sidebarOpen ? 'Close places list' : 'Show places list'}
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <List className="w-4 h-4" />}
            </button>

            <div className="flex flex-col rounded-xl overflow-hidden glass-dark shadow-xl divide-y divide-white/5">
              <button
                onClick={() => mapInstance.current?.zoomIn()}
                className="w-10 h-10 flex items-center justify-center text-gold-500 hover:bg-white/10 transition-all"
                title="Zoom in"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => mapInstance.current?.zoomOut()}
                className="w-10 h-10 flex items-center justify-center text-gold-500 hover:bg-white/10 transition-all"
                title="Zoom out"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleLocate}
              disabled={locating}
              className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center text-navy-900 hover:bg-gold-400 transition-all shadow-xl disabled:opacity-60"
              title="Show my location"
            >
              {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />}
            </button>
          </div>

          {/* Geo error toast */}
          {geoError && (
            <div className="absolute top-20 right-4 z-[1000] max-w-xs animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-2 px-4 py-3 rounded-xl glass-dark shadow-2xl border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-white/70 flex-1">{geoError}</p>
                <button onClick={() => setGeoError(null)} className="shrink-0 text-white/40 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* BOTTOM: Explorer badge + place count */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl glass-dark shadow-2xl">
              <Navigation className="w-3.5 h-3.5 text-gold-500 animate-pulse" />
              <span className="text-[9px] font-poppins font-bold text-white/60 uppercase tracking-widest">Explorer Mode</span>
              <span className="w-px h-4 bg-white/10" />
              <span className="text-[10px] font-inter text-white/40">{resultCount} {resultCount === 1 ? 'place' : 'places'}</span>
            </div>
          </div>

          {/* Empty state */}
          {mapReady && resultCount === 0 && (
            <div className="absolute inset-0 z-[500] flex items-center justify-center pointer-events-none">
              <div className="text-center px-8 py-6 rounded-2xl glass-dark shadow-2xl max-w-sm pointer-events-auto">
                <MapPin className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <p className="text-sm font-inter text-white/50">No places found matching your search.</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-3 text-[10px] font-poppins font-bold text-gold-500 uppercase tracking-widest hover:text-gold-400 transition-colors"
                >
                  Reset filters
                </button>
              </div>
            </div>
          )}

          {/* SIDEBAR: Places list */}
          <div
            className={`absolute inset-y-0 left-0 z-[999] w-80 bg-navy-900/95 backdrop-blur-xl border-r border-white/10 shadow-2xl transition-all duration-300 ease-out flex flex-col ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
              <div>
                <h3 className="font-sora font-bold text-white text-sm">Places</h3>
                <p className="text-[10px] text-white/40 font-inter mt-0.5">{resultCount} {resultCount === 1 ? 'result' : 'results'}</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2 px-3 sidebar-scrollbar">
              {filteredPlaces.length === 0 && (
                <div className="text-center py-12">
                  <MapPin className="w-8 h-8 text-white/10 mx-auto mb-3" />
                  <p className="text-xs text-white/30 font-inter">No places to show</p>
                </div>
              )}
              {filteredPlaces.map((place) => {
                const cat = CATEGORIES[place.catKey] || {};
                const isSelected = selectedPlace?.id === place.id;
                return (
                  <button
                    key={place.id}
                    onClick={() => handlePlaceClick(place)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all mb-1 ${
                      isSelected
                        ? 'bg-gold-500/10 border border-gold-500/20'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg shrink-0 mt-0.5">{cat.icon || '📍'}</span>
                      <div className="min-w-0 flex-1">
                        <h4 className={`font-sora font-bold text-sm truncate ${isSelected ? 'text-gold-500' : 'text-white'}`}>
                          {place.name}
                        </h4>
                        <span className="text-[9px] font-poppins font-bold text-white/30 uppercase tracking-wider">
                          {cat.label || 'Place'}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapView;
