import { motion } from 'framer-motion';
import { HISTORY_ERAS } from '../constants/data';

const TimelineDot = () => (
  <div className="absolute left-1/2 -translate-x-1/2 hidden lg:block" style={{ top: `${(index / (HISTORY_ERAS.length - 1)) * 100}%` }}>
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      className="w-4 h-4 rounded-full bg-gold-500 border-4 border-navy-800 shadow-lg shadow-gold-500/30"
    />
  </div>
);

const HistoryEra = ({ era, index }) => (
  <motion.div
    initial={{ opacity: 0, x: era.side === 'left' ? -40 : 40 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-20 ${era.side === 'right' ? 'lg:flex-row-reverse' : ''}`}
  >
    <div className="w-full lg:w-[40%]">
      <div
        className="aspect-[4/3] rounded-2xl overflow-hidden relative group"
        style={{ background: era.gradient }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/5 font-sora text-[12rem] font-extrabold select-none">{era.id}</span>
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          <span className="text-[9px] font-poppins font-bold text-gold-500 tracking-[0.3em] uppercase mb-2 block">{era.period}</span>
          <h3 className="font-sora text-3xl font-extrabold text-white">{era.title}</h3>
        </div>
      </div>
    </div>
    <div className="w-full lg:w-[60%]">
      <p className="font-inter text-base md:text-lg text-white/60 leading-relaxed">
        <span className="text-4xl font-sora font-extrabold text-gold-500 float-left mr-2 mt-1">{era.text[0]}</span>
        {era.text.substring(1)}
      </p>
    </div>
  </motion.div>
);

const History = () => (
  <section className="py-28 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="max-w-3xl mb-20">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-[10px] font-poppins font-bold text-gold-500 uppercase tracking-[0.3em] mb-4 block"
        >
          Chronicles of the Riviera
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
        >
          A Legacy of <span className="text-gold-500">Fire & Water</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="font-inter text-lg text-white/40"
        >
          From volcanic genesis to the modern renaissance, Gisenyi's soul is etched into the very shores of Lake Kivu.
        </motion.p>
      </div>

      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-500/30 to-transparent -translate-x-1/2 hidden lg:block" />
        {HISTORY_ERAS.map((era, i) => (
          <div key={era.id} className="relative pb-28 last:pb-0">
            <TimelineDot index={i} />
            <HistoryEra era={era} index={i} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default History;
