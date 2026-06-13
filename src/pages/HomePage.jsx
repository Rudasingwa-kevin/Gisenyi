import Hero from '../components/Hero';
import Stats from '../components/Stats';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const teasers = [
  { title: 'A Legacy of Fire & Water', desc: 'From volcanic genesis to the modern renaissance, explore the chronicles of Rwanda\'s most resilient city.', link: '/history', label: 'Discover History', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb' },
  { title: 'Curated Destinations', desc: 'Experience the pinnacle of African lakeside luxury. From boutique resorts to world-class dining.', link: '/stays', label: 'View Stays', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945' },
  { title: 'Interactive Exploration', desc: 'Navigate the shoreline with real-time data powered by OpenStreetMap.', link: '/map', label: 'Open Map', img: 'https://images.unsplash.com/photo-1540541338287-41700207eda5' },
  { title: 'Endless Adventure', desc: 'From kayaking on Lake Kivu to exploring volcanic trails and cultural museums.', link: '/stays', label: 'Explore Activities', img: 'https://images.unsplash.com/photo-1507525428697-bcebc0197c25' }
];

const HomePage = ({ stats, loading }) => (
  <div>
    <Hero />
    <Stats stats={stats} loading={loading} />
    <section className="py-12 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-12 md:space-y-24">
        {teasers.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center`}
            style={{ direction: i % 2 === 1 ? 'rtl' : 'ltr' }}
          >
            <div style={{ direction: 'ltr' }}>
              <h2 className="font-sora text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 md:mb-4">{item.title}</h2>
              <p className="text-white/50 font-inter text-base md:text-lg leading-relaxed mb-6 md:mb-8">{item.desc}</p>
              <Link to={item.link}>
                <motion.span
                  whileHover={{ x: 4 }}
                  className="inline-flex items-center gap-2 text-gold-500 font-poppins font-bold text-[10px] uppercase tracking-[0.2em]"
                >
                  {item.label} <ArrowRight className="w-3.5 h-3.5" />
                </motion.span>
              </Link>
            </div>
            <div style={{ direction: 'ltr' }}>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img src={`${item.img}?auto=format&fit=crop&q=80&w=800`} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  </div>
);

export default HomePage;
