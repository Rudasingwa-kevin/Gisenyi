import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, LayoutGrid } from 'lucide-react';
import { API, fetchWithAuth } from '../utils/admin';
import AdminHeader from '../components/admin/AdminHeader';
import { FormField, Input, FormActions } from '../components/admin/FormComponents';
import { ToastProvider, useToast } from '../components/admin/Toast';

function AddCategoryInner() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState({ id: '', label: '', icon: '', color: '#C9A84C' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) navigate('/');
  }, [isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetchWithAuth(`${API}/categories`, { method: 'POST', body: JSON.stringify(form) });
    if (res.ok) {
      addToast('Category created successfully', 'success');
      setTimeout(() => navigate('/admin'), 800);
    } else {
      addToast('Failed to create category', 'error');
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#030810]">
      <AdminHeader />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-white/40 hover:text-gold-500 transition-colors text-sm font-inter mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Admin
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-500/5 flex items-center justify-center border border-gold-500/10">
              <LayoutGrid className="w-5 h-5 text-gold-500" />
            </div>
            <div>
              <h1 className="text-xl font-sora font-bold text-white">Add New Category</h1>
              <p className="text-xs text-white/30 font-inter">Create a new place category</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-2xl border border-white/[0.06] p-5 md:p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="ID (key)">
                <Input type="text" value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} required />
              </FormField>
              <FormField label="Label">
                <Input type="text" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} required />
              </FormField>
              <FormField label="Icon (emoji)">
                <Input type="text" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} required />
              </FormField>
              <FormField label="Color">
                <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-xl cursor-pointer" />
              </FormField>
            </div>
            <FormActions saving={saving} saveLabel="Create Category" onCancel={() => navigate('/admin')} />
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default function AddCategoryPage() {
  return (
    <ToastProvider>
      <AddCategoryInner />
    </ToastProvider>
  );
}
