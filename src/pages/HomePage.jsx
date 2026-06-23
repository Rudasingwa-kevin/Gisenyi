import Hero from '../components/Hero';
import Stats from '../components/Stats';
import FeedbackSection from '../components/FeedbackSection';
import SEO from '../components/SEO';
import { SITE } from '../constants/site';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Compass, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FALLBACK_DATA } from '../constants/data';
import { API_BASE } from '../utils/api';

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

const galleryPreviews = [
  '/place1.jpeg',
  '/place2.jpeg',
  '/place3.jpeg',
  '/place4.jpeg',
  '/place5.jpeg',
  '/place6.jpeg'
];

const experiences = [
  {
    title: 'A Legacy of Fire & Water',
    desc: 'From volcanic genesis to the modern renaissance, explore the chronicles of Rwanda\'s most resilient city.',
    link: '/history',
    label: 'Discover History',
    img: '/place1.jpeg'
  },
  {
    title: 'Curated Destinations',
    desc: 'Experience the pinnacle of African lakeside luxury. From boutique resorts to world-class dining.',
    link: '/stays',
    label: 'View Stays',
    img: '/place2.jpeg'
  },
  {
    title: 'Interactive Exploration',
    desc: 'Navigate the shoreline with real-time data powered by OpenStreetMap.',
    link: '/map',
    label: 'Open Map',
    img: '/place3.jpeg'
  }
];

