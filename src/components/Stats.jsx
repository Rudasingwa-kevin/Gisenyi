import { motion } from 'framer-motion';
import { Building2, Utensils, Music, Palmtree, Sparkles, Compass, ShoppingBag, Info } from 'lucide-react';
import { useCategories } from '../constants/categories';

const iconMap = {
  hotels: Building2,
  dining: Utensils,
  nightlife: Music,
  beach: Palmtree,
  wellness: Sparkles,
  activities: Compass,
  shopping: ShoppingBag,
  practical: Info
};

const Stats = ({ stats, loading }) => {
  const CATEGORIES = useCategories();
  if (loading || !stats) return null;

  const catEntries = Object.entries(stats.categories).filter(([key]) => key in CATEGORIES && key !== 'all');

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
        >
          {catEntries.map(([key, count], i) => {
            const Icon = iconMap[key] || Info;
            const cat = CATEGORIES[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="relative group p-3 md:p-5 rounded-xl md:rounded-2xl glass hover:glass-gold transition-all duration-300 cursor-default"
              >
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gold-500/10 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-gold-500" />
                  </div>
                  <span className="text-xl md:text-2xl font-sora font-extrabold text-white">{count}</span>
                </div>
                <span className="text-[9px] md:text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.15em]">
                  {cat?.label || key}
                </span>
              </motion.div>
            );
          })}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: catEntries.length * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="relative p-3 md:p-5 rounded-xl md:rounded-2xl bg-gold-500/10 border border-gold-500/20"
          >
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gold-500/20 flex items-center justify-center">
                <Compass className="w-3.5 h-3.5 md:w-4 md:h-4 text-gold-500" />
              </div>
              <span className="text-xl md:text-2xl font-sora font-extrabold text-gold-500">{stats.total}</span>
            </div>
            <span className="text-[9px] md:text-[10px] font-poppins font-bold text-gold-500/80 uppercase tracking-[0.15em]">Total Places</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
