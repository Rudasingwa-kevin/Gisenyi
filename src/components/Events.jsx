import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Ticket, Mic, Film, Music, Palette, Theater, Sparkles, ExternalLink, X } from 'lucide-react';

const CATEGORIES = [
  { key: 'all', label: 'All Events', icon: Sparkles },
  { key: 'concert', label: 'Concerts', icon: Music },
  { key: 'movie', label: 'Movie Nights', icon: Film },
  { key: 'comedy', label: 'Comedy', icon: Mic },
  { key: 'arts', label: 'Arts', icon: Palette },
  { key: 'cultural', label: 'Cultural', icon: Theater }
];

const FALLBACK_EVENTS = [];

const Events = () => {
  const [events, setEvents] = useState(FALLBACK_EVENTS);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/api/events')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { if (data?.length) setEvents(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCat === 'all'
    ? events
    : events.filter(e => e.category === activeCat);

  const categoryGradients = {
    concert: 'from-emerald-600/20 to-teal-600/10',
    movie: 'from-purple-600/20 to-violet-600/10',
    comedy: 'from-amber-600/20 to-orange-600/10',
    arts: 'from-pink-600/20 to-rose-600/10',
    cultural: 'from-red-600/20 to-orange-600/10'
  };

  const borderColors = {
    concert: 'border-emerald-500/30',
    movie: 'border-purple-500/30',
    comedy: 'border-amber-500/30',
    arts: 'border-pink-500/30',
    cultural: 'border-red-500/30'
  };

  const catIconMap = {
    concert: Music,
    movie: Film,
    comedy: Mic,
    arts: Palette,
    cultural: Theater
  };

  return (
    <section className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] font-poppins font-bold text-gold-500 uppercase tracking-[0.3em] mb-4 block"
          >
            What's Happening
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
          >
            Events in <span className="text-gold-500">Gisenyi</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="font-inter text-lg text-white/40"
          >
            From lakeside concerts to comedy nights under the stars — discover the vibrant culture and entertainment scene on the shores of Lake Kivu.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-3 mb-12"
        >
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCat === cat.key;
            return (
              <motion.button
                key={cat.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCat(cat.key)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[11px] font-poppins font-semibold uppercase tracking-[0.15em] transition-all duration-300 ${
                  isActive
                    ? 'bg-gold-500 text-navy-900'
                    : 'glass text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </motion.button>
            );
          })}
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/5 overflow-hidden animate-pulse">
                <div className="aspect-[2/1] bg-white/10" />
                <div className="p-6 space-y-3">
                  <div className="h-3 bg-white/10 rounded w-1/3" />
                  <div className="h-5 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded w-full" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map(event => {
                const Icon = catIconMap[event.category] || Sparkles;
                const grad = categoryGradients[event.category] || 'from-gray-600/20 to-gray-600/10';
                const border = borderColors[event.category] || 'border-white/10';
                return (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative overflow-hidden rounded-2xl glass border border-white/5 hover:border-gold-500/30 transition-all duration-500"
                  >
                    {event.image ? (
                      <button onClick={() => setLightbox(event.image)} className="relative aspect-[2/1] overflow-hidden w-full">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />
                      </button>
                    ) : (
                      <div className={`h-1.5 w-full bg-gradient-to-r ${grad}`} />
                    )}

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-poppins font-bold uppercase tracking-[0.15em] glass ${border.replace('border-', 'text-').replace('/30', '')}`}>
                          <Icon className="w-3 h-3" />
                          {event.category}
                        </span>
                        {event.price && (
                          <span className="text-[10px] font-poppins font-bold text-gold-500">
                            {event.price}
                          </span>
                        )}
                      </div>

                      <h3 className="font-sora text-xl font-extrabold text-white mb-3 group-hover:text-gold-500 transition-colors">
                        {event.title}
                      </h3>

                      {event.description && (
                        <p className="font-inter text-sm text-white/50 leading-relaxed mb-5 line-clamp-2">
                          {event.description}
                        </p>
                      )}

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2.5 text-white/40 group-hover:text-white/60 transition-colors">
                          <Calendar className="w-3.5 h-3.5 text-gold-500/60 shrink-0" />
                          <span className="font-inter text-xs">{event.date}</span>
                          {event.time && (
                            <>
                              <span className="text-white/20">•</span>
                              <Clock className="w-3.5 h-3.5 text-gold-500/60 shrink-0" />
                              <span className="font-inter text-xs">{event.time}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-white/40 group-hover:text-white/60 transition-colors">
                          <MapPin className="w-3.5 h-3.5 text-gold-500/60 shrink-0" />
                          <span className="font-inter text-xs">{event.location}</span>
                        </div>
                      </div>

                      {event.ticketLink && (
                        <a
                          href={event.ticketLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-500 font-poppins font-semibold text-[10px] uppercase tracking-[0.2em] hover:bg-gold-500 hover:text-navy-900 transition-all duration-300"
                        >
                          <Ticket className="w-3.5 h-3.5" />
                          Get Tickets
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Sparkles className="w-12 h-12 mx-auto text-white/20 mb-4" />
            <p className="font-inter text-lg text-white/30">No events in this category right now.</p>
            <p className="font-inter text-sm text-white/20 mt-2">Check back soon for new listings!</p>
          </motion.div>
        )}
      </div>

      {lightbox && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[200] bg-navy-950/80 backdrop-blur-xl flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            src={lightbox}
            alt="Event flyer"
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl"
          />
        </motion.div>
      )}
    </section>
  );
};

export default Events;
