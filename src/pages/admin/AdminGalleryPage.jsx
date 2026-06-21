import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ExternalLink, Image as ImageIcon, Video } from 'lucide-react';
import { useAdminData, useFilteredItems, PAGE_SIZE } from '../../components/admin/useAdminData';
import { ListControls, Pagination } from '../../components/admin/ListComponents';
import { AnimatedList, AnimatedListItem } from '../../components/admin/AnimatedList';
import { SkeletonList } from '../../components/admin/SkeletonLoader';
import EmptyState from '../../components/admin/EmptyState';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import { ToastProvider, useToast } from '../../components/admin/Toast';

function GalleryContent() {
  const { addToast } = useToast();
  const { items: galleryItems, loading, remove } = useAdminData('gallery');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('date');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const filtered = useFilteredItems(galleryItems, {
    searchFields: ['title', 'type'],
    sortFn: (s) => (a, b) => s === 'title'
      ? (a.title || '').localeCompare(b.title || '')
      : new Date(b.createdAt) - new Date(a.createdAt),
    search, sort, page,
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await remove(deleteTarget.id);
    addToast(ok ? 'Gallery item deleted' : 'Failed to delete', ok ? 'success' : 'error');
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-sora font-bold text-white">Gallery</h1>
          <p className="text-xs text-white/30 font-inter mt-0.5">{galleryItems.length} items</p>
        </div>
      </div>

      <ListControls search={search} onSearch={v => { setSearch(v); setPage(1); }} sort={sort} onSort={v => { setSort(v); setPage(1); }} sortOptions={[{ value: 'date', label: 'Date' }, { value: 'title', label: 'Title' }]} placeholder="Search gallery..." />

      {loading ? <SkeletonList /> : filtered.items.length === 0 ? (
        <EmptyState icon={ImageIcon} title="No gallery items" />
      ) : (
        <>
          <AnimatedList className="space-y-2">
            {filtered.items.map(item => (
              <AnimatedListItem key={item.id}>
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between hover:bg-white/[0.05] hover:border-white/[0.08] transition-all group">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-navy-800 border border-white/[0.06] shrink-0 flex items-center justify-center">
                      {item.type === 'video' ? <Video className="w-5 h-5 text-gold-500" /> : <img src={item.url} alt={item.title || ''} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white font-inter font-semibold text-sm group-hover:text-gold-400 transition-colors truncate">{item.title || 'Untitled'}</h3>
                      <p className="text-white/25 text-xs font-inter capitalize">{item.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 text-white/40 hover:text-gold-500 rounded-lg hover:bg-white/[0.04] transition-colors"><ExternalLink className="w-4 h-4" /></a>
                    <button onClick={() => setDeleteTarget(item)} className="p-2 text-white/40 hover:text-red-400 rounded-lg hover:bg-white/[0.04] transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </AnimatedListItem>
            ))}
          </AnimatedList>
          <Pagination page={filtered.page} totalPages={filtered.totalPages} onPage={setPage} totalItems={filtered.total} itemsPerPage={PAGE_SIZE} />
        </>
      )}

      <DeleteConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title={deleteTarget?.title || 'this item'} />
    </div>
  );
}

export default function AdminGalleryPage() {
  return <ToastProvider><GalleryContent /></ToastProvider>;
}
