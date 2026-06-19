import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { API, fetchWithAuth } from '../utils/admin';

export default function AddCalendarItemPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', date: '', time: '', type: 'note', color: '#4A90D9', location: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) navigate('/');
  }, [isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetchWithAuth(`${API}/calendar`, { method: 'POST', body: JSON.stringify(form) });
    if (res.ok) navigate('/admin');
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-white/50 hover:text-gold-500 transition-colors text-xs md:text-sm font-inter mb-4 md:mb-6">
          <ArrowLeft className="w-3.5 md:w-4 h-3.5 md:h-4" /> Back to Admin
        </button>
        <h1 className="text-xl md:text-2xl font-sora font-bold text-white mb-4 md:mb-6">Add New Calendar Item</h1>
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/5 rounded-xl p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Title</label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" required />
            </div>
            <div>
              <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50">
                <option value="event">Event</option>
                <option value="note">Note</option>
                <option value="reminder">Reminder</option>
                <option value="holiday">Holiday</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Date (YYYY-MM-DD)</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" required />
            </div>
            <div>
              <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Time</label>
              <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50 resize-none" />
            </div>
            <div>
              <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Location</label>
              <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" />
            </div>
            <div>
              <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Color</label>
              <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                className="w-full h-10 bg-white/5 border border-white/10 rounded-lg cursor-pointer" />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button type="submit" disabled={saving}
              className="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-gold-500 text-navy-950 rounded-xl text-sm font-sora font-bold hover:bg-gold-600 transition-all disabled:opacity-50">
              {saving ? 'Saving...' : 'Create Item'}
            </button>
            <button type="button" onClick={() => navigate('/admin')}
              className="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-white/5 text-white/60 rounded-xl text-sm font-inter hover:bg-white/10 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
