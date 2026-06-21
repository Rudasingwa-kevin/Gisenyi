import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, LayoutGrid } from 'lucide-react';
import { useAdminData, useFilteredItems, PAGE_SIZE } from '../../components/admin/useAdminData';
import { ListControls, Pagination } from '../../components/admin/ListComponents';
import { AnimatedList, AnimatedListItem } from '../../components/admin/AnimatedList';
import { SkeletonList } from '../../components/admin/SkeletonLoader';
import EmptyState from '../../components/admin/EmptyState';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import { ToastProvider, useToast } from '../../components/admin/Toast';

function CategoriesContent() {
  const { addToast } = useToast();
  const { items: categories, loading, remove } = useAdminData('categories');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('label');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useFilteredItems(categories, {
    searchFields: ['label', 'id'],
    sortFn: (s) => (a, b) => s === 'id'
      ? (a.id || '').localeCompare(b.id || '')
      : (a.label || '').localeCompare(b.label || ''),
    search, sort, page,
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await remove(deleteTarget.id);
    addToast(ok ? 'Category deleted' : 'Failed to delete', ok ? 'success' : 'error');
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-sora font-bold text-white">Categories</h1>
          <p className="text-xs text-white/30 font-inter mt-0.5">{categories.length} categories</p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link to="/admin/categories/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 rounded-xl text-sm font-sora font-bold hover:from-gold-400 hover:to-gold-300 hover:shadow-lg hover:shadow-gold-500/20 transition-all">
            <Plus className="w-4 h-4" /> Add Category
          </Link>
        </motion.div>
      </div>

      <ListControls search={search} onSearch={v => { setSearch(v); setPage(1); }} sort={sort} onSort={v => { setSort(v); setPage(1); }} sortOptions={[{ value: 'label', label: 'Label' }, { value: 'id', label: 'ID' }]} placeholder="Search categories..." />

      {loading ? <SkeletonList /> : filtered.items.length === 0 ? (
        <EmptyState icon={LayoutGrid} title="No categories found" />
      ) : (
        <>
          <AnimatedList className="space-y-2">
            {filtered.items.map(cat => (
              <AnimatedListItem key={cat.id}>
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between hover:bg-white/[0.05] hover:border-white/[0.08] transition-all group">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-2xl shrink-0">{cat.icon}</span>
                    <div className="min-w-0">
                      <h3 className="text-white font-inter font-semibold text-sm group-hover:text-gold-400 transition-colors">{cat.label}</h3>
                      <p className="text-white/25 text-xs font-inter">ID: {cat.id} &middot; <span className="inline-block w-2 h-2 rounded-full mr-1 align-middle" style={{ backgroundColor: cat.color }} />{cat.color}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setDeleteTarget(cat)} className="p-2 text-white/40 hover:text-red-400 rounded-lg hover:bg-white/[0.04] transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </AnimatedListItem>
            ))}
          </AnimatedList>
          <Pagination page={filtered.page} totalPages={filtered.totalPages} onPage={setPage} totalItems={filtered.total} itemsPerPage={PAGE_SIZE} />
        </>
      )}

      <DeleteConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title={deleteTarget?.label} />
    </div>
  );
}

export default function CategoriesPage() {
  return <ToastProvider><CategoriesContent /></ToastProvider>;
}
