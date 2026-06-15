import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Star, MessageSquare, ThumbsUp } from 'lucide-react';
import { API_BASE } from '../utils/api';

const stagger = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const FeedbackSection = () => {
  const [form, setForm] = useState({ name: '', email: '', rating: 5, message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, page: window.location.pathname })
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ name: '', email: '', rating: 5, message: '' });
      }
    } catch { /* ignore */ }
    setSending(false);
  };

  return (
    <section className="py-16 md:py-28 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="max-w-3xl mx-auto relative">
        <motion.div {...stagger} className="text-center mb-10 md:mb-14">
          <span className="text-[10px] font-poppins font-bold text-gold-500 uppercase tracking-[0.3em] block mb-4">
            Your Voice Matters
          </span>
          <h2 className="font-sora text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Share Your <span className="text-gold-500">Feedback</span>
          </h2>
          <p className="font-inter text-base md:text-lg text-white/40 max-w-xl mx-auto">
            Help us improve Gisenyi's guide. Your suggestions shape the experience for every visitor.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-8 md:p-10 text-center border border-gold-500/20"
          >
            <div className="w-14 h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="w-6 h-6 text-gold-500" />
            </div>
            <h3 className="font-sora text-xl font-bold text-white mb-2">Thank You!</h3>
            <p className="font-inter text-sm text-white/50 mb-6">Your feedback has been received. We appreciate your input!</p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-5 py-2.5 rounded-xl bg-gold-500 text-navy-900 font-poppins font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-gold-400 transition-all"
            >
              Send Another
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-6 md:p-8 border border-white/5 space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1.5">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-inter outline-none focus:border-gold-500/50 transition-all placeholder:text-white/20"
                />
              </div>
              <div>
                <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-inter outline-none focus:border-gold-500/50 transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-2">Rating</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, rating: n }))}
                    className="p-1 transition-all duration-200"
                  >
                    <Star
                      className={`w-6 h-6 transition-all duration-200 ${
                        n <= form.rating
                          ? 'fill-gold-500 text-gold-500'
                          : 'text-white/20 hover:text-white/40'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1.5">Message *</label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Tell us what you think — what do you love, what could be better?"
                required
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-inter outline-none focus:border-gold-500/50 transition-all placeholder:text-white/20 resize-none"
              />
            </div>

            <motion.button
              type="submit"
              disabled={sending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gold-500 text-navy-900 font-poppins font-bold text-sm hover:bg-gold-400 transition-all disabled:opacity-50"
            >
              {sending ? 'Sending...' : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Feedback
                </>
              )}
            </motion.button>
          </motion.form>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-white/20 text-xs font-inter mt-6 flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-3 h-3" />
          All feedback is reviewed by the Gisenyi team
        </motion.p>
      </div>
    </section>
  );
};

export default FeedbackSection;
