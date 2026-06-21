import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (target == null || target === 0) return;
    const start = performance.now();
    const from = 0;
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(from + (target - from) * eased));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration]);

  return count;
}

export default function StatCard({ icon: Icon, label, value, color = 'gold', delay = 0 }) {
  const displayValue = useCountUp(value);

  const colorMap = {
    gold: 'from-gold-500/20 to-gold-500/5 border-gold-500/10 text-gold-500',
    blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/10 text-blue-400',
    green: 'from-green-500/20 to-green-500/5 border-green-500/10 text-green-400',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/10 text-purple-400',
    red: 'from-red-500/20 to-red-500/5 border-red-500/10 text-red-400',
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/10 text-cyan-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-2xl border border-white/[0.06] p-5 group hover:border-white/[0.12] transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={cn(
          'w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center border transition-transform duration-300 group-hover:scale-110',
          colorMap[color]
        )}>
          <Icon className={cn('w-5 h-5', colorMap[color].split(' ').pop())} />
        </div>
      </div>
      <div className="text-2xl md:text-3xl font-sora font-extrabold text-white tabular-nums">
        {displayValue.toLocaleString()}
      </div>
      <p className="text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.18em] mt-1.5">
        {label}
      </p>
    </motion.div>
  );
}
