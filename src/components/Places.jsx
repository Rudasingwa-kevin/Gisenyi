import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../constants/categories';
import { GridSkeleton } from './LoadingSkeleton';

const catImages = {
  hotels: '/place1.jpeg',
  dining: '/place2.jpeg',
  nightlife: '/place3.jpeg',
  beach: '/place4.jpeg',
  wellness: '/place5.jpeg',
  activities: '/place6.jpeg',
  shopping: '/place1.jpeg',
  practical: '/place2.jpeg',
  cafe: '/place3.jpeg',
  bar: '/place4.jpeg',
  attraction: '/place5.jpeg',
  culture: '/place6.jpeg'
};

const PlaceCard = ({ place, index }) => {
  const navigate = useNavigate();
  const categories = useCategories();
  const CATEGORIES = categories;
  const cat = CATEGORIES[place.catKey] || CATEGORIES.all;
  const galleryFirst = Array.isArray(place?.gallery) && place.gallery.length > 0 ? place.gallery[0] : null;
  const cardImage = place.image || galleryFirst || catImages[place.catKey] || catImages.hotels;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer bg-navy-800"
      onClick={() => navigate(`/stays/${place.id}`)}
    >
      <img
        src={cardImage}
        alt={place.name}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/95 via-navy-900/20 to-transparent" />

      <div className="absolute top-4 left-4">
        <div className="px-3 py-1.5 rounded-full glass-dark text-[9px] font-poppins font-bold text-gold-500 uppercase tracking-[0.15em]">
          {cat.icon} {cat.label}
        </div>
      </div>

      <div className="absolute bottom-5 left-5 right-5">
        {place.tags?.stars && (
          <div className="flex gap-1 mb-2">
            {Array.from({ length: parseInt(place.tags.stars) }).map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-gold-500 text-gold-500" />
            ))}
          </div>
        )}
        <h3 className="font-sora text-xl font-extrabold text-white mb-1">{place.name}</h3>
        <p className="text-xs text-white/50 line-clamp-2 font-inter">
          {place.tags?.description || place.tags?.cuisine || `Explore this ${cat.label.toLowerCase()} in Gisenyi`}
        </p>
        <div className="flex items-center gap-2 mt-3 text-[9px] font-poppins font-bold text-gold-500 uppercase tracking-[0.15em] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          View Details <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </motion.div>
  );
};

const Places = ({ places, loading, activeCat, setActiveCat, search, setSearch, setSelectedPlace }) => {
  const inputRef = useRef(null);
  const categories = useCategories();

  return (
    <section className="py-16 md:py-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8 mb-10">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] font-poppins font-bold text-gold-500 uppercase tracking-[0.3em] mb-3 md:mb-4 block"
            >
              Curated Collection
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-sora text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
            >
              Discover <span className="text-gold-500">Gisenyi</span>
            </motion.h2>
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search places..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-11 py-3 text-sm text-white outline-none focus:border-gold-500/50 transition-all font-inter placeholder:text-white/20"
            />
            {search && (
              <button onClick={() => { setSearch(''); inputRef.current?.focus(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-8 md:mb-10">
          {Object.entries(categories).map(([key, cat]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCat(key)}
              className={`px-3 md:px-5 py-2 md:py-2.5 rounded-xl text-[9px] md:text-[10px] font-poppins font-bold uppercase tracking-[0.15em] transition-all ${
                activeCat === key
                  ? 'bg-gold-500 text-navy-900 shadow-lg shadow-gold-500/25'
                  : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.icon} {cat.label}
            </motion.button>
          ))}
        </div>

        {loading ? (
          <GridSkeleton count={8} />
        ) : places.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 md:py-20"
          >
            <div className="w-14 md:w-16 h-14 md:h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Search className="w-5 md:w-6 h-5 md:h-6 text-white/30" />
            </div>
            <h3 className="font-sora text-lg md:text-xl font-bold text-white/60 mb-2">No places found</h3>
            <p className="text-sm text-white/30 font-inter">Try adjusting your search or filter</p>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {places.map((p, i) => (
                <PlaceCard key={p.id} place={p} index={i} setSelectedPlace={setSelectedPlace} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Places;
