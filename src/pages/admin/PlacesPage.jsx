import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, ExternalLink, MapPin, Download, Filter } from 'lucide-react';
import { useAdminData, useFilteredItems, PAGE_SIZE } from '../../components/admin/useAdminData';
import { exportToCSV } from '../../utils/export';
import { ListControls, Pagination } from '../../components/admin/ListComponents';
import { AnimatedList, AnimatedListItem } from '../../components/admin/AnimatedList';
import { SkeletonList } from '../../components/admin/SkeletonLoader';
import EmptyState from '../../components/admin/EmptyState';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import { ToastProvider, useToast } from '../../components/admin/Toast';

function PlacesContent() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { items: places, loading, remove } = useAdminData('places');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [catFilter, setCatFilter] = useState('all');

  const categories = [...new Set(places.map(p => p.catKey).filter(Boolean))];
  const preFiltered = catFilter === 'all' ? places : places.filter(p => p.catKey === catFilter);

  const filtered = useFilteredItems(preFiltered, {
    searchFields: ['name', 'catKey', 'tags.description'],
    sortFn: (s) => (a, b) => s === 'catKey'
      ? (a.catKey || '').localeCompare(b.catKey || '')
      : (a.name || '').localeCompare(b.name || ''),
    search, sort, page,
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await remove(deleteTarget.id);
    addToast(ok ? 'Place deleted' : 'Failed to delete', ok ? 'success' : 'error');
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-sora font-bold text-white">Places</h1>
          <p className="text-xs text-white/30 font-inter mt-0.5">{places.length} places total</p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link to="/admin/places/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 rounded-xl text-sm font-sora font-bold hover:from-gold-400 hover:to-gold-300 hover:shadow-lg hover:shadow-gold-500/20 transition-all">
            <Plus className="w-4 h-4" /> Add Place
          </Link>
        </motion.div>
        {places.length > 0 && (
          <button onClick={() => exportToCSV(places, [
            { label: 'ID', accessor: 'id' },
            { label: 'Name', accessor: 'name' },
            { label: 'Category', accessor: 'catKey' },
            { label: 'Latitude', accessor: 'lat' },
            { label: 'Longitude', accessor: 'lon' },
            { label: 'Rating', accessor: 'rating' },
          ], 'places.csv')} className="inline-flex items-center gap-1.5 px-3 py-2 text-white/40 hover:text-white/70 text-sm font-inter rounded-xl hover:bg-white/[0.04] border border-white/[0.06] transition-all">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        )}
      </div>

      <ListControls
        search={search}
        onSearch={v => { setSearch(v); setPage(1); }}
        sort={sort}
        onSort={v => { setSort(v); setPage(1); }}
        sortOptions={[{ value: 'name', label: 'Name' }, { value: 'catKey', label: 'Category' }]}
        placeholder="Search places..."
      />

      {categories.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-white/25" />
          <button onClick={() => { setCatFilter('all'); setPage(1); }} className={`px-2.5 py-1 rounded-lg text-[11px] font-inter transition-all ${catFilter === 'all' ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20' : 'text-white/35 hover:text-white/60 border border-white/[0.04] hover:border-white/[0.08]'}`}>All</button>
          {categories.map(cat => (
            <button key={cat} onClick={() => { setCatFilter(cat); setPage(1); }} className={`px-2.5 py-1 rounded-lg text-[11px] font-inter transition-all ${catFilter === cat ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20' : 'text-white/35 hover:text-white/60 border border-white/[0.04] hover:border-white/[0.08]'}`}>{cat}</button>
          ))}
        </div>
      )}

      {loading ? <SkeletonList /> : filtered.items.length === 0 ? (
        <EmptyState icon={MapPin} title="No places found" description={search ? 'Try a different search' : 'Add your first place'} action={
          !search && <Link to="/admin/places/new" className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 text-gold-500 border border-gold-500/20 rounded-xl text-sm font-inter font-semibold hover:bg-gold-500/20 transition-all"><Plus className="w-4 h-4" /> Add Place</Link>
       } />
      ) : (
        <>
          <AnimatedList className="space-y-2">
            {filtered.items.map(place => (
              <AnimatedListItem key={place.id}>
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between hover:bg-white/[0.05] hover:border-white/[0.08] transition-all group">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-white font-inter font-semibold text-sm group-hover:text-gold-400 transition-colors truncate">{place.name}</h3>
                    <p className="text-white/25 text-xs font-inter mt-0.5">
                      {place.catKey} &middot;
                      <a href={`https://www.google.com/maps?q=${place.lat},${place.lon}`} target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors ml-1">
                        {place.lat?.toFixed(4)}, {place.lon?.toFixed(4)}
                      </a>
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={`/stays/${place.id}`} target="_blank" rel="noopener noreferrer" className="p-2 text-white/30 hover:text-gold-500 rounded-lg hover:bg-white/[0.04] transition-colors" title="Preview">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button onClick={() => navigate(`/admin/places/${place.id}/edit`)} className="p-2 text-white/30 hover:text-gold-500 rounded-lg hover:bg-white/[0.04] transition-colors" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteTarget(place)} className="p-2 text-white/40 hover:text-red-400 rounded-lg hover:bg-white/[0.04] transition-colors">
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

      <DeleteConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title={deleteTarget?.name} />
    </div>
  );
}

export default function PlacesPage() {
  return <ToastProvider><PlacesContent /></ToastProvider>;
}
