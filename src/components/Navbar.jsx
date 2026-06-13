import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { name: 'Discover', path: '/' },
  { name: 'Stays', path: '/stays' },
  { name: 'Events', path: '/events' },
  { name: 'Calendar', path: '/calendar' },
  { name: 'Map', path: '/map' },
  { name: 'History', path: '/history' },
  { name: 'Gallery', path: '/gallery' }
];

const Navbar = ({ isDark, setIsDark }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
      scrolled ? 'glass-dark shadow-2xl shadow-gold-500/5' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        <Link to="/" className="relative group">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center group-hover:bg-gold-500/30 transition-all duration-300">
                <MapPin className="w-5 h-5 text-gold-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gold-500 rounded-full animate-pulse-soft" />
            </div>
            <span className="text-xl font-sora font-extrabold tracking-tight text-white">
              GISENYI<span className="text-gold-500">.</span>
            </span>
          </motion.div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((item) => (
            <Link key={item.path} to={item.path}>
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-5 py-2.5 rounded-xl text-[11px] font-poppins font-semibold uppercase tracking-[0.15em] transition-all duration-300 ${
                  pathname === item.path
                    ? 'text-gold-500 bg-gold-500/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.name}
                {pathname === item.path && (
                  <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-4 right-4 h-0.5 bg-gold-500 rounded-full" />
                )}
              </motion.span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDark(!isDark)}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gold-500 hover:bg-white/10 transition-all"
          >
            {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </motion.button>
          <button onClick={() => setMobileOpen(true)} className="md:hidden w-10 h-10 rounded-xl glass flex items-center justify-center text-gold-500">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 bg-navy-900/98 backdrop-blur-xl z-[200] flex flex-col p-10"
          >
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(false)}
                className="w-12 h-12 rounded-xl glass flex items-center justify-center text-gold-500"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-6">
              {links.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                  <motion.span
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-5xl md:text-7xl font-sora font-extrabold tracking-tight transition-colors ${
                      pathname === item.path ? 'text-gold-500' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </motion.span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
