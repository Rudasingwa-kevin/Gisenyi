import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title = 'Delete item', loading: externalLoading }) {
  const cancelRef = useRef(null);
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = externalLoading ?? internalLoading;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    cancelRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleConfirm = async () => {
    if (loading) return;
    setInternalLoading(true);
    try {
      await onConfirm();
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={loading ? undefined : onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="relative glass-dark rounded-2xl border border-white/10 p-6 max-w-sm w-full shadow-2xl"
          >
            <button
              onClick={onClose}
              disabled={loading}
              className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors disabled:opacity-30"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h3 id="delete-modal-title" className="font-sora font-bold text-white text-sm">Confirm Delete</h3>
            </div>

            <p className="text-white/50 text-sm font-inter mb-6">
              Are you sure you want to delete <span className="text-white/80 font-medium">{title}</span>? This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                ref={cancelRef}
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-white/50 hover:text-white/70 text-sm font-inter rounded-xl hover:bg-white/[0.04] transition-all disabled:opacity-30"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-sm font-inter font-semibold hover:bg-red-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
