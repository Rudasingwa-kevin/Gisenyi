import React from 'react';
import { motion } from 'framer-motion';

const Gallery = ({ photos }) => {
    return (
        <section className="py-40 bg-soft-gray dark:bg-navy-dark">
            <div className="max-w-7xl mx-auto px-8 mb-20 flex justify-between items-end">
                <h2 className="font-sora text-6xl font-extrabold">Moments in <span className="text-gold">Time</span></h2>
                <button className="text-xs font-poppins font-bold text-gold uppercase tracking-[0.3em]">View Full Archive ↗</button>
            </div>
            <div className="px-8 overflow-x-auto no-scrollbar flex space-x-10 pb-10">
                {photos.concat([
                    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945',
                    'https://images.unsplash.com/photo-1540541338287-41700207eda5',
                    'https://images.unsplash.com/photo-1582719508461-905c673771fd'
                ]).map((url, i) => (
                    <motion.div key={i} whileHover={{ y: -10 }} className="min-w-[400px] h-[550px] rounded-[3rem] overflow-hidden shadow-2xl shrink-0">
                        {url && <img src={url + "?auto=format&fit=crop&q=80&w=800"} className="w-full h-full object-cover" loading="lazy" />}
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Gallery;
