import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export function AnimatedList({ children, className }) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className={className}>
      {children}
    </motion.div>
  );
}

export function AnimatedListItem({ children, className }) {
  return (
    <motion.div
      variants={item}
      layout
      exit={{ opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.25 } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
