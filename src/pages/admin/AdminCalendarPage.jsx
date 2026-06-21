import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Trash2, Circle, Clock } from 'lucide-react';
import { useAdminData, useFilteredItems, PAGE_SIZE } from '../../components/admin/useAdminData';
import { formatDate } from '../../utils/helpers';
import { ListControls, Pagination } from '../../components/admin/ListComponents';
import { AnimatedList, AnimatedListItem } from '../../components/admin/AnimatedList';
import { SkeletonList } from '../../components/admin/SkeletonLoader';
import EmptyState from '../../components/admin/EmptyState';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import { ToastProvider, useToast } from '../../components/admin/Toast';

function CalendarContent() {
  const { addToast } = useToast();
  const { items: calendarItems, loading, remove } = useAdminData('calendar');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('date');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useFilteredItems(calendarItems, {
    searchFields: ['title', 'type', 'description'],
    sortFn: (s) => (a, b) => s === 'title'
      ? (a.title || '').localeCompare(b.title || '')
      : new Date(a.date) - new Date(b.date),
    search, sort, page,
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await remove(deleteTarget.id);
    addToast(ok ? 'Item deleted' : 'Failed to delete', ok ? 'success' : 'error');
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-sora font-bold text-white">Calendar</h1>
          <p className="text-xs text-white/30 font-inter mt-0.5">{calendarItems.length} items</p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link to="/admin/calendar/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 rounded-xl text-sm font-sora font-bold hover:from-gold-400 hover:to-gold-300 hover:shadow-lg hover:shadow-gold-500/20 transition-all">
            <Plus className="w-4 h-4" /> Add Item
          </Link>
        </motion.div>
      </div>

      <ListControls search={search} onSearch={v => { setSearch(v); setPage(1); }} sort={sort} onSort={v => { setSort(v); setPage(1); }} sortOptions={[{ value: 'date', label: 'Date' }, { value: 'title', label: 'Title' }]} placeholder="Search calendar..." />

      {loading ? <SkeletonList /> : filtered.items.length === 0 ? (
        <EmptyState icon={Circle} title="No calendar items" />
      ) : (
        <>
          <AnimatedList className="space-y-2">
            {filtered.items.map(item => (
              <AnimatedListItem key={item.id}>
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between hover:bg-white/[0.05] hover:border-white/[0.08] transition-all group">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}20` }}>
                      <Circle className="w-4 h-4" style={{ color: item.color }} fill={item.color} stroke="none" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white font-inter font-semibold text-sm group-hover:text-gold-400 transition-colors truncate">{item.title}</h3>
                      <p className="text-white/25 text-xs font-inter">
                        <Clock className="w-3 h-3 inline mr-1" />{formatDate(item.date)}{item.time ? ` ${item.time}` : ''} &middot; <span className="capitalize" style={{ color: item.color }}>{item.type}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => setDeleteTarget(item)} className="p-2 text-white/40 hover:text-red-400 rounded-lg hover:bg-white/[0.04] transition-colors">
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

      <DeleteConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title={deleteTarget?.title} />
    </div>
  );
}

export default function AdminCalendarPage() {
  return <ToastProvider><CalendarContent /></ToastProvider>;
}
