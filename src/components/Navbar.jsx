import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/helpers';

const Navbar = ({ isDark, setIsDark }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handle = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handle);
        return () => window.removeEventListener('scroll', handle);
    }, []);

    const navLinks = [
        { name: 'Discover', path: '/' },
        { name: 'History', path: '/history' },
        { name: 'Stays', path: '/stays' },
        { name: 'Activities', path: '/stays' },
        { name: 'Map', path: '/map' },
        { name: 'Gallery', path: '/gallery' }
    ];

    return (
        <nav className={cn(
            "fixed top-0 w-full z-[100] transition-all duration-700",
            scrolled ? 'py-4 glass-dark border-b border-gold/20' : 'py-8 bg-transparent'
        )}>
            <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
                <Link to="/">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center space-x-3 group cursor-pointer"
                    >
                        <div className="relative">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-gold transition-transform duration-500 group-hover:rotate-12">
                                <path d="M2 12C2 12 5 9 12 9C19 9 22 12 22 12C22 12 19 15 12 15C5 15 2 12 2 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 12L12 12.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                            </svg>
                            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-success rounded-full"></div>
                        </div>
                        <span className="text-2xl font-sora font-extrabold tracking-[-0.05em] text-white">GISENYI</span>
                    </motion.div>
                </Link>

                <div className="hidden lg:flex items-center space-x-10">
                    {navLinks.map((item, i) => (
                        <motion.div 
                            key={item.name}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link 
                                to={item.path}
                                className={cn(
                                    "text-[11px] font-poppins font-semibold uppercase tracking-[0.2em] transition-all relative group",
                                    location.pathname === item.path ? 'text-gold' : 'text-soft-gray/60 hover:text-gold'
                                )}
                            >
                                {item.name}
                                <span className={cn(
                                    "absolute -bottom-2 left-0 h-[1px] bg-gold transition-all duration-300",
                                    location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'
                                )}></span>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="flex items-center space-x-6">
                    <button onClick={() => setIsDark(!isDark)} className="p-2.5 rounded-full glass hover:bg-white/10 transition-all text-gold">
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2.5 rounded-xl glass text-gold">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        className="fixed inset-0 bg-primary z-[200] flex flex-col p-12"
                    >
                        <button onClick={() => setMobileOpen(false)} className="self-end p-4 text-gold">
                            <X className="w-10 h-10" />
                        </button>
                        <div className="flex-1 flex flex-col justify-center space-y-8">
                            {navLinks.map((item) => (
                                <Link 
                                    key={item.name} 
                                    to={item.path} 
                                    onClick={() => setMobileOpen(false)} 
                                    className={cn(
                                        "text-5xl font-sora font-extrabold transition-colors",
                                        location.pathname === item.path ? 'text-gold' : 'text-white hover:text-gold'
                                    )}
                                >
                                    {item.name}
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
