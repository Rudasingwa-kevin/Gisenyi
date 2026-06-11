import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Plus, Pencil, Trash2, LogOut, MapPin, LayoutGrid } from 'lucide-react';

const API = 'http://localhost:3000/api/admin';

function fetchWithAuth(url, token, opts = {}) {
  return fetch(url, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...opts.headers
    }
  });
}

export default function AdminPage() {
  const { token, username, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('places');
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isAdmin) navigate('/');
  }, [isAdmin, navigate]);

  const loadPlaces = useCallback(async () => {
    const res = await fetchWithAuth(`${API}/places`, token);
    if (res.ok) setPlaces(await res.json());
  }, [token]);

  const loadCategories = useCallback(async () => {
    const res = await fetchWithAuth(`${API}/categories`, token);
    if (res.ok) setCategories(await res.json());
  }, [token]);

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    Promise.all([loadPlaces(), loadCategories()]).then(() => setLoading(false));
  }, [isAdmin, loadPlaces, loadCategories]);

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const res = await fetchWithAuth(`${API}/${type}/${id}`, token, { method: 'DELETE' });
    if (res.ok) {
      if (type === 'places') setPlaces(p => p.filter(x => x.id !== id));
      else setCategories(c => c.filter(x => x.id !== id));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAdmin) return null;

  const formDefaults = {
    name: '', lat: '', lon: '', catKey: '', description: '', image: '', rating: 4.5, tags: '[]'
  };

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="sticky top-0 z-40 bg-navy-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-gold-500" />
            <span className="text-white font-sora font-bold">Admin Panel</span>
            <span className="text-white/30 text-sm font-inter">({username})</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/50 hover:text-red-400 transition-colors text-sm font-inter"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setTab('places')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-inter font-semibold transition-all ${
              tab === 'places' ? 'bg-gold-500 text-navy-950' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <MapPin className="w-4 h-4" /> Places
          </button>
          <button
            onClick={() => setTab('categories')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-inter font-semibold transition-all ${
              tab === 'categories' ? 'bg-gold-500 text-navy-950' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Categories
          </button>
        </div>

        {tab === 'places' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-sora font-bold text-white">Manage Places ({places.length})</h2>
              <button
                onClick={() => { setEditing(null); setShowForm(!showForm); }}
                className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-navy-950 rounded-xl text-sm font-sora font-bold hover:bg-gold-600 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Place
              </button>
            </div>

            {showForm && (
              <PlaceForm
                place={editing}
                categories={categories}
                token={token}
                onSave={(p) => {
                  if (editing) setPlaces(pl => pl.map(x => x.id === p.id ? p : x));
                  else setPlaces(pl => [...pl, p]);
                  setShowForm(false);
                  setEditing(null);
                }}
                onCancel={() => { setShowForm(false); setEditing(null); }}
              />
            )}

            {loading ? (
              <div className="text-white/40 text-center py-20 font-inter">Loading...</div>
            ) : (
              <div className="grid gap-3">
                {places.map(place => (
                  <div key={place.id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-inter font-semibold">{place.name}</h3>
                      <p className="text-white/30 text-sm font-inter">{place.catKey} &middot; {place.lat?.toFixed(4)}, {place.lon?.toFixed(4)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          setEditing(place);
                          setShowForm(true);
                        }}
                        className="p-2 text-white/40 hover:text-gold-500 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete('places', place.id)}
                        className="p-2 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-sora font-bold text-white">Manage Categories ({categories.length})</h2>
              <button
                onClick={() => { setEditing(null); setShowForm(!showForm); }}
                className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-navy-950 rounded-xl text-sm font-sora font-bold hover:bg-gold-600 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>

            {showForm && (
              <CategoryForm
                category={editing}
                token={token}
                onSave={(c) => {
                  if (editing) setCategories(cat => cat.map(x => x.id === c.id ? c : x));
                  else setCategories(cat => [...cat, c]);
                  setShowForm(false);
                  setEditing(null);
                }}
                onCancel={() => { setShowForm(false); setEditing(null); }}
              />
            )}

            {loading ? (
              <div className="text-white/40 text-center py-20 font-inter">Loading...</div>
            ) : (
              <div className="grid gap-3">
                {categories.map(cat => (
                  <div key={cat.id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cat.icon}</span>
                      <div>
                        <h3 className="text-white font-inter font-semibold">{cat.label}</h3>
                        <p className="text-white/30 text-sm font-inter">ID: {cat.id} &middot; Color: {cat.color}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditing(cat); setShowForm(true); }}
                        className="p-2 text-white/40 hover:text-gold-500 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete('categories', cat.id)}
                        className="p-2 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PlaceForm({ place, categories, token, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: place?.name || '',
    lat: place?.lat || '',
    lon: place?.lon || '',
    catKey: place?.catKey || (categories[0]?.id || ''),
    description: place?.description || '',
    image: place?.image || '',
    rating: place?.rating || 4.5,
    tags: place?.tags ? JSON.stringify(place.tags) : '[]'
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const body = { ...form, lat: parseFloat(form.lat), lon: parseFloat(form.lon), rating: parseFloat(form.rating), tags: JSON.parse(form.tags || '[]') };
    const url = place ? `${API}/places/${place.id}` : `${API}/places`;
    const method = place ? 'PUT' : 'POST';
    const res = await fetchWithAuth(url, token, { method, body: JSON.stringify(body) });
    if (res.ok) onSave(await res.json());
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/5 rounded-xl p-6 mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Name</label>
          <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" required />
        </div>
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Category</label>
          <select value={form.catKey} onChange={e => setForm(f => ({ ...f, catKey: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50">
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
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Image URL</label>
          <input type="url" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" />
        </div>
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Rating</label>
          <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="px-5 py-2 bg-gold-500 text-navy-950 rounded-xl text-sm font-sora font-bold hover:bg-gold-600 transition-all disabled:opacity-50">
          {saving ? 'Saving...' : place ? 'Update Place' : 'Create Place'}
        </button>
        <button type="button" onClick={onCancel}
          className="px-5 py-2 bg-white/5 text-white/60 rounded-xl text-sm font-inter hover:bg-white/10 transition-all">
          Cancel
        </button>
      </div>
    </form>
  );
}

function CategoryForm({ category, token, onSave, onCancel }) {
  const [form, setForm] = useState({
    id: category?.id || '',
    label: category?.label || '',
    icon: category?.icon || '',
    color: category?.color || '#C9A84C'
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const url = category ? `${API}/categories/${category.id}` : `${API}/categories`;
    const method = category ? 'PUT' : 'POST';
    const res = await fetchWithAuth(url, token, { method, body: JSON.stringify(form) });
    if (res.ok) onSave(await res.json());
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/5 rounded-xl p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">ID (key)</label>
          <input type="text" value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50"
            disabled={!!category} required />
        </div>
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Label</label>
          <input type="text" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" required />
        </div>
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Icon (emoji)</label>
          <input type="text" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" required />
        </div>
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Color (hex)</label>
          <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
            className="w-full h-10 bg-white/5 border border-white/10 rounded-lg cursor-pointer" />
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={saving}
          className="px-5 py-2 bg-gold-500 text-navy-950 rounded-xl text-sm font-sora font-bold hover:bg-gold-600 transition-all disabled:opacity-50">
          {saving ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
        </button>
        <button type="button" onClick={onCancel}
          className="px-5 py-2 bg-white/5 text-white/60 rounded-xl text-sm font-inter hover:bg-white/10 transition-all">
          Cancel
        </button>
      </div>
    </form>
  );
}
