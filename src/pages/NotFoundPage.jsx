import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFoundPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center"
    >
      <SEO title="Page Not Found" noindex={true} />
      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
        <MapPin className="w-10 h-10 text-white/40" />
      </div>
      <h1 className="text-6xl font-bold text-white/20 mb-4">404</h1>
      <h2 className="text-xl font-semibold text-white/70 mb-2">Page not found</h2>
      <p className="text-white/40 mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all font-medium"
      >
        Back to Home
      </Link>
    </motion.div>
  );
}
