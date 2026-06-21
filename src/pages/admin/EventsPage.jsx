import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Trash2, ExternalLink, Calendar, Clock } from 'lucide-react';
import { useAdminData, useFilteredItems, PAGE_SIZE } from '../../components/admin/useAdminData';
import { formatDate } from '../../utils/helpers';
import { ListControls, Pagination } from '../../components/admin/ListComponents';
import { AnimatedList, AnimatedListItem } from '../../components/admin/AnimatedList';
import { SkeletonList } from '../../components/admin/SkeletonLoader';
import EmptyState from '../../components/admin/EmptyState';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import { ToastProvider, useToast } from '../../components/admin/Toast';

function EventsContent() {
  const { addToast } = useToast();
  const { items: events, loading, remove } = useAdminData('events');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('date');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useFilteredItems(events, {
    searchFields: ['title', 'location', 'category'],
    sortFn: (s) => (a, b) => s === 'date'
      ? new Date(a.date) - new Date(b.date)
      : (a.title || '').localeCompare(b.title || ''),
    search, sort, page,
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await remove(deleteTarget.id);
    addToast(ok ? 'Event deleted' : 'Failed to delete', ok ? 'success' : 'error');
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-sora font-bold text-white">Events</h1>
          <p className="text-xs text-white/30 font-inter mt-0.5">{events.length} events</p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link to="/admin/events/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 rounded-xl text-sm font-sora font-bold hover:from-gold-400 hover:to-gold-300 hover:shadow-lg hover:shadow-gold-500/20 transition-all">
            <Plus className="w-4 h-4" /> Add Event
          </Link>
        </motion.div>
      </div>

      <ListControls search={search} onSearch={v => { setSearch(v); setPage(1); }} sort={sort} onSort={v => { setSort(v); setPage(1); }} sortOptions={[{ value: 'date', label: 'Date' }, { value: 'title', label: 'Title' }]} placeholder="Search events..." />

      {loading ? <SkeletonList /> : filtered.items.length === 0 ? (
        <EmptyState icon={Calendar} title="No events found" />
      ) : (
        <>
          <AnimatedList className="space-y-2">
            {filtered.items.map(event => (
              <AnimatedListItem key={event.id}>
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between hover:bg-white/[0.05] hover:border-white/[0.08] transition-all group">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {event.image && <img src={event.image} alt="" className="w-12 h-12 rounded-xl object-cover bg-navy-800 border border-white/[0.06] shrink-0" />}
                    <div className="min-w-0">
                      <h3 className="text-white font-inter font-semibold text-sm group-hover:text-gold-400 transition-colors truncate">{event.title}</h3>
                      <p className="text-white/25 text-xs font-inter mt-0.5">
                        <Clock className="w-3 h-3 inline mr-1" />{formatDate(event.date)} &middot; {event.location} &middot; <span className="text-gold-500/50">{event.category}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <a href={`/events?highlight=${event.id}`} target="_blank" rel="noopener noreferrer" className="p-2 text-white/30 hover:text-gold-500 rounded-lg hover:bg-white/[0.04] transition-colors" title="Preview">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button onClick={() => setDeleteTarget(event)} className="p-2 text-white/40 hover:text-red-400 rounded-lg hover:bg-white/[0.04] transition-colors">
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

export default function EventsPage() {
  return <ToastProvider><EventsContent /></ToastProvider>;
}
