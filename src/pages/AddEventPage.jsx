import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { API, fetchWithAuth, uploadFile } from '../utils/admin';

function ImageUpload({ value, onChange, label, preview, token }) {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadFile(file, token);
      onChange(url);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
    setUploading(false);
  };
  return (
    <div className="md:col-span-2">
      <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">{label}</label>
      <div className="flex gap-2">
        <input type="url" value={value} onChange={e => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" />
        <label className={`shrink-0 px-4 py-2 rounded-lg text-sm font-inter font-semibold cursor-pointer transition-all ${uploading ? 'bg-white/10 text-white/40' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
          {uploading ? 'Uploading...' : 'Upload'}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
        </label>
      </div>
      {preview && value && (
        <img src={value} alt="" className="mt-2 h-24 rounded-lg object-cover bg-navy-800" onError={e => { e.target.style.display = 'none' }} />
      )}
    </div>
  );
}

export default function AddEventPage() {
  const { token, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', date: '', time: '', location: '', category: 'concert', price: '', image: '', ticketLink: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) navigate('/');
  }, [isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetchWithAuth(`${API}/events`, token, { method: 'POST', body: JSON.stringify(form) });
    if (res.ok) navigate('/admin');
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-white/50 hover:text-gold-500 transition-colors text-sm font-inter mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Admin
        </button>
        <h1 className="text-2xl font-sora font-bold text-white mb-6">Add New Event</h1>
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/5 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Title</label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" required />
            </div>
            <div>
              <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50">
                <option value="concert">Concert</option>
                <option value="movie">Movie Night</option>
                <option value="comedy">Comedy</option>
                <option value="arts">Arts</option>
                <option value="cultural">Cultural</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Date</label>
              <input type="text" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                placeholder="e.g. June 20, 2026"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" required />
            </div>
            <div>
              <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Time</label>
              <input type="text" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                placeholder="e.g. 7:00 PM"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" />
            </div>
            <div>
              <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Location</label>
              <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" required />
            </div>
            <div>
              <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Price</label>
              <input type="text" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="e.g. 15,000 RWF or Free"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50 resize-none" />
            </div>
            <ImageUpload value={form.image} onChange={v => setForm(f => ({ ...f, image: v }))} label="Flyer / Banner Image" preview token={token} />
            <div>
              <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Ticket Link (URL)</label>
              <input type="url" value={form.ticketLink} onChange={e => setForm(f => ({ ...f, ticketLink: e.target.value }))}
                placeholder="https://example.com/buy-tickets"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={saving}
              className="px-5 py-2 bg-gold-500 text-navy-950 rounded-xl text-sm font-sora font-bold hover:bg-gold-600 transition-all disabled:opacity-50">
              {saving ? 'Saving...' : 'Create Event'}
            </button>
            <button type="button" onClick={() => navigate('/admin')}
              className="px-5 py-2 bg-white/5 text-white/60 rounded-xl text-sm font-inter hover:bg-white/10 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
