import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const fallbackPhotos = [
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945',
  'https://images.unsplash.com/photo-1540541338287-41700207eda5',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd',
  'https://images.unsplash.com/photo-1507525428697-bcebc0197c25',
  'https://images.unsplash.com/photo-1470337458703-46a199543c0b',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
  'https://images.unsplash.com/photo-1497366811353-507074f9a6d2'
];

const Gallery = ({ photos }) => {
  const allPhotos = [...(photos.length ? photos : []), ...fallbackPhotos];
  const [lightbox, setLightbox] = useState(null);

  const open = (i) => setLightbox(i);
  const close = () => setLightbox(null);
  const prev = () => setLightbox(i => (i > 0 ? i - 1 : allPhotos.length - 1));
  const next = () => setLightbox(i => (i < allPhotos.length - 1 ? i + 1 : 0));

  return (
    <section className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] font-poppins font-bold text-gold-500 uppercase tracking-[0.3em] mb-4 block"
            >
              Visual Journey
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-sora text-4xl md:text-5xl font-extrabold tracking-tight"
            >
              Moments in <span className="text-gold-500">Time</span>
            </motion.h2>
          </div>
          <span className="text-xs text-white/30 font-inter">{allPhotos.length} photos</span>
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {allPhotos.map((url, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 8) * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => open(i)}
              className="break-inside-avoid rounded-xl overflow-hidden cursor-pointer group relative"
            >
              <img src={`${url}?auto=format&fit=crop&q=80&w=600`} alt={`Gisenyi ${i}`}
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-navy-900/98 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={close}
          >
            <button onClick={close} className="absolute top-6 right-6 w-12 h-12 rounded-xl glass flex items-center justify-center text-white hover:bg-white/10 transition-all z-10">
              <X className="w-5 h-5" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl glass flex items-center justify-center text-white hover:bg-white/10 transition-all z-10">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl glass flex items-center justify-center text-white hover:bg-white/10 transition-all z-10">
              <ChevronRight className="w-5 h-5" />
            </button>
            <motion.img
              key={lightbox}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={`${allPhotos[lightbox]}?auto=format&fit=crop&q=90&w=1200`}
              alt={`Gisenyi ${lightbox}`}
              className="max-h-[85vh] max-w-[90vw] rounded-2xl shadow-2xl object-contain"
              onClick={e => e.stopPropagation()}
            />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/40 font-inter">
              {lightbox + 1} / {allPhotos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
