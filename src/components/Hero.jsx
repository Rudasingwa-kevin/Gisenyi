import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, Compass } from 'lucide-react';

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-800 to-navy-700" />
      <div className="absolute inset-0 bg-grid opacity-50" />

      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-20 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl animate-mesh" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl animate-mesh" style={{ animationDelay: '-6s' }} />
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg className="w-full h-48 opacity-20 animate-ripple" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,60 C300,120 600,0 900,60 C1200,120 1440,0 1440,60 L1440,120 L0,120 Z" fill="white" />
        </svg>
        <svg className="w-full h-32 opacity-10 animate-ripple" style={{ animationDuration: '15s', animationDirection: 'reverse' }} viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,40 C200,100 400,0 720,50 C1000,100 1200,0 1440,50 L1440,100 L0,100 Z" fill="white" />
        </svg>
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-5 py-2 glass rounded-full mb-8"
        >
          <Compass className="w-3.5 h-3.5 text-gold-500" />
          <span className="text-[10px] font-poppins font-bold text-gold-500 tracking-[0.3em] uppercase">Lake Kivu · Rwanda · Africa</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-sora text-[clamp(56px,12vw,140px)] font-extrabold text-white leading-[0.85] tracking-[-0.06em] mb-8"
        >
          GISENYI
          <span className="block text-lg sm:text-2xl md:text-4xl font-inter font-light tracking-[0.2em] md:tracking-[0.3em] text-gold-500/80 mt-3 md:mt-4">
            Where Volcanic Peaks Meet the Endless Azure
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 md:mt-12"
        >
          <Link to="/stays">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 bg-gold-500 text-navy-900 font-poppins font-bold text-sm rounded-2xl hover:bg-gold-400 transition-all shadow-2xl shadow-gold-500/25"
            >
              Explore Stays <ArrowRight className="w-4 h-4" />
            </motion.span>
          </Link>
          <Link to="/map">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 glass text-white font-poppins font-bold text-sm rounded-2xl hover:bg-white/10 transition-all"
            >
              View Map <Compass className="w-4 h-4" />
            </motion.span>
          </Link>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="absolute bottom-10 flex flex-col items-center text-white/30"
      >
        <span className="text-[9px] font-poppins font-bold uppercase tracking-[0.3em] mb-3">Scroll</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
};

export default Hero;
