import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../utils/helpers';
import { uploadFile } from '../../utils/admin';

export function FormField({ label, children, className, hint }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em]">
        {label}
      </label>
      {children}
      {hint && <p className="text-[10px] text-white/25 font-inter">{hint}</p>}
    </div>
  );
}

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5',
        'text-white text-sm font-inter',
        'focus:outline-none focus:border-gold-500/40 focus:bg-white/[0.06]',
        'placeholder:text-white/20 transition-all duration-200',
        className
      )}
      {...props}
    />
  );
}

export function Select({ options, className, ...props }) {
  return (
    <select
      className={cn(
        'w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5',
        'text-white text-sm font-inter',
        'focus:outline-none focus:border-gold-500/40 focus:bg-white/[0.06]',
        'transition-all duration-200 appearance-none',
        'bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%2712%27%20height%3D%2712%27%20viewBox%3D%270%200%2012%2012%27%20fill%3D%27none%27%3E%3Cpath%20d%3D%27M3%205L6%208L9%205%27%20stroke%3D%27rgba(255%2C255%2C255%2C0.3)%27%20stroke-width%3D%271.5%27%20stroke-linecap%3D%27round%27/%3E%3C/svg%3E")] bg-no-repeat bg-[right_12px_center]',
        className
      )}
      {...props}
    >
      {options.map(o => (
        <option key={o.value} value={o.value} className="bg-navy-900 text-white">
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5',
        'text-white text-sm font-inter resize-none',
        'focus:outline-none focus:border-gold-500/40 focus:bg-white/[0.06]',
        'placeholder:text-white/20 transition-all duration-200',
        className
      )}
      {...props}
    />
  );
}

export function ImageUpload({ value, onChange, label, preview }) {
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
    <div className="space-y-2">
      {label && (
        <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em]">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        <Input
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="flex-1"
        />
        <label className={cn(
          'shrink-0 px-4 py-2.5 rounded-xl text-sm font-inter font-semibold cursor-pointer transition-all flex items-center gap-2',
          uploading
            ? 'bg-white/[0.04] text-white/30 border border-white/[0.06]'
            : 'bg-white/[0.06] text-white/60 hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/[0.15]'
        )}>
          <Upload className={cn('w-4 h-4', uploading && 'animate-spin')} />
          {uploading ? '...' : 'Upload'}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
        </label>
      </div>
      {preview && value && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="relative group"
        >
          <img
            src={value}
            alt=""
            className="h-28 w-full rounded-xl object-cover bg-navy-800 border border-white/[0.06]"
            onError={e => { e.target.style.display = 'none' }}
          />
          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white/60 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </div>
  );
}

export function GalleryUpload({ onUrl }) {
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
    <label className={cn(
      'shrink-0 px-3 py-2.5 rounded-xl text-[10px] font-inter font-semibold cursor-pointer transition-all flex items-center gap-1.5',
      uploading
        ? 'bg-white/[0.03] text-white/20 border border-white/[0.04]'
        : 'bg-white/[0.06] text-white/50 hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/[0.15]'
    )}>
      {uploading ? (
        <div className="w-3 h-3 border border-white/20 border-t-gold-500 rounded-full animate-spin" />
      ) : (
        <ImageIcon className="w-3 h-3" />
      )}
      {uploading ? '...' : 'Upload'}
      <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
    </label>
  );
}

export function FormActions({ saving, saveLabel = 'Save', onCancel }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-2">
      <motion.button
        type="submit"
        disabled={saving}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-sora font-bold transition-all',
          'bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950',
          'hover:from-gold-400 hover:to-gold-300 hover:shadow-lg hover:shadow-gold-500/20',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none'
        )}
      >
        {saving ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
            Saving...
          </span>
        ) : saveLabel}
      </motion.button>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-6 py-2.5 bg-white/[0.04] text-white/50 rounded-xl text-sm font-inter hover:bg-white/[0.08] hover:text-white/70 transition-all border border-white/[0.06]"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
