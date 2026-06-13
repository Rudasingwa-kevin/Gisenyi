import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

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

function isVideoUrl(url) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url) || /youtube\.com\/watch/i.test(url) || /youtu\.be\//i.test(url) || /vimeo\.com\//i.test(url);
}

function getYoutubeEmbed(url) {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1` : null;
}

function getVimeoEmbed(url) {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? `https://player.vimeo.com/video/${m[1]}?autoplay=1` : null;
}

const Gallery = ({ photos }) => {
  const [items, setItems] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/gallery')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (data.length) setItems(data);
      })
      .catch(() => {});
  }, []);

  const galleryItems = items.length
    ? items.map(i => ({ url: i.url, type: i.type, title: i.title }))
    : photos.length
      ? photos.map(p => ({ url: p, type: 'image', title: '' }))
      : fallbackPhotos.map(p => ({ url: p, type: 'image', title: '' }));

  const open = (i) => setLightbox(i);
  const close = () => setLightbox(null);
  const prev = () => setLightbox(i => (i > 0 ? i - 1 : galleryItems.length - 1));
  const next = () => setLightbox(i => (i < galleryItems.length - 1 ? i + 1 : 0));

  return (
    <section className="py-16 md:py-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] font-poppins font-bold text-gold-500 uppercase tracking-[0.3em] mb-3 md:mb-4 block"
            >
              Visual Journey
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-sora text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
            >
              Moments in <span className="text-gold-500">Time</span>
            </motion.h2>
          </div>
          <span className="text-xs text-white/30 font-inter">{galleryItems.length} items</span>
        </div>

        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 md:gap-4 space-y-3 md:space-y-4">
          {galleryItems.map((item, i) => (
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
              {item.type === 'video' ? (
                <div className="relative">
                  <img src={item.url.replace(/\.(mp4|webm|mov)(\?.*)?$/i, '.jpg')} alt={item.title || 'Gisenyi video'}
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('bg-navy-800', 'aspect-[4/3]', 'flex', 'items-center', 'justify-center');
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-gold-500/90 flex items-center justify-center shadow-2xl">
                      <Play className="w-6 h-6 text-navy-950 ml-0.5" />
                    </div>
                  </div>
                </div>
              ) : (
                <img src={`${item.url}?auto=format&fit=crop&q=80&w=600`} alt={item.title || 'Gisenyi'}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('bg-navy-800', 'aspect-[4/3]', 'flex', 'items-center', 'justify-center');
                  }}
                />
              )}
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
            className="fixed inset-0 z-[300] bg-navy-900/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-6"
            onClick={close}
          >
            <button onClick={close} className="absolute top-4 md:top-6 right-4 md:right-6 w-10 md:w-12 h-10 md:h-12 rounded-xl glass flex items-center justify-center text-white hover:bg-white/10 transition-all z-10">
              <X className="w-4 md:w-5 h-4 md:h-5" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-10 md:w-12 h-10 md:h-12 rounded-xl glass flex items-center justify-center text-white hover:bg-white/10 transition-all z-10">
              <ChevronLeft className="w-4 md:w-5 h-4 md:h-5" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-10 md:w-12 h-10 md:h-12 rounded-xl glass flex items-center justify-center text-white hover:bg-white/10 transition-all z-10">
              <ChevronRight className="w-4 md:w-5 h-4 md:h-5" />
            </button>

            {galleryItems[lightbox].type === 'video' ? (
              <div className="w-full max-w-4xl aspect-video" onClick={e => e.stopPropagation()}>
                {getYoutubeEmbed(galleryItems[lightbox].url) ? (
                  <iframe src={getYoutubeEmbed(galleryItems[lightbox].url)}
                    className="w-full h-full rounded-2xl" allow="autoplay; encrypted-media" allowFullScreen />
                ) : getVimeoEmbed(galleryItems[lightbox].url) ? (
                  <iframe src={getVimeoEmbed(galleryItems[lightbox].url)}
                    className="w-full h-full rounded-2xl" allow="autoplay" allowFullScreen />
                ) : (
                  <video src={galleryItems[lightbox].url} controls autoPlay
                    className="w-full h-full rounded-2xl" />
                )}
              </div>
            ) : (
              <motion.img
                key={lightbox}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                src={`${galleryItems[lightbox].url}?auto=format&fit=crop&q=90&w=1200`}
                alt={galleryItems[lightbox].title || 'Gisenyi'}
                className="max-h-[85vh] max-w-[90vw] rounded-2xl shadow-2xl object-contain"
                onClick={e => e.stopPropagation()}
              />
            )}

            <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/40 font-inter">
              {lightbox + 1} / {galleryItems.length}
              {galleryItems[lightbox].title && <span className="ml-2 text-white/60">&mdash; {galleryItems[lightbox].title}</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
