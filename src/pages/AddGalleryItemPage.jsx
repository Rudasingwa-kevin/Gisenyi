import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Image as ImageIcon, Loader2 } from 'lucide-react';
import { API, fetchWithAuth } from '../utils/admin';
import { FormField, Input, Select, FormActions, useFormValidation } from '../components/admin/FormComponents';
import { ToastProvider, useToast } from '../components/admin/Toast';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';

function AddGalleryItemInner() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { addToast } = useToast();
  const [loading, setLoading] = useState(isEdit);
  const [initialForm, setInitialForm] = useState(null);
  const [form, setForm] = useState({ url: '', caption: '', type: 'image' });
  const [saving, setSaving] = useState(false);

  const { errors, validate, clearField } = useFormValidation({
    url: [{ required: true, message: 'URL is required' }],
  });

  useEffect(() => { if (!isAdmin) navigate('/'); }, [isAdmin, navigate]);

  useEffect(() => {
    if (!isEdit) return;
    fetchWithAuth(`${API}/gallery/${id}`).then(r => r.ok && r.json()).then(data => {
      const item = data.data || data;
      setForm({ url: item.url || '', caption: item.caption || '', type: item.type || 'image' });
      setInitialForm({ url: item.url || '', caption: item.caption || '', type: item.type || 'image' });
      setLoading(false);
    }).catch(() => { setLoading(false); addToast('Failed to load item', 'error'); });
  }, [id, isEdit]);

  const isDirty = initialForm && JSON.stringify(form) !== JSON.stringify(initialForm);
  useUnsavedChanges(isDirty);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(form)) return;
    setSaving(true);
    const res = await fetchWithAuth(
      isEdit ? `${API}/gallery/${id}` : `${API}/gallery`,
      { method: isEdit ? 'PUT' : 'POST', body: JSON.stringify(form) }
    );
    if (res.ok) {
      addToast(isEdit ? 'Gallery item updated' : 'Gallery item added', 'success');
      setTimeout(() => navigate('/admin/gallery'), 800);
    } else addToast(isEdit ? 'Failed to update' : 'Failed to add item', 'error');
    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <Loader2 className="w-6 h-6 text-gold-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-3xl">
      <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} onClick={() => navigate('/admin/gallery')} className="flex items-center gap-2 text-white/40 hover:text-gold-500 transition-colors text-sm font-inter mb-6 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Gallery
      </motion.button>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-500/5 flex items-center justify-center border border-gold-500/10">
            <ImageIcon className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h1 className="text-xl font-sora font-bold text-white">{isEdit ? 'Edit Gallery Item' : 'Add Gallery Item'}</h1>
            <p className="text-xs text-white/30 font-inter">{isEdit ? 'Update media details' : 'Add an image or video to the gallery'}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="glass rounded-2xl border border-white/[0.06] p-5 md:p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Type">
              <Select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} options={[{ value: 'image', label: 'Image' }, { value: 'video', label: 'Video' }]} />
            </FormField>
            <FormField label="Caption">
              <Input type="text" value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} placeholder="Optional caption" />
            </FormField>
          </div>
          <FormField label="Media URL" error={errors.url} required>
            <Input type="url" value={form.url} onChange={e => { setForm(f => ({ ...f, url: e.target.value })); clearField('url'); }} placeholder="https://example.com/image.jpg" />
          </FormField>
          {form.url && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              {form.type === 'video' ? (
                <div className="aspect-video rounded-xl overflow-hidden bg-navy-800 border border-white/[0.06]">
                  <iframe src={form.url} className="w-full h-full" allowFullScreen title="Preview" />
                </div>
              ) : (
                <img src={form.url} alt="Gallery item preview" className="h-48 w-full rounded-xl object-cover bg-navy-800 border border-white/[0.06]" onError={e => { e.target.style.display = 'none'; }} />
              )}
            </motion.div>
          )}
          <FormActions saving={saving} saveLabel={isEdit ? 'Update Item' : 'Add Item'} onCancel={() => navigate('/admin/gallery')} />
        </form>
      </motion.div>
    </div>
  );
}

export default function AddGalleryItemPage() {
  return <ToastProvider><AddGalleryItemInner /></ToastProvider>;
}