const HomePage = ({ stats, loading, places = [] }) => {
  const totalPlaces = stats?.total || FALLBACK_DATA.length;
  const [featuredPlaces, setFeaturedPlaces] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/places/featured`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setFeaturedPlaces(Array.isArray(data) ? data : []))
      .catch(() => setFeaturedPlaces([]));
  }, []);

  const stagger = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  };

  return (
    <div>
      <SEO
        title="Gisenyi — The Riviera of Central Africa"
        description="Discover Gisenyi — the Riviera of Central Africa. Explore hotels, restaurants, attractions and more on the shores of Lake Kivu, Rwanda."
        url="/"
        type="website"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE.name,
          url: SITE.url,
          description: SITE.description,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE.url}/stays?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      <Hero />
      <Stats stats={stats} loading={loading} />

      {/* Featured Destinations */}
      <section className="py-16 md:py-28 px-4 sm:px-6 bg-gradient-to-b from-transparent via-navy-800/30 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div {...stagger} className="text-center mb-12 md:mb-16">
            <span className="text-[10px] font-poppins font-bold text-gold-500 uppercase tracking-[0.3em] block mb-4">
              Curated Selection
            </span>
            <h2 className="font-sora text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight">
              Featured <span className="text-gold-500">Destinations</span>
            </h2>
            <p className="font-inter text-base md:text-lg text-white/40 mt-4 max-w-2xl mx-auto">
              Discover the finest experiences across {totalPlaces} hand-picked locations
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
            {featuredPlaces.map((place, i) => {
              const galleryFirst = Array.isArray(place.gallery) && place.gallery.length > 0 ? place.gallery[0] : null;
              const imgUrl = place.image || galleryFirst || catImages[place.catKey] || catImages.hotels;
              return (
                <Link
                  key={place.id}
                  to={`/stays/${place.id}`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -6 }}
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
                  >
                    <img
                      src={imgUrl}
                      alt={place.name}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/95 via-navy-900/30 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <div className="px-2.5 py-1 rounded-lg glass-dark text-[8px] font-poppins font-bold text-gold-500 uppercase tracking-[0.15em]">
                        {place.featuredTag || place.catKey}
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-1 mb-1.5">
                        <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
                        <span className="text-[10px] font-poppins font-bold text-white/70">{place.rating}</span>
                      </div>
                      <h3 className="font-sora text-base sm:text-lg font-extrabold text-white">{place.name}</h3>
                      <div className="flex items-center gap-1 mt-2 text-[8px] font-poppins font-bold text-gold-500 uppercase tracking-[0.15em] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Explore <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experience Gisenyi */}
      <section className="py-16 md:py-28 px-4 sm:px-6 relative">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div {...stagger} className="text-center mb-16 md:mb-24">
            <span className="text-[10px] font-poppins font-bold text-gold-500 uppercase tracking-[0.3em] block mb-4">
              Explore Further
            </span>
            <h2 className="font-sora text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight">
              The Gisenyi <span className="text-gold-500">Experience</span>
            </h2>
          </motion.div>

          <div className="space-y-20 md:space-y-32">
            {experiences.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 lg:gap-24 items-center ${i % 2 === 1 ? '' : ''}`}
              >
                <div className={`${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <span className="text-[10px] font-poppins font-bold text-gold-500 uppercase tracking-[0.3em] mb-3 block">
                    0{i + 1}
                  </span>
                  <h2 className="font-sora text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 md:mb-6">
                    {item.title}
                  </h2>
                  <p className="text-white/50 font-inter text-base md:text-lg leading-relaxed mb-8">
                    {item.desc}
                  </p>
                  <Link to={item.link}>
                    <motion.span
                      whileHover={{ x: 6 }}
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-500 font-poppins font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-gold-500 hover:text-navy-900 transition-all duration-300"
                    >
                      {item.label} <ArrowRight className="w-3.5 h-3.5" />
                    </motion.span>
                  </Link>
                </div>
                <div className={`${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden relative group">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                      loading={i === 0 ? 'eager' : 'lazy'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-navy-900/40 via-transparent to-transparent" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-16 md:py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...stagger} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-14">
            <div>
              <span className="text-[10px] font-poppins font-bold text-gold-500 uppercase tracking-[0.3em] block mb-4">
                Visual Journey
              </span>
              <h2 className="font-sora text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                Moments in <span className="text-gold-500">Gisenyi</span>
              </h2>
            </div>
            <Link to="/gallery">
              <motion.span
                whileHover={{ x: 4 }}
                className="inline-flex items-center gap-2 text-gold-500 font-poppins font-bold text-[10px] uppercase tracking-[0.2em]"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </motion.span>
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {galleryPreviews.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className={`rounded-2xl overflow-hidden relative group ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''} ${i === 5 ? 'md:col-span-2' : ''}`}
              >
                <div className={`${i === 0 ? 'aspect-[2/1] md:aspect-auto md:h-full' : 'aspect-[4/3]'}`}>
                  <img
                    src={img}
                    alt={`Gisenyi ${i + 1}`}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Preview CTA */}
      <section className="py-16 md:py-28 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/place4.jpeg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-navy-900/85 backdrop-blur-sm" />
        </div>
        <div className="max-w-4xl mx-auto relative text-center">
          <motion.div {...stagger}>
            <div className="inline-flex items-center gap-2 px-5 py-2 glass rounded-full mb-6">
              <MapPin className="w-3.5 h-3.5 text-gold-500" />
              <span className="text-[10px] font-poppins font-bold text-gold-500 tracking-[0.3em] uppercase">
                Powered by OpenStreetMap
              </span>
            </div>
            <h2 className="font-sora text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Explore the <span className="text-gold-500">Shoreline</span>
            </h2>
            <p className="font-inter text-base md:text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
              Navigate our interactive map to discover every corner of Gisenyi — from lakeside resorts to volcanic hot springs, all plotted with precision.
            </p>
            <Link to="/map">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-8 sm:px-10 py-4 bg-gold-500 text-navy-900 font-poppins font-bold text-sm rounded-2xl hover:bg-gold-400 transition-all shadow-2xl shadow-gold-500/25"
              >
                <Compass className="w-4 h-4" />
                Open Interactive Map
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>

      <FeedbackSection />

      {/* Final CTA */}
      <section className="py-20 md:py-32 px-4 sm:px-6 bg-gradient-to-b from-transparent via-navy-800/30 to-navy-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...stagger}>
            <h2 className="font-sora text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Your Journey <span className="text-gold-500">Awaits</span>
            </h2>
            <p className="font-inter text-base md:text-lg text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed">
              Whether you seek adventure on Lake Kivu, relaxation at a beachfront resort, or a deep dive into the region's rich history — Gisenyi welcomes you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/stays">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 px-8 sm:px-10 py-4 bg-gold-500 text-navy-900 font-poppins font-bold text-sm rounded-2xl hover:bg-gold-400 transition-all shadow-2xl shadow-gold-500/25"
                >
                  Browse Stays <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
              <Link to="/events">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 px-8 sm:px-10 py-4 glass text-white font-poppins font-bold text-sm rounded-2xl hover:bg-white/10 transition-all"
                >
                  View Events <ChevronRight className="w-4 h-4" />
                </motion.span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
