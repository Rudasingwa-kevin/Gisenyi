import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, LayoutGrid, Loader2 } from 'lucide-react';
import { API, fetchWithAuth } from '../utils/admin';
import { FormField, Input, FormActions, useFormValidation } from '../components/admin/FormComponents';
import { ToastProvider, useToast } from '../components/admin/Toast';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';

function AddCategoryInner() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { addToast } = useToast();
  const [loading, setLoading] = useState(isEdit);
  const [initialForm, setInitialForm] = useState(null);
  const [form, setForm] = useState({ id: '', label: '', icon: '', color: '#C9A84C' });
  const [saving, setSaving] = useState(false);

  const { errors, validate, clearField } = useFormValidation({
    id: [{ required: true, message: 'Category ID is required' }],
    label: [{ required: true, message: 'Label is required' }],
    icon: [{ required: true, message: 'Icon is required' }],
  });

  useEffect(() => { if (!isAdmin) navigate('/'); }, [isAdmin, navigate]);

  useEffect(() => {
    if (!isEdit) return;
    fetchWithAuth(`${API}/categories`).then(r => r.ok && r.json()).then(data => {
      const list = data.data || data || [];
      const item = list.find(c => c.id === id);
      if (item) {
        setForm({ id: item.id || '', label: item.label || '', icon: item.icon || '', color: item.color || '#C9A84C' });
        setInitialForm({ id: item.id || '', label: item.label || '', icon: item.icon || '', color: item.color || '#C9A84C' });
      } else addToast('Category not found', 'error');
      setLoading(false);
    }).catch(() => { setLoading(false); addToast('Failed to load category', 'error'); });
  }, [id, isEdit]);

  const isDirty = initialForm && JSON.stringify(form) !== JSON.stringify(initialForm);
  useUnsavedChanges(isDirty);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(form)) return;
    setSaving(true);
    const res = await fetchWithAuth(
      isEdit ? `${API}/categories/${id}` : `${API}/categories`,
      { method: isEdit ? 'PUT' : 'POST', body: JSON.stringify(form) }
    );
    if (res.ok) {
      addToast(isEdit ? 'Category updated' : 'Category created', 'success');
      setTimeout(() => navigate('/admin/categories'), 800);
    } else addToast(isEdit ? 'Failed to update category' : 'Failed to create category', 'error');
    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <Loader2 className="w-6 h-6 text-gold-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-3xl">
      <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} onClick={() => navigate('/admin/categories')} className="flex items-center gap-2 text-white/40 hover:text-gold-500 transition-colors text-sm font-inter mb-6 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Categories
      </motion.button>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-500/5 flex items-center justify-center border border-gold-500/10">
            <LayoutGrid className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h1 className="text-xl font-sora font-bold text-white">{isEdit ? 'Edit Category' : 'Add New Category'}</h1>
            <p className="text-xs text-white/30 font-inter">{isEdit ? 'Update category details' : 'Create a new place category'}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="glass rounded-2xl border border-white/[0.06] p-5 md:p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="ID (key)" error={errors.id} required>
              <Input type="text" value={form.id} onChange={e => { setForm(f => ({ ...f, id: e.target.value })); clearField('id'); }} disabled={isEdit} />
            </FormField>
            <FormField label="Label" error={errors.label} required>
              <Input type="text" value={form.label} onChange={e => { setForm(f => ({ ...f, label: e.target.value })); clearField('label'); }} />
            </FormField>
            <FormField label="Icon (emoji)" error={errors.icon} required>
              <Input type="text" value={form.icon} onChange={e => { setForm(f => ({ ...f, icon: e.target.value })); clearField('icon'); }} />
            </FormField>
            <FormField label="Color">
              <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-xl cursor-pointer" />
            </FormField>
          </div>
          <FormActions saving={saving} saveLabel={isEdit ? 'Update Category' : 'Create Category'} onCancel={() => navigate('/admin/categories')} />
        </form>
      </motion.div>
    </div>
  );
}

export default function AddCategoryPage() {
  return <ToastProvider><AddCategoryInner /></ToastProvider>;
}
