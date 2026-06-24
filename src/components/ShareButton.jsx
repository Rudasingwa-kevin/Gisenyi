import { useState, useRef, useCallback } from 'react';
import { Share2, Download, Copy, Check, X, ExternalLink } from 'lucide-react';
import { toPng } from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '../utils/helpers';

const CAT_IMAGES = {
  hotels: '1542314831-068cd1dbfeeb',
  dining: '1566073771259-6a8506099945',
  nightlife: '1470337458703-46a199543c0b',
  beach: '1507525428697-bcebc0197c25',
  wellness: '1544367567-0f2fcb009e0b',
  activities: '1506905925346-21bda4d32df4',
  shopping: '1441986300917-64674bd600d8',
  practical: '1497366811353-507074f9a6d2',
  concert: '1493225457124-150d8d6faf4c',
  movie: '1489599849927-2ee91f7c4b7c',
  comedy: '1508676750627-138c4c1d0b5a',
  arts: '1499780474430-5e9f3f3b3c8a',
  cultural: '1506905925346-21bda4d32df4',
};

const CATEGORY_META = {
  hotels: { label: 'Hotel', emoji: '🏨', color: '#C9A84C' },
  dining: { label: 'Restaurant', emoji: '🍽', color: '#E8593C' },
  nightlife: { label: 'Nightlife', emoji: '🍹', color: '#7B3FA0' },
  beach: { label: 'Beach', emoji: '🏖', color: '#1A8A9A' },
  wellness: { label: 'Wellness', emoji: '🧘', color: '#2D8A5E' },
  activities: { label: 'Activity', emoji: '🛶', color: '#F39C12' },
  shopping: { label: 'Shopping', emoji: '🛍', color: '#E91E63' },
  practical: { label: 'Info', emoji: 'ℹ', color: '#4A6A8A' },
  cafe: { label: 'Cafe', emoji: '☕', color: '#8B4513' },
  bar: { label: 'Bar', emoji: '🍸', color: '#9370DB' },
  attraction: { label: 'Attraction', emoji: '🎡', color: '#FF6347' },
  culture: { label: 'Culture', emoji: '🎭', color: '#C9A84C' },
  concert: { label: 'Concert', emoji: '🎵', color: '#10B981' },
  movie: { label: 'Movie Night', emoji: '🎬', color: '#8B5CF6' },
  comedy: { label: 'Comedy', emoji: '🎤', color: '#F59E0B' },
  arts: { label: 'Arts', emoji: '🎨', color: '#EC4899' },
  cultural: { label: 'Cultural', emoji: '🎭', color: '#EF4444' },
};

export default function ShareButton({ item, type = 'place', className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef(null);

  const catKey = item.catKey || item.category || 'attraction';
  const meta = CATEGORY_META[catKey] || { label: 'Place', emoji: '📍', color: '#C9A84C' };
  const isPlace = type === 'place';
  const title = isPlace ? item.name : item.title;
  const url = window.location.href;

  const bgImage = item.image || (CAT_IMAGES[catKey]
    ? `https://images.unsplash.com/photo-${CAT_IMAGES[catKey]}?auto=format&fit=crop&q=80&w=1200`
    : null
  );

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Gisenyi - ${title}`,
          text: isPlace
            ? `Discover ${item.name} in Gisenyi, Rwanda`
            : `Join ${item.title} in Gisenyi, Rwanda`,
          url,
        });
      } catch (e) {
        if (e.name !== 'AbortError') console.error(e);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#0A1628',
      });
      const link = document.createElement('a');
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 50)}_gisenyi.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Could not generate share card:', err);
    }
    setDownloading(false);
  }, [title]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl glass-dark border border-white/10 text-white/80 hover:text-white hover:border-gold-500/30 transition-all text-sm font-inter ${className}`}
        aria-label={`Share ${title}`}
      >
        <Share2 className="w-4 h-4" /> Share
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-navy-950/80 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm"
            >
              <div
                ref={cardRef}
                className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
              >
                {bgImage && (
                  <div className="absolute inset-0">
                    <img
                      src={bgImage}
                      alt=""
                      aria-hidden
                      className="w-full h-full object-cover scale-125 blur-3xl"
                    />
                  </div>
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    background: bgImage
                      ? `linear-gradient(145deg, rgba(10,22,40,0.85) 0%, rgba(10,22,40,0.65) 50%, rgba(10,22,40,0.90) 100%)`
                      : `linear-gradient(145deg, ${meta.color}18 0%, ${meta.color}08 40%, #0A1628 100%)`,
                  }}
                />
                <div
                  className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20"
                  style={{ background: meta.color }}
                />
                <div
                  className="absolute -bottom-32 -left-16 w-48 h-48 rounded-full blur-3xl opacity-10"
                  style={{ background: meta.color }}
                />

                <div className="relative z-10 p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <img src="/Gisenyi Logo.png" alt="Gisenyi" className="w-8 h-8 rounded-lg object-cover shadow-lg shadow-gold-500/20" />
                    <div>
                      <p className="text-white font-sora font-bold text-sm leading-tight">Gisenyi</p>
                      <p className="text-white/30 font-inter text-[10px]">Lake Kivu, Rwanda</p>
                    </div>
                  </div>

                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-poppins font-bold uppercase tracking-[0.15em] bg-white/5 text-white/70 border border-white/10 mb-4"
                  >
                    {meta.emoji} {meta.label}
                  </span>

                  <h2 className="font-sora text-2xl md:text-3xl font-extrabold text-white leading-tight mb-4">
                    {title}
                  </h2>

                  <div className="space-y-2.5 mb-6">
                    {isPlace ? (
                      <>
                        <p className="flex items-center gap-2.5 text-white/50 font-inter text-sm">
                          <span className="shrink-0">🌍</span>
                          <span>Gisenyi, Rubavu District</span>
                        </p>
                        <p className="flex items-center gap-2.5 text-white/50 font-inter text-sm">
                          <span className="shrink-0">⭐</span>
                          <span>Rated {(item.tags?.rating || item.rating || 4.5).toFixed(1)} / 5</span>
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="flex items-center gap-2.5 text-white/50 font-inter text-sm">
                          <span className="shrink-0">📅</span>
                          <span>{formatDate(item.date)}</span>
                        </p>
                        {item.time && (
                          <p className="flex items-center gap-2.5 text-white/50 font-inter text-sm">
                            <span className="shrink-0">⏰</span>
                            <span>{item.time}</span>
                          </p>
                        )}
                        <p className="flex items-center gap-2.5 text-white/50 font-inter text-sm">
                          <span className="shrink-0">📍</span>
                          <span>{item.location}</span>
                        </p>
                      </>
                    )}
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-3" />

                  <div className="text-center">
                    <p className="text-white/30 font-inter text-[10px] uppercase tracking-[0.15em] mb-1.5">Visit us</p>
                    <p className="font-sora font-extrabold text-xl text-gold-500 tracking-tight">
                      gisenyi.top
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleNativeShare}
                  className="flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-500 font-poppins font-semibold text-[11px] uppercase tracking-[0.15em] hover:bg-gold-500 hover:text-navy-950 transition-all duration-300"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Share
                </button>
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all font-poppins font-semibold text-[11px] uppercase tracking-[0.15em] disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" /> {downloading ? '...' : 'Image'}
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all font-poppins font-semibold text-[11px] uppercase tracking-[0.15em]"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Link'}
                </button>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full mt-2 py-2.5 rounded-xl text-white/30 hover:text-white/60 transition-all font-inter text-xs"
              >
                <X className="w-3.5 h-3.5" /> Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
