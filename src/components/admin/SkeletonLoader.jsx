import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

export function SkeletonLine({ className }) {
  return (
    <div className={cn('rounded-lg bg-white/[0.04] animate-shimmer', className)} />
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="glass rounded-2xl border border-white/[0.06] p-5 space-y-3">
      <SkeletonLine className="h-5 w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} className="h-3 w-full" style={{ animationDelay: `${i * 100}ms` }} />
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl border border-white/[0.06] p-5"
          >
            <SkeletonLine className="w-11 h-11 rounded-xl mb-3" />
            <SkeletonLine className="h-8 w-16 mb-2" />
            <SkeletonLine className="h-2.5 w-20" />
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} lines={4} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonList({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className="glass rounded-xl border border-white/[0.06] p-4 flex items-center gap-4"
        >
          <SkeletonLine className="w-14 h-14 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonLine className="h-4 w-1/3" />
            <SkeletonLine className="h-3 w-2/3" />
          </div>
          <SkeletonLine className="w-20 h-8 rounded-lg" />
        </motion.div>
      ))}
    </div>
  );
}
