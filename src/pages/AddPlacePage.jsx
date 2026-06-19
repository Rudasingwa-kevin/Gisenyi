import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { API_BASE } from '../utils/api';
import { API, fetchWithAuth, uploadFile } from '../utils/admin';

function ImageUpload({ value, onChange, label, preview }) {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadFile(file);
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

function GalleryUpload({ onUrl }) {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadFile(file);
      onUrl(url);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
    setUploading(false);
  };
  return (
    <label className={`shrink-0 px-3 py-2 rounded-lg text-[10px] font-inter font-semibold cursor-pointer transition-all ${uploading ? 'bg-white/5 text-white/30' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>
      {uploading ? '...' : 'Upload'}
      <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
    </label>
  );
}

export default function AddPlacePage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '', lat: '', lon: '', catKey: '', description: '', image: '', gallery: '[]', rating: 4.5, tags: '[]'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) navigate('/');
  }, [isAdmin, navigate]);

  useEffect(() => {
    fetch(`${API_BASE}/api/categories`).then(r => r.ok && r.json()).then(d => {
      const list = d.data || d || [];
      setCategories(list);
      if (list.length) setForm(f => ({ ...f, catKey: list[0].id }));
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      ...form,
      lat: parseFloat(form.lat),
      lon: parseFloat(form.lon),
      rating: parseFloat(form.rating),
      gallery: JSON.parse(form.gallery || '[]'),
      tags: JSON.parse(form.tags || '[]')
    };
    const res = await fetchWithAuth(`${API}/places`, { method: 'POST', body: JSON.stringify(body) });
    if (res.ok) navigate('/admin');
    setSaving(false);
  };

  const updateGalleryUrl = (i, v) => {
    const arr = JSON.parse(form.gallery || '[]');
    arr[i] = v;
    setForm(f => ({ ...f, gallery: JSON.stringify(arr) }));
  };

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-white/50 hover:text-gold-500 transition-colors text-xs md:text-sm font-inter mb-4 md:mb-6">
          <ArrowLeft className="w-3.5 md:w-4 h-3.5 md:h-4" /> Back to Admin
        </button>
        <h1 className="text-xl md:text-2xl font-sora font-bold text-white mb-4 md:mb-6">Add New Place</h1>
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/5 rounded-xl p-4 md:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Name</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" required />
            </div>
            <div>
              <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Category</label>
              <select value={form.catKey} onChange={e => setForm(f => ({ ...f, catKey: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50">
                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Latitude</label>
              <input type="number" step="any" value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" required />
            </div>
            <div>
              <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Longitude</label>
              <input type="number" step="any" value={form.lon} onChange={e => setForm(f => ({ ...f, lon: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50 resize-none" />
            </div>
            <ImageUpload value={form.image} onChange={v => setForm(f => ({ ...f, image: v }))} label="Hero Image" preview />
            <div>
              <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Rating</label>
              <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-2">Gallery Images (up to 4)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[0, 1, 2, 3].map(i => {
                const val = JSON.parse(form.gallery || '[]')[i] || '';
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[9px] font-poppins font-bold text-white/30 uppercase tracking-wider w-6 shrink-0">#{i + 1}</span>
                    <input type="url" value={val} onChange={e => updateGalleryUrl(i, e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" />
                    <GalleryUpload onUrl={url => updateGalleryUrl(i, url)} />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-gold-500 text-navy-950 rounded-xl text-sm font-sora font-bold hover:bg-gold-600 transition-all disabled:opacity-50">
              {saving ? 'Saving...' : 'Create Place'}
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
