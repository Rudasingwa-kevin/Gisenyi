import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight, Search, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants/data';
import { cn } from '../utils/helpers';

const PlaceCard = ({ place, setSelectedPlace }) => {
    const [img, setImg] = useState(null);
    const navigate = useNavigate();
    const cat = CATEGORIES[place.catKey] || CATEGORIES.all;

    const handleViewOnMap = (e) => {
        e.stopPropagation();
        setSelectedPlace(place);
        navigate('/map');
    };

    useEffect(() => {
        const keywords = {
            hotels: 'luxury-hotel,resort,villa',
            dining: 'fine-dining,restaurant,chef',
            beach: 'lake-kivu,beach,tropical',
            nightlife: 'cocktail-bar,nightclub',
            wellness: 'spa,massage,yoga',
            practical: 'modern-building,clinic'
        };
        setImg(`https://images.unsplash.com/photo-${place.id.startsWith('f') ? '1542314831-068cd1dbfeeb' : '1566073771259-6a8506099945'}?auto=format&fit=crop&q=80&w=800&h=1000`);
        // Using semi-random IDs for demo since Unsplash Source is gone
    }, [place.catKey, place.id]);

    return (
        <motion.div 
            layout
            whileHover={{ y: -15 }}
            className="relative aspect-[3/4.5] rounded-[2.5rem] overflow-hidden shadow-2xl group cursor-pointer"
        >
            {img && <img src={img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" />}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/10 to-transparent"></div>
            
            <div className="absolute top-8 left-8 flex items-center space-x-3">
                <div className="glass-dark px-5 py-2 rounded-full border border-gold/20 flex items-center space-x-2">
                    <span className="text-sm">{cat.icon}</span>
                    <span className="text-[10px] font-poppins font-bold text-gold uppercase tracking-widest">{cat.label}</span>
                </div>
            </div>

            <div className="absolute bottom-10 left-10 right-10">
                {place.tags?.stars && (
                    <div className="flex space-x-1 mb-4 text-gold">
                        {[...Array(parseInt(place.tags.stars))].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                    </div>
                )}
                <h4 className="font-sora text-3xl font-extrabold text-white mb-3 tracking-tight group-hover:text-gold transition-colors">{place.name}</h4>
                <p className="font-inter text-sm text-soft-gray/50 line-clamp-2 mb-6 font-light">
                    {place.tags?.description || place.tags?.cuisine || "Experience the unparalleled luxury of Gisenyi's most iconic destinations."}
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-[10px] font-poppins font-bold text-gold uppercase tracking-[0.2em] group-hover:translate-x-3 transition-transform">
                        Discover More <ArrowRight className="ml-3 w-4 h-4" />
                    </div>
                    <button 
                        onClick={handleViewOnMap}
                        className="p-3 glass rounded-xl text-gold hover:bg-gold hover:text-primary transition-all"
                    >
                        <MapPin className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const Places = ({ places, loading, activeCat, setActiveCat, search, setSearch, setSelectedPlace }) => {
    return (
        <section id="stays" className="py-40 bg-soft-gray dark:bg-navy-dark overflow-hidden">
            <div className="max-w-7xl mx-auto px-8">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
                    <div className="max-w-2xl">
                        <h2 className="font-sora text-6xl md:text-7xl font-extrabold tracking-tight mb-8">Curated <span className="text-gold">Destinations</span></h2>
                        
                        <div className="relative group max-w-lg">
                            <div className="absolute inset-0 bg-gold/10 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                            <input 
                                type="text" placeholder="Search the city..." 
                                className="relative w-full bg-white dark:bg-card-dark px-10 py-6 rounded-[2rem] outline-none border-2 border-transparent focus:border-gold/30 transition-all font-inter text-lg"
                                value={search} onChange={e => setSearch(e.target.value)}
                            />
                            <Search className="absolute right-8 top-1/2 -translate-y-1/2 text-gold/40" />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {Object.entries(CATEGORIES).map(([key, cat]) => (
                            <button 
                                key={key} onClick={() => setActiveCat(key)}
                                className={cn(
                                    "px-8 py-4 rounded-2xl font-poppins font-bold text-[10px] uppercase tracking-widest transition-all",
                                    activeCat === key ? 'bg-gold text-primary shadow-2xl scale-105' : 'bg-white dark:bg-card-dark text-muted-text border border-white/5'
                                )}
                            >
                                {cat.icon} {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                        {[...Array(8)].map((_, i) => <div key={i} className="aspect-[3/4.5] bg-white/40 dark:bg-white/5 rounded-[2.5rem] animate-pulse"></div>)}
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                        {places.slice(0, 12).map(p => (
                            <PlaceCard key={p.id} place={p} setSelectedPlace={setSelectedPlace} />
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Places;
