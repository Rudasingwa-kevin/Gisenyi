import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Ticket, Mic, Film, Music, Palette, Theater, Sparkles } from 'lucide-react';

const EVENT_DATA = [
  {
    id: 1,
    title: 'Kivu Comedy Night',
    category: 'comedy',
    categoryLabel: 'Comedy',
    icon: Mic,
    date: 'June 20, 2026',
    time: '7:00 PM',
    location: 'Lake Kivu Serena Hotel',
    description: 'Rwanda\'s top comedians take the stage for a night of laughter by the lake. Featuring headliner Daudi Kabaka and special guests from Kigali.',
    price: '15,000 RWF',
    gradient: 'from-amber-600/20 to-orange-600/10',
    borderColor: 'border-amber-500/30'
  },
  {
    id: 2,
    title: 'Cinema Under the Stars',
    category: 'movie',
    categoryLabel: 'Movie Night',
    icon: Film,
    date: 'June 24, 2026',
    time: '6:30 PM',
    location: 'Kivu Lounge Beach',
    description: 'Outdoor screening of African cinema classics on the lakeshore. This week: "Africa United" — a story of hope across borders. Popcorn and drinks included.',
    price: '10,000 RWF',
    gradient: 'from-purple-600/20 to-violet-600/10',
    borderColor: 'border-purple-500/30'
  },
  {
    id: 3,
    title: 'Lake Kivu Music Festival',
    category: 'concert',
    categoryLabel: 'Concert',
    icon: Music,
    date: 'July 5, 2026',
    time: '2:00 PM',
    location: 'Gisenyi Beach Stage',
    description: 'A full-day music festival featuring Afrobeat, reggae, and traditional Rwandan music. Headliners: The Ben & Meddy, Knowless Butera, and DJ Kivu.',
    price: '25,000 RWF',
    gradient: 'from-emerald-600/20 to-teal-600/10',
    borderColor: 'border-emerald-500/30'
  },
  {
    id: 4,
    title: 'Art & Wine Evening',
    category: 'arts',
    categoryLabel: 'Arts',
    icon: Palette,
    date: 'July 10, 2026',
    time: '5:00 PM',
    location: 'Ihusi Hotel Gallery',
    description: 'An evening celebrating Rwandan contemporary art. Browse works by emerging Rubavi artists while enjoying Lake Kivu\'s finest wines and canapés.',
    price: '20,000 RWF',
    gradient: 'from-pink-600/20 to-rose-600/10',
    borderColor: 'border-pink-500/30'
  },
  {
    id: 5,
    title: 'Open Mic Night',
    category: 'comedy',
    categoryLabel: 'Comedy',
    icon: Mic,
    date: 'July 12, 2026',
    time: '8:00 PM',
    location: 'Blue Mercy Lounge',
    description: 'Gisenyi\'s most popular open mic — poetry, stand-up, storytelling, and acoustic sets. Sign up at the door. Everyone gets 5 minutes in the spotlight.',
    price: '5,000 RWF',
    gradient: 'from-amber-600/20 to-yellow-600/10',
    borderColor: 'border-amber-500/30'
  },
  {
    id: 6,
    title: 'Thriller Movie Marathon',
    category: 'movie',
    categoryLabel: 'Movie Night',
    icon: Film,
    date: 'July 18, 2026',
    time: '5:00 PM',
    location: 'Kivu Lounge Beach',
    description: 'Back-to-back thriller films on the big outdoor screen. Featuring "Night of the Lake" — a locally produced mystery — plus international blockbusters.',
    price: '12,000 RWF',
    gradient: 'from-purple-600/20 to-indigo-600/10',
    borderColor: 'border-purple-500/30'
  },
  {
    id: 7,
    title: 'Sunset Jazz Concert',
    category: 'concert',
    categoryLabel: 'Concert',
    icon: Music,
    date: 'July 24, 2026',
    time: '4:30 PM',
    location: 'Paradise Malahide Beach',
    description: 'Smooth jazz and bossa nova as the sun sets over Lake Kivu. featuring the Kivu Jazz Quartet with a special appearance by French-Congolese saxophonist Marie Kalenga.',
    price: '18,000 RWF',
    gradient: 'from-emerald-600/20 to-cyan-600/10',
    borderColor: 'border-emerald-500/30'
  },
  {
    id: 8,
    title: 'Intore Dance Performance',
    category: 'cultural',
    categoryLabel: 'Cultural',
    icon: Theater,
    date: 'August 1, 2026',
    time: '3:00 PM',
    location: 'Rubavu Cultural Centre',
    description: 'A spectacular showcase of Rwanda\'s traditional Intore dance — the dance of heroes — performed by the award-winning Ishyo Arts Ensemble. Drumming, costumes, and storytelling.',
    price: '8,000 RWF',
    gradient: 'from-red-600/20 to-orange-600/10',
    borderColor: 'border-red-500/30'
  },
  {
    id: 9,
    title: 'Neon Pool Party',
    category: 'concert',
    categoryLabel: 'Concert',
    icon: Sparkles,
    date: 'August 8, 2026',
    time: '12:00 PM',
    location: 'Kivu Beach Club',
    description: 'Gisenyi\'s biggest pool party of the summer. Live DJs, floating stages, neon glow, and lakeside cocktails. Bring your swimsuit and your energy.',
    price: '30,000 RWF',
    gradient: 'from-sky-600/20 to-blue-600/10',
    borderColor: 'border-sky-500/30'
  },
  {
    id: 10,
    title: 'Kids Movie Matinee',
    category: 'movie',
    categoryLabel: 'Movie Night',
    icon: Film,
    date: 'August 15, 2026',
    time: '2:00 PM',
    location: 'Kivu Lounge Beach',
    description: 'Family-friendly animated films every Saturday afternoon. This week: "Moana" — the ocean adventure the whole family will love. Free popcorn for kids!',
    price: '5,000 RWF',
    gradient: 'from-purple-600/20 to-fuchsia-600/10',
    borderColor: 'border-purple-500/30'
  },
  {
    id: 11,
    title: 'Paint & Sip Night',
    category: 'arts',
    categoryLabel: 'Arts',
    icon: Palette,
    date: 'August 20, 2026',
    time: '6:00 PM',
    location: 'Ihusi Hotel Terrace',
    description: 'Unleash your inner artist with guided painting by local artist Emmanuel Niyonzima. All materials provided. Sip on Lake Kivu wine as you paint the sunset.',
    price: '15,000 RWF',
    gradient: 'from-pink-600/20 to-rose-600/10',
    borderColor: 'border-pink-500/30'
  },
  {
    id: 12,
    title: 'Kwita Izina Eve Celebration',
    category: 'cultural',
    categoryLabel: 'Cultural',
    icon: Theater,
    date: 'September 1, 2026',
    time: '5:00 PM',
    location: 'Gisenyi Waterfront',
    description: 'Pre-celebration for the annual Kwita Izina gorilla naming ceremony. Live music, traditional dance, Rwandan cuisine, and community storytelling under the stars.',
    price: 'Free',
    gradient: 'from-red-600/20 to-rose-600/10',
    borderColor: 'border-red-500/30'
  }
];

