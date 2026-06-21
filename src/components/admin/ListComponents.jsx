import { motion } from 'framer-motion';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '../../utils/helpers';

export function ListControls({ search, onSearch, sort, onSort, sortOptions, placeholder = 'Search...', actionButton }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
        <input
          type="text"
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-inter focus:outline-none focus:border-gold-500/40 focus:bg-white/[0.06] placeholder:text-white/20 transition-all duration-200"
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
          <select
            value={sort}
            onChange={e => onSort(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-8 py-2.5 text-sm text-white/60 font-inter focus:outline-none focus:border-gold-500/40 transition-all duration-200 appearance-none bg-no-repeat bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%2712%27%20height%3D%2712%27%20viewBox%3D%270%200%2012%2012%27%20fill%3D%27none%27%3E%3Cpath%20d%3D%27M3%205L6%208L9%205%27%20stroke%3D%27rgba(255%2C255%2C255%2C0.3)%27%20stroke-width%3D%271.5%27%20stroke-linecap%3D%27round%27/%3E%3C/svg%3E')] bg-[right_8px_center]"
          >
            {sortOptions.map(o => (
              <option key={o.value} value={o.value} className="bg-navy-900 text-white">{o.label}</option>
            ))}
          </select>
        </div>
        {actionButton}
      </div>
    </motion.div>
  );
}

export function Pagination({ page, totalPages, onPage, totalItems, itemsPerPage }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const startItem = (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalItems);

  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) pages.push(i);
  const showFirst = pages[0] > 1;
  const showLast = pages[pages.length - 1] < totalPages;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t border-white/[0.04]"
    >
      <span className="text-xs text-white/30 font-inter">
        {startItem}–{endItem} of {totalItems}
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {showFirst && (
          <>
            <button
              onClick={() => onPage(1)}
              className="w-8 h-8 rounded-lg text-xs font-inter font-semibold bg-white/[0.04] text-white/50 hover:bg-white/[0.08] transition-all"
            >
              1
            </button>
            {pages[0] > 2 && <span className="text-white/20 text-xs px-1">...</span>}
          </>
        )}

        {pages.map(p => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={cn(
              'w-8 h-8 rounded-lg text-xs font-inter font-semibold transition-all duration-200',
              p === page
                ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 shadow-lg shadow-gold-500/20'
                : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08]'
            )}
          >
            {p}
          </button>
        ))}

        {showLast && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && <span className="text-white/20 text-xs px-1">...</span>}
            <button
              onClick={() => onPage(totalPages)}
              className="w-8 h-8 rounded-lg text-xs font-inter font-semibold bg-white/[0.04] text-white/50 hover:bg-white/[0.08] transition-all"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages}
          className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPage(totalPages)}
          disabled={page >= totalPages}
          className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
