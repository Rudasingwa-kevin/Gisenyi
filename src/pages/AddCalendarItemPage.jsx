import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, CalendarDays, Loader2 } from 'lucide-react';
import { API, fetchWithAuth } from '../utils/admin';
import { FormField, Input, Select, Textarea, FormActions, useFormValidation } from '../components/admin/FormComponents';
import { ToastProvider, useToast } from '../components/admin/Toast';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';

function AddCalendarItemInner() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { addToast } = useToast();
  const [loading, setLoading] = useState(isEdit);
  const [initialForm, setInitialForm] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '', type: 'note', color: '#4A90D9', location: '' });
  const [saving, setSaving] = useState(false);

  const { errors, validate, clearField } = useFormValidation({
    title: [{ required: true, message: 'Title is required' }],
    date: [{ required: true, message: 'Date is required' }],
  });

  useEffect(() => { if (!isAdmin) navigate('/'); }, [isAdmin, navigate]);

  useEffect(() => {
    if (!isEdit) return;
    fetchWithAuth(`${API}/calendar/${id}`).then(r => r.ok && r.json()).then(data => {
      const item = data.data || data;
      setForm({
        title: item.title || '', description: item.description || '', date: item.date || '',
        time: item.time || '', type: item.type || 'note', color: item.color || '#4A90D9', location: item.location || ''
      });
      setInitialForm({
        title: item.title || '', description: item.description || '', date: item.date || '',
        time: item.time || '', type: item.type || 'note', color: item.color || '#4A90D9', location: item.location || ''
      });
      setLoading(false);
    }).catch(() => { setLoading(false); addToast('Failed to load calendar item', 'error'); });
  }, [id, isEdit]);

  const isDirty = initialForm && JSON.stringify(form) !== JSON.stringify(initialForm);
  useUnsavedChanges(isDirty);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(form)) return;
    setSaving(true);
    const res = await fetchWithAuth(
      isEdit ? `${API}/calendar/${id}` : `${API}/calendar`,
      { method: isEdit ? 'PUT' : 'POST', body: JSON.stringify(form) }
    );
    if (res.ok) {
      addToast(isEdit ? 'Calendar item updated' : 'Calendar item created', 'success');
      setTimeout(() => navigate('/admin/calendar'), 800);
    } else addToast(isEdit ? 'Failed to update item' : 'Failed to create item', 'error');
    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <Loader2 className="w-6 h-6 text-gold-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-3xl">
      <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} onClick={() => navigate('/admin/calendar')} className="flex items-center gap-2 text-white/40 hover:text-gold-500 transition-colors text-sm font-inter mb-6 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Calendar
      </motion.button>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-500/5 flex items-center justify-center border border-gold-500/10">
            <CalendarDays className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h1 className="text-xl font-sora font-bold text-white">{isEdit ? 'Edit Calendar Item' : 'Add Calendar Item'}</h1>
            <p className="text-xs text-white/30 font-inter">{isEdit ? 'Update calendar entry' : 'Create a new calendar entry'}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="glass rounded-2xl border border-white/[0.06] p-5 md:p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Title" error={errors.title} required>
              <Input type="text" value={form.title} onChange={e => { setForm(f => ({ ...f, title: e.target.value })); clearField('title'); }} />
            </FormField>
            <FormField label="Type">
              <Select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} options={[{ value: 'event', label: 'Event' }, { value: 'note', label: 'Note' }, { value: 'reminder', label: 'Reminder' }, { value: 'holiday', label: 'Holiday' }]} />
            </FormField>
            <FormField label="Date" error={errors.date} required>
              <Input type="date" value={form.date} onChange={e => { setForm(f => ({ ...f, date: e.target.value })); clearField('date'); }} />
            </FormField>
            <FormField label="Time">
              <Input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
            </FormField>
            <FormField label="Description" className="md:col-span-2">
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </FormField>
            <FormField label="Location">
              <Input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            </FormField>
            <FormField label="Color">
              <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-xl cursor-pointer" />
            </FormField>
          </div>
          <FormActions saving={saving} saveLabel={isEdit ? 'Update Item' : 'Create Item'} onCancel={() => navigate('/admin/calendar')} />
        </form>
      </motion.div>
    </div>
  );
}

export default function AddCalendarItemPage() {
  return <ToastProvider><AddCalendarItemInner /></ToastProvider>;
}
