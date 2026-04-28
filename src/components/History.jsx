import React from 'react';
import { motion } from 'framer-motion';
import { HISTORY_ERAS } from '../constants/data';

const HistoryEra = ({ era }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, x: era.side === 'left' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-32 ${era.side === 'right' ? 'lg:flex-row-reverse' : ''}`}
        >
            <div className="w-full lg:w-[45%] relative">
                <div 
                    className="aspect-[4/3] rounded-[40px] shadow-2xl overflow-hidden relative group"
                    style={{ background: era.gradient }}
                >
                    <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white/5 font-sora text-[15rem] font-extrabold select-none">{era.id}</span>
                    </div>
                    <div className="absolute bottom-12 left-12 right-12">
                        <span className="text-[10px] font-poppins font-bold text-gold tracking-[0.4em] uppercase mb-4 block">{era.period}</span>
                        <h3 className="font-sora text-4xl font-extrabold text-white leading-tight">{era.title}</h3>
                    </div>
                </div>
            </div>
            <div className="w-full lg:w-[55%]">
                <p className="font-inter text-xl lg:text-2xl text-muted-text leading-relaxed font-light dark:text-soft-gray/70">
                    <span className="text-5xl font-sora font-extrabold text-gold float-left mr-4 mt-2">{era.text[0]}</span>
                    {era.text.substring(1)}
                </p>
            </div>
        </motion.div>
    );
};

const History = () => {
    return (
        <section id="history" className="py-40 bg-white dark:bg-navy-mid transition-colors duration-700">
            <div className="max-w-7xl mx-auto px-8">
                <div className="max-w-3xl mb-32">
                    <motion.span 
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                        className="text-[11px] font-poppins font-bold text-gold tracking-[0.4em] uppercase mb-6 block"
                    >
                        Chronicles of the Riviera
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                        className="font-sora text-6xl md:text-8xl font-extrabold tracking-[-0.05em] mb-8"
                    >
                        A Legacy of <span className="text-gold">Fire & Water</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                        className="font-inter text-2xl text-muted-text font-light"
                    >
                        From volcanic genesis to the modern renaissance, Gisenyi's soul is etched into the very shores of Lake Kivu.
                    </motion.p>
                </div>

                <div className="relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gold to-transparent -translate-x-1/2 hidden lg:block opacity-30"></div>
                    <div className="space-y-40">
                        {HISTORY_ERAS.map((era) => (
                            <HistoryEra key={era.id} era={era} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default History;
