import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, ExternalLink, Image as ImageIcon, Video, Download, Filter } from 'lucide-react';
import { useAdminData, useFilteredItems, PAGE_SIZE } from '../../components/admin/useAdminData';
import { ListControls, Pagination } from '../../components/admin/ListComponents';
import { AnimatedList, AnimatedListItem } from '../../components/admin/AnimatedList';
import { SkeletonList } from '../../components/admin/SkeletonLoader';
import EmptyState from '../../components/admin/EmptyState';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import { ToastProvider, useToast } from '../../components/admin/Toast';
import { exportToCSV } from '../../utils/export';

function GalleryContent() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { items: galleryItems, loading, remove } = useAdminData('gallery');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('date');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [catFilter, setCatFilter] = useState('all');

  const categories = [...new Set(galleryItems.map(i => i.category).filter(Boolean))];

  const preFiltered = galleryItems.filter(e => catFilter === 'all' || e.category === catFilter);

  const filtered = useFilteredItems(preFiltered, {
    searchFields: ['title', 'type', 'category'],
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
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link to="/admin/gallery/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 rounded-xl text-sm font-sora font-bold hover:from-gold-400 hover:to-gold-300 hover:shadow-lg hover:shadow-gold-500/20 transition-all">
              <Plus className="w-4 h-4" /> Add Item
            </Link>
          </motion.div>
          {galleryItems.length > 0 && (
            <button onClick={() => exportToCSV(galleryItems, [
            { label: 'ID', accessor: 'id' },
            { label: 'Caption', accessor: 'title' },
            { label: 'Type', accessor: 'type' },
            { label: 'Category', accessor: 'category' },
            { label: 'URL', accessor: 'url' },
          ], 'gallery.csv')} className="inline-flex items-center gap-1.5 px-3 py-2 text-white/40 hover:text-white/70 text-sm font-inter rounded-xl hover:bg-white/[0.04] border border-white/[0.06] transition-all">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        )}
        </div>
      </div>

      <ListControls search={search} onSearch={v => { setSearch(v); setPage(1); }} sort={sort} onSort={v => { setSort(v); setPage(1); }} sortOptions={[{ value: 'date', label: 'Date' }, { value: 'title', label: 'Caption' }]} placeholder="Search gallery..." />

      {categories.length > 1 && (
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-white/25" />
          <button onClick={() => { setCatFilter('all'); setPage(1); }} className={`px-2.5 py-1 rounded-lg text-[11px] font-inter transition-all ${catFilter === 'all' ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20' : 'text-white/35 hover:text-white/60 border border-white/[0.04] hover:border-white/[0.08]'}`}>All</button>
          {categories.map(cat => (
            <button key={cat} onClick={() => { setCatFilter(cat); setPage(1); }} className={`px-2.5 py-1 rounded-lg text-[11px] font-inter capitalize transition-all ${catFilter === cat ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20' : 'text-white/35 hover:text-white/60 border border-white/[0.04] hover:border-white/[0.08]'}`}>{cat}</button>
          ))}
        </div>
      )}

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
                      {item.type === 'video' ? <Video className="w-5 h-5 text-gold-500" /> : <img src={item.url} alt={item.title || ''} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white font-inter font-semibold text-sm group-hover:text-gold-400 transition-colors truncate">{item.title || 'No title'}</h3>
                      <p className="text-white/25 text-xs font-inter mt-0.5">
                        <span className="capitalize">{item.type}</span>
                        <span className="mx-1.5 text-white/15">&middot;</span>
                        <span className={`capitalize ${item.category === 'historical' ? 'text-amber-400/60' : 'text-emerald-400/60'}`}>{item.category || 'current'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 text-white/40 hover:text-gold-500 rounded-lg hover:bg-white/[0.04] transition-colors" title="Open"><ExternalLink className="w-4 h-4" /></a>
                    <button onClick={() => navigate(`/admin/gallery/${item.id}/edit`)} className="p-2 text-white/30 hover:text-gold-500 rounded-lg hover:bg-white/[0.04] transition-colors" title="Edit"><Pencil className="w-4 h-4" /></button>
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
