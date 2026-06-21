import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, ExternalLink, Calendar, Clock, Download, Filter } from 'lucide-react';
import { useAdminData, useFilteredItems, PAGE_SIZE } from '../../components/admin/useAdminData';
import { formatDate } from '../../utils/helpers';
import { exportToCSV } from '../../utils/export';
import { ListControls, Pagination } from '../../components/admin/ListComponents';
import { AnimatedList, AnimatedListItem } from '../../components/admin/AnimatedList';
import { SkeletonList } from '../../components/admin/SkeletonLoader';
import EmptyState from '../../components/admin/EmptyState';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import { ToastProvider, useToast } from '../../components/admin/Toast';

function EventsContent() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { items: events, loading, remove } = useAdminData('events');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('date');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [dateRange, setDateRange] = useState('all');
  const [catFilter, setCatFilter] = useState('all');

  const categories = [...new Set(events.map(e => e.category).filter(Boolean))];

  const now = new Date();
  const preFiltered = events.filter(e => {
    if (dateRange === 'upcoming') return new Date(e.date) >= now;
    if (dateRange === 'past') return new Date(e.date) < now;
    if (dateRange === 'thisMonth') {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    return true;
  }).filter(e => catFilter === 'all' || e.category === catFilter);

  const filtered = useFilteredItems(preFiltered, {
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
        {events.length > 0 && (
          <button onClick={() => exportToCSV(events, [
            { label: 'ID', accessor: 'id' },
            { label: 'Title', accessor: 'title' },
            { label: 'Date', accessor: 'date' },
            { label: 'Location', accessor: 'location' },
            { label: 'Category', accessor: 'category' },
            { label: 'Price', accessor: 'price' },
          ], 'events.csv')} className="inline-flex items-center gap-1.5 px-3 py-2 text-white/40 hover:text-white/70 text-sm font-inter rounded-xl hover:bg-white/[0.04] border border-white/[0.06] transition-all">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        )}
      </div>

      <ListControls search={search} onSearch={v => { setSearch(v); setPage(1); }} sort={sort} onSort={v => { setSort(v); setPage(1); }} sortOptions={[{ value: 'date', label: 'Date' }, { value: 'title', label: 'Title' }]} placeholder="Search events..." />

      <div className="flex items-center gap-4 flex-wrap">
        {(categories.length > 1) && (
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-white/25" />
            <button onClick={() => { setCatFilter('all'); setPage(1); }} className={`px-2.5 py-1 rounded-lg text-[11px] font-inter transition-all ${catFilter === 'all' ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20' : 'text-white/35 hover:text-white/60 border border-white/[0.04] hover:border-white/[0.08]'}`}>All</button>
            {categories.map(cat => (
              <button key={cat} onClick={() => { setCatFilter(cat); setPage(1); }} className={`px-2.5 py-1 rounded-lg text-[11px] font-inter transition-all ${catFilter === cat ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20' : 'text-white/35 hover:text-white/60 border border-white/[0.04] hover:border-white/[0.08]'}`}>{cat}</button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-1.5">
          {[
            { value: 'all', label: 'All Dates' },
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'past', label: 'Past' },
            { value: 'thisMonth', label: 'This Month' },
          ].map(opt => (
            <button key={opt.value} onClick={() => { setDateRange(opt.value); setPage(1); }} className={`px-2.5 py-1 rounded-lg text-[11px] font-inter transition-all ${dateRange === opt.value ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20' : 'text-white/35 hover:text-white/60 border border-white/[0.04] hover:border-white/[0.08]'}`}>{opt.label}</button>
          ))}
        </div>
      </div>

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
                    <button onClick={() => navigate(`/admin/events/${event.id}/edit`)} className="p-2 text-white/30 hover:text-gold-500 rounded-lg hover:bg-white/[0.04] transition-colors" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
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
