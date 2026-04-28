import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section id="discover" className="relative h-screen flex items-center justify-center overflow-hidden hero-gradient">
            <div className="absolute inset-0 pointer-events-none">
                {/* Animated Lake Ripples */}
                <svg className="absolute bottom-0 w-[200%] h-96 opacity-20 animate-ripple" viewBox="0 0 1000 100" preserveAspectRatio="none">
                    <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" fill="white" />
                </svg>
                <svg className="absolute bottom-10 w-[200%] h-96 opacity-10 animate-ripple" style={{ animationDuration: '15s', animationDirection: 'reverse' }} viewBox="0 0 1000 100" preserveAspectRatio="none">
                    <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" fill="white" />
                </svg>
            </div>

            <div className="relative z-10 text-center px-6 max-w-5xl pt-32 lg:pt-0">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="inline-block px-6 py-2 glass rounded-full mb-8"
                >
                    <span className="text-[10px] font-poppins font-bold text-gold tracking-[0.5em] uppercase">Lake Kivu · Rwanda · Africa</span>
                </motion.div>
                
                <motion.h1 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="font-sora text-[clamp(64px,14vw,180px)] font-extrabold text-white leading-[0.85] tracking-[-0.06em] mb-12 text-glow"
                >
                    GISENYI
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="font-inter text-xl md:text-3xl text-soft-gray/60 font-light mb-16 tracking-tight"
                >
                    Where Volcanic Peaks Meet the Endless Azure.
                </motion.p>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <Link to="/stays" className="px-12 py-5 bg-gold text-primary font-poppins font-bold rounded-full hover:bg-gold-light transition-all transform hover:scale-105 shadow-[0_20px_40px_rgba(201,168,76,0.3)] text-center">
                        Find a Place to Stay
                    </Link>
                    <Link to="/map" className="px-12 py-5 glass text-white font-poppins font-bold rounded-full hover:bg-white/10 transition-all border border-white/20 text-center">
                        Explore the Map
                    </Link>
                </motion.div>
            </div>

            <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute bottom-12 flex flex-col items-center text-gold/50"
            >
                <span className="text-[10px] font-poppins font-bold uppercase tracking-widest mb-4">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent"></div>
            </motion.div>
        </section>
    );
};

export default Hero;
