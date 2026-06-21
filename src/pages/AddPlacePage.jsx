import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, MapPin, Loader2 } from 'lucide-react';
import { API_BASE } from '../utils/api';
import { API, fetchWithAuth } from '../utils/admin';
import { FormField, Input, Select, Textarea, ImageUpload, GalleryUpload, FormActions, useFormValidation } from '../components/admin/FormComponents';
import { ToastProvider, useToast } from '../components/admin/Toast';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';

function AddPlaceInner() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { addToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [initialForm, setInitialForm] = useState(null);
  const [form, setForm] = useState({
    name: '', lat: '', lon: '', catKey: '', description: '', image: '', gallery: '[]', rating: 4.5, tags: '[]'
  });
  const [saving, setSaving] = useState(false);

  const { errors, validate, clearField } = useFormValidation({
    name: [{ required: true, message: 'Place name is required' }],
    catKey: [{ required: true, message: 'Select a category' }],
    lat: [{ required: true, message: 'Latitude is required' }],
    lon: [{ required: true, message: 'Longitude is required' }],
  });

  useEffect(() => { if (!isAdmin) navigate('/'); }, [isAdmin, navigate]);

  useEffect(() => {
    fetch(`${API_BASE}/api/categories`).then(r => r.ok && r.json()).then(d => {
      const list = d.data || d || [];
      setCategories(list);
      if (!isEdit && list.length) setForm(f => ({ ...f, catKey: list[0].id }));
    }).catch(() => {});
  }, [isEdit]);

  useEffect(() => {
    if (!isEdit) return;
    fetchWithAuth(`${API}/places/${id}`).then(r => r.ok && r.json()).then(data => {
      const item = data.data || data;
      setForm({
        name: item.name || '', lat: String(item.lat ?? ''), lon: String(item.lon ?? ''),
        catKey: item.catKey || '', description: item.description || '', image: item.image || '',
        gallery: JSON.stringify(item.gallery || []), rating: String(item.rating ?? 4.5),
        tags: JSON.stringify(item.tags || [])
      });
      setInitialForm({
        name: item.name || '', lat: String(item.lat ?? ''), lon: String(item.lon ?? ''),
        catKey: item.catKey || '', description: item.description || '', image: item.image || '',
        gallery: JSON.stringify(item.gallery || []), rating: String(item.rating ?? 4.5),
        tags: JSON.stringify(item.tags || [])
      });
      setLoading(false);
    }).catch(() => { setLoading(false); addToast('Failed to load place', 'error'); });
  }, [id, isEdit]);

  const isDirty = initialForm && JSON.stringify(form) !== JSON.stringify(initialForm);
  useUnsavedChanges(isDirty);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(form)) return;
    setSaving(true);
    const body = {
      ...form,
      lat: parseFloat(form.lat), lon: parseFloat(form.lon), rating: parseFloat(form.rating),
      gallery: JSON.parse(form.gallery || '[]'), tags: JSON.parse(form.tags || '[]')
    };
    const res = await fetchWithAuth(
      isEdit ? `${API}/places/${id}` : `${API}/places`,
      { method: isEdit ? 'PUT' : 'POST', body: JSON.stringify(body) }
    );
    if (res.ok) {
      addToast(isEdit ? 'Place updated' : 'Place created', 'success');
      setTimeout(() => navigate('/admin/places'), 800);
    } else addToast(isEdit ? 'Failed to update place' : 'Failed to create place', 'error');
    setSaving(false);
  };

  const updateGalleryUrl = (i, v) => {
    const arr = JSON.parse(form.gallery || '[]');
    arr[i] = v;
    setForm(f => ({ ...f, gallery: JSON.stringify(arr) }));
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <Loader2 className="w-6 h-6 text-gold-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-3xl">
      <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} onClick={() => navigate('/admin/places')} className="flex items-center gap-2 text-white/40 hover:text-gold-500 transition-colors text-sm font-inter mb-6 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Places
      </motion.button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-500/5 flex items-center justify-center border border-gold-500/10">
            <MapPin className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h1 className="text-xl font-sora font-bold text-white">{isEdit ? 'Edit Place' : 'Add New Place'}</h1>
            <p className="text-xs text-white/30 font-inter">{isEdit ? 'Update place details' : 'Create a new place entry'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl border border-white/[0.06] p-5 md:p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Name" error={errors.name} required>
              <Input type="text" value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); clearField('name'); }} />
            </FormField>
            <FormField label="Category" error={errors.catKey} required>
              <Select value={form.catKey} onChange={e => { setForm(f => ({ ...f, catKey: e.target.value })); clearField('catKey'); }} options={categories.map(c => ({ value: c.id, label: c.label }))} />
            </FormField>
            <FormField label="Latitude" error={errors.lat} required>
              <Input type="number" step="any" value={form.lat} onChange={e => { setForm(f => ({ ...f, lat: e.target.value })); clearField('lat'); }} />
            </FormField>
            <FormField label="Longitude" error={errors.lon} required>
              <Input type="number" step="any" value={form.lon} onChange={e => { setForm(f => ({ ...f, lon: e.target.value })); clearField('lon'); }} />
            </FormField>
            <FormField label="Description" className="md:col-span-2">
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
            </FormField>
            <ImageUpload value={form.image} onChange={v => setForm(f => ({ ...f, image: v }))} label="Hero Image" preview />
            <FormField label="Rating">
              <Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} />
            </FormField>
          </div>
          <FormField label="Gallery Images (up to 4)">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[0, 1, 2, 3].map(i => {
                const val = JSON.parse(form.gallery || '[]')[i] || '';
                return (
                  <div key={i}>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-poppins font-bold text-white/25 uppercase tracking-wider w-6 shrink-0">#{i + 1}</span>
                      <Input type="url" value={val} onChange={e => updateGalleryUrl(i, e.target.value)} placeholder="https://example.com/photo.jpg" className="flex-1" />
                      <GalleryUpload onUrl={url => updateGalleryUrl(i, url)} />
                    </div>
                    {val && <img src={val} alt="" className="mt-2 h-20 w-full rounded-xl object-cover bg-navy-800 border border-white/[0.04]" onError={e => { e.target.style.display = 'none'; }} />}
                  </div>
                );
              })}
            </div>
          </FormField>
          <FormActions saving={saving} saveLabel={isEdit ? 'Update Place' : 'Create Place'} onCancel={() => navigate('/admin/places')} />
        </form>
      </motion.div>
    </div>
  );
}

export default function AddPlacePage() {
  return <ToastProvider><AddPlaceInner /></ToastProvider>;
}
