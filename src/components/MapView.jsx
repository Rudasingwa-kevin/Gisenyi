import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Plus, Minus } from 'lucide-react';
import { CENTER, CATEGORIES } from '../constants/data';

const MapView = ({ places, activeCat, selectedPlace, setSelectedPlace }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markers = useRef(L.layerGroup());

    useEffect(() => {
        if (!mapInstance.current) {
            mapInstance.current = L.map(mapRef.current, { center: CENTER, zoom: 14, zoomControl: false });
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }).addTo(mapInstance.current);
            markers.current.addTo(mapInstance.current);
        }

        markers.current.clearLayers();
        const filtered = activeCat === 'all' ? places : places.filter(p => p.catKey === activeCat);

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
                    <div class="w-64 p-4 font-inter text-primary">
                        <span class="text-[9px] font-poppins font-bold text-gold uppercase tracking-widest block mb-2">${CATEGORIES[p.catKey]?.label}</span>
                        <h4 class="font-sora font-extrabold text-xl mb-2">${p.name}</h4>
                        <p class="text-xs text-soft-gray/50 mb-4 line-clamp-2">${p.tags?.description || 'Explore this beautiful location in Gisenyi.'}</p>
                        <a 
                            href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}" 
                            target="_blank" 
                            class="block w-full bg-gold text-primary py-3 rounded-xl font-poppins font-bold text-[10px] text-center uppercase tracking-widest hover:bg-gold-light transition-all"
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
    }, [places, activeCat, selectedPlace]);

    return (
        <section id="map" className="py-40 bg-white dark:bg-navy-mid">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-20">
                    <h2 className="font-sora text-5xl font-extrabold mb-6">Explore the <span className="text-gold">Shoreline</span></h2>
                    <p className="text-muted-text text-xl font-light">Real-time data powered by OpenStreetMap.</p>
                </div>
                <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/5">
                    <div ref={mapRef} className="h-full w-full"></div>
                    <div className="absolute top-8 right-8 z-[1000] flex flex-col space-y-3">
                        <button onClick={() => mapInstance.current.zoomIn()} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-gold hover:bg-white/10"><Plus /></button>
                        <button onClick={() => mapInstance.current.zoomOut()} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-gold hover:bg-white/10"><Minus /></button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MapView;