const CATEGORIES = [
  { key: 'all', label: 'All Events', icon: Sparkles },
  { key: 'concert', label: 'Concerts', icon: Music },
  { key: 'movie', label: 'Movie Nights', icon: Film },
  { key: 'comedy', label: 'Comedy', icon: Mic },
  { key: 'arts', label: 'Arts', icon: Palette },
  { key: 'cultural', label: 'Cultural', icon: Theater }
];

const Events = () => {
  const [activeCat, setActiveCat] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filtered = activeCat === 'all'
    ? EVENT_DATA
    : EVENT_DATA.filter(e => e.category === activeCat);

  return (
    <section className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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

        {/* Category Filters */}
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

        {/* Events Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map(event => {
              const Icon = event.icon;
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
                  {/* Gradient top bar */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${event.gradient}`} />

                  <div className="p-6">
                    {/* Category badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-poppins font-bold uppercase tracking-[0.15em] glass ${event.borderColor.replace('border-', 'text-').replace('/30', '')}`}>
                        <Icon className="w-3 h-3" />
                        {event.categoryLabel}
                      </span>
                      <span className="text-[10px] font-poppins font-bold text-gold-500">
                        {event.price}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-sora text-xl font-extrabold text-white mb-3 group-hover:text-gold-500 transition-colors">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="font-inter text-sm text-white/50 leading-relaxed mb-5 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Meta info */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2.5 text-white/40 group-hover:text-white/60 transition-colors">
                        <Calendar className="w-3.5 h-3.5 text-gold-500/60" />
                        <span className="font-inter text-xs">{event.date}</span>
                        <span className="text-white/20">•</span>
                        <Clock className="w-3.5 h-3.5 text-gold-500/60" />
                        <span className="font-inter text-xs">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/40 group-hover:text-white/60 transition-colors">
                        <MapPin className="w-3.5 h-3.5 text-gold-500/60" />
                        <span className="font-inter text-xs">{event.location}</span>
                      </div>
                    </div>

                    {/* Book button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-500 font-poppins font-semibold text-[10px] uppercase tracking-[0.2em] hover:bg-gold-500 hover:text-navy-900 transition-all duration-300"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      Get Tickets
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filtered.length === 0 && (
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
    </section>
  );
};

export default Events;
