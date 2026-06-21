import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

export function AnimatedCard({ children, className, delay = 0, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'glass rounded-2xl border border-white/[0.06] p-5 md:p-6',
        'hover:border-white/[0.12] transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCardHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-500/5 flex items-center justify-center border border-gold-500/10">
            <Icon className="w-5 h-5 text-gold-500" />
          </div>
        )}
        <div>
          <h3 className="font-sora font-bold text-white text-sm">{title}</h3>
          {subtitle && <p className="text-white/40 text-xs font-inter mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
