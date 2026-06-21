import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare } from 'lucide-react';
import { useAdminData, useFilteredItems, PAGE_SIZE } from '../../components/admin/useAdminData';
import { ListControls, Pagination } from '../../components/admin/ListComponents';
import { AnimatedList, AnimatedListItem } from '../../components/admin/AnimatedList';
import { SkeletonList } from '../../components/admin/SkeletonLoader';
import EmptyState from '../../components/admin/EmptyState';

export default function FeedbackPage() {
  const { items: feedbackItems, loading } = useAdminData('feedback');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('date');
  const [page, setPage] = useState(1);

  const filtered = useFilteredItems(feedbackItems, {
    searchFields: ['name', 'message', 'email'],
    sortFn: () => (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    search, sort, page,
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-sora font-bold text-white">Feedback</h1>
        <p className="text-xs text-white/30 font-inter mt-0.5">{feedbackItems.length} messages from visitors</p>
      </div>

      <ListControls search={search} onSearch={v => { setSearch(v); setPage(1); }} sort={sort} onSort={v => { setSort(v); setPage(1); }} sortOptions={[{ value: 'date', label: 'Date' }, { value: 'name', label: 'Name' }]} placeholder="Search feedback..." />

      {loading ? <SkeletonList /> : filtered.items.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No feedback yet" />
      ) : (
        <>
          <AnimatedList className="space-y-3">
            {filtered.items.map(fb => (
              <AnimatedListItem key={fb.id}>
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-5 hover:bg-white/[0.05] hover:border-white/[0.08] transition-all">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-inter font-semibold text-sm">{fb.name}</h3>
                        {fb.email && <span className="text-white/25 text-xs font-inter hidden sm:inline">{fb.email}</span>}
                        {fb.page && <span className="text-[9px] font-poppins font-bold text-white/20 uppercase tracking-[0.15em] bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.04]">{fb.page}</span>}
                      </div>
                      <div className="flex items-center gap-0.5 mt-1.5">
                        {[1, 2, 3, 4, 5].map(n => (
                          <Star key={n} className={`w-3.5 h-3.5 ${n <= fb.rating ? 'fill-gold-500 text-gold-500' : 'text-white/[0.06]'}`} />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] font-inter text-white/20 shrink-0">
                      {new Date(fb.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-white/50 text-sm font-inter leading-relaxed">{fb.message}</p>
                </div>
              </AnimatedListItem>
            ))}
          </AnimatedList>
          <Pagination page={filtered.page} totalPages={filtered.totalPages} onPage={setPage} totalItems={filtered.total} itemsPerPage={PAGE_SIZE} />
        </>
      )}
    </div>
  );
}
