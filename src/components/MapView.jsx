import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import { Plus, Minus, Navigation, Crosshair, MapPin } from 'lucide-react';
import { CENTER, CATEGORIES } from '../constants/data';

const MapView = ({ places, activeCat, selectedPlace, setSelectedPlace }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markers = useRef(L.layerGroup());
    const userMarker = useRef(null);
    const [userPos, setUserPos] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [localCat, setLocalCat] = useState('all');

    const handleLocate = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            setUserPos([latitude, longitude]);
            if (mapInstance.current) {
                mapInstance.current.flyTo([latitude, longitude], 16);
            }
        });
    };

    useEffect(() => {
        if (!mapInstance.current) {
            mapInstance.current = L.map(mapRef.current, { center: CENTER, zoom: 14, zoomControl: false });
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
                maxZoom: 16
            }).addTo(mapInstance.current);
            markers.current.addTo(mapInstance.current);
        }

        markers.current.clearLayers();
        
        const filtered = places.filter(p => {
            const matchesCat = localCat === 'all' || p.catKey === localCat;
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCat && matchesSearch;
        });

        filtered.forEach(p => {
            const icon = L.divIcon({
                className: '',
                html: `<div class="group relative">
                        <div class="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-2xl border-2 border-gold transform transition-all duration-300 group-hover:scale-125 group-hover:-translate-y-2">
                            <span class="text-xl">${CATEGORIES[p.catKey]?.icon || '📍'}</span>
                        </div>
                       </div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });

            const marker = L.marker([p.lat, p.lon], { icon })
                .bindPopup(`
                    <div class="w-64 p-5 font-inter">
                        <span class="text-[9px] font-poppins font-bold text-gold uppercase tracking-widest block mb-2">${CATEGORIES[p.catKey]?.label || 'Place'}</span>
                        <h4 class="font-sora font-extrabold text-xl mb-2 text-white">${p.name}</h4>
                        <p class="text-xs text-white/60 mb-5 line-clamp-3 leading-relaxed">${p.description || p.tags?.description || 'Explore this beautiful location in Gisenyi.'}</p>
                        <a 
                            href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}" 
                            target="_blank" 
                            class="block w-full bg-gold text-navy-dark py-3 rounded-xl font-poppins font-bold text-[10px] text-center uppercase tracking-widest hover:bg-gold-light transition-all shadow-lg"
                        >
                            Get Directions
                        </a>
                    </div>
                `, { className: 'gisenyi-popup', offset: [0, -10] })
                .addTo(markers.current);
            
            if (selectedPlace && selectedPlace.id === p.id) {
                marker.openPopup();
                mapInstance.current.flyTo([p.lat, p.lon], 16, { duration: 1.5 });
            }
        });

        if (userPos) {
            if (userMarker.current) userMarker.current.remove();
            const icon = L.divIcon({
                className: '',
                html: `<div class="relative w-6 h-6">
                        <div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                        <div class="relative w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                       </div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });
            userMarker.current = L.marker(userPos, { icon }).addTo(mapInstance.current);
        }
    }, [places, activeCat, selectedPlace, userPos]);

    return (
        <section id="map" className="py-40 bg-white dark:bg-navy-mid">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-20">
                    <h2 className="font-sora text-5xl font-extrabold mb-6">Explore the <span className="text-gold">Shoreline</span></h2>
                    <p className="text-muted-text text-xl font-light">Real-time data powered by OpenStreetMap.</p>
                </div>
                <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/5">
                    <div ref={mapRef} className="h-full w-full"></div>

                    {/* Floating Search Bar */}
                    <div className="absolute top-8 left-8 z-[1000] w-full max-w-md pr-16 md:pr-0">
                        <div className="glass px-6 py-4 rounded-[2rem] flex items-center space-x-4 shadow-2xl border border-white/10 group focus-within:border-gold/50 transition-all">
                            <Crosshair className="w-5 h-5 text-gold" />
                            <input 
                                type="text"
                                placeholder="Search Gisenyi (Hotels, Beaches, Vibe...)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none outline-none text-white font-poppins text-sm w-full placeholder:text-soft-gray/50"
                            />
                        </div>
                        
                        {/* Quick Filter Chips */}
                        <div className="flex items-center space-x-2 mt-4 overflow-x-auto no-scrollbar pb-2">
                            <button 
                                onClick={() => setLocalCat('all')}
                                className={`px-5 py-2 rounded-full font-poppins text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${localCat === 'all' ? 'bg-gold text-primary shadow-lg' : 'glass text-white/70 hover:bg-white/10'}`}
                            >
                                All Spots
                            </button>
                            {Object.entries(CATEGORIES).map(([key, cat]) => (
                                <button 
                                    key={key}
                                    onClick={() => setLocalCat(key)}
                                    className={`px-5 py-2 rounded-full font-poppins text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all flex items-center space-x-2 ${localCat === key ? 'bg-gold text-primary shadow-lg' : 'glass text-white/70 hover:bg-white/10'}`}
                                >
                                    <span>{cat.icon}</span>
                                    <span>{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="absolute top-8 right-8 z-[1000] flex flex-col space-y-3">
                        <button onClick={() => mapInstance.current.zoomIn()} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-gold hover:bg-white/10 shadow-xl"><Plus /></button>
                        <button onClick={() => mapInstance.current.zoomOut()} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-gold hover:bg-white/10 shadow-xl"><Minus /></button>
                        <button onClick={handleLocate} className="w-12 h-12 bg-gold rounded-2xl flex items-center justify-center text-primary hover:bg-gold-light shadow-[0_10px_20px_rgba(201,168,76,0.3)]"><Crosshair /></button>
                    </div>
                    
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] flex items-center space-x-4">
                        <div className="glass px-6 py-3 rounded-2xl flex items-center space-x-3 text-soft-gray/80 text-xs font-poppins font-bold uppercase tracking-widest shadow-2xl">
                            <Navigation className="w-4 h-4 text-gold animate-pulse" />
                            <span>Gisenyi Explorer Mode</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MapView;
