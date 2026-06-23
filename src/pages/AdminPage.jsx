import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, MapPin, LayoutGrid, Calendar, Circle,
  Building2, Sparkles, Clock, ExternalLink, Image as ImageIcon,
  Video, MessageSquare, Star, Activity, Server, Database, RefreshCw,
  ChevronRight, TrendingUp, Eye, BarChart3
} from 'lucide-react';
import { API, fetchWithAuth, uploadFile } from '../utils/admin';
import { formatDate, toDateString } from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import AdminHeader from '../components/admin/AdminHeader';
import TabNavigation from '../components/admin/TabNavigation';
import StatCard from '../components/admin/StatCard';
import { AnimatedCard, AnimatedCardHeader } from '../components/admin/AnimatedCard';
import { AnimatedList, AnimatedListItem } from '../components/admin/AnimatedList';
import { ListControls, Pagination } from '../components/admin/ListComponents';
import { FormField, Input, Select, Textarea, ImageUpload, GalleryUpload, FormActions } from '../components/admin/FormComponents';
import { SkeletonDashboard, SkeletonList } from '../components/admin/SkeletonLoader';
import EmptyState from '../components/admin/EmptyState';
import DeleteConfirmModal from '../components/admin/DeleteConfirmModal';
import SuccessModal from '../components/admin/SuccessModal';
import { ToastProvider, useToast } from '../components/admin/Toast';

const PAGE_SIZE = 10;

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-dark rounded-xl px-3 py-2 border border-white/10 shadow-xl">
      <p className="text-[10px] text-white/40 font-inter mb-0.5">{label}</p>
      <p className="text-sm text-gold-500 font-sora font-bold">{payload[0].value}</p>
    </div>
  );
};

function AdminPageInner() {
  const { username, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [tab, setTab] = useState('dashboard');
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [calendarItems, setCalendarItems] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [visitorStats, setVisitorStats] = useState(null);
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [listSearch, setListSearch] = useState('');
  const [listSort, setListSort] = useState('name');
  const [listPage, setListPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [successModal, setSuccessModal] = useState({ open: false, title: '', message: '' });

  const switchTab = (t) => {
    setTab(t);
    setListSearch('');
    setListPage(1);
    setShowForm(false);
    setEditing(null);
  };

  const paginated = (arr) => {
    const totalPages = Math.ceil(arr.length / PAGE_SIZE);
    const safePage = Math.min(listPage, totalPages || 1);
    const start = (safePage - 1) * PAGE_SIZE;
    return { items: arr.slice(start, start + PAGE_SIZE), page: safePage, totalPages };
  };

  useEffect(() => {
    if (!isAdmin) navigate('/');
  }, [isAdmin, navigate]);

  const loadPlaces = useCallback(async () => {
    const res = await fetchWithAuth(`${API}/places?limit=500`);
    if (res.ok) { const d = await res.json(); setPlaces(d.data || d); }
  }, []);

  const loadCategories = useCallback(async () => {
    const res = await fetchWithAuth(`${API}/categories?limit=500`);
    if (res.ok) { const d = await res.json(); setCategories(d.data || d); }
  }, []);

  const loadEvents = useCallback(async () => {
    const res = await fetchWithAuth(`${API}/events?limit=500`);
    if (res.ok) { const d = await res.json(); setEvents(d.data || d); }
  }, []);

  const loadCalendarItems = useCallback(async () => {
    const res = await fetchWithAuth(`${API}/calendar?limit=500`);
    if (res.ok) { const d = await res.json(); setCalendarItems(d.data || d); }
  }, []);

  const loadGalleryItems = useCallback(async () => {
    const res = await fetchWithAuth(`${API}/gallery?limit=500`);
    if (res.ok) { const d = await res.json(); setGalleryItems(d.data || d); }
  }, []);

  const loadFeedback = useCallback(async () => {
    const res = await fetchWithAuth(`${API}/feedback?limit=500`);
    if (res.ok) { const d = await res.json(); setFeedbackItems(d.data || d); }
  }, []);

  const loadVisitorStats = useCallback(async () => {
    const res = await fetchWithAuth(`${API}/visitor-stats`);
    if (res.ok) { const d = await res.json(); setVisitorStats(d); }
  }, []);

  const loadSystemInfo = useCallback(async () => {
    const res = await fetchWithAuth(`${API}/system`);
    if (res.ok) { const d = await res.json(); setSystemInfo(d); }
  }, []);

  const filteredPlaces = useMemo(() => {
    const f = places.filter(p => {
      if (!listSearch) return true;
      const q = listSearch.toLowerCase();
      return p.name?.toLowerCase().includes(q) || p.catKey?.toLowerCase().includes(q) || p.tags?.description?.toLowerCase().includes(q);
    }).sort((a, b) => {
      if (listSort === 'catKey') return (a.catKey || '').localeCompare(b.catKey || '');
      return (a.name || '').localeCompare(b.name || '');
    });
    const { items, page, totalPages } = paginated(f);
    return { items, page, totalPages, total: f.length };
  }, [places, listSearch, listSort, listPage]);

  const filteredEvents = useMemo(() => {
    const f = events.filter(e => {
      if (!listSearch) return true;
      const q = listSearch.toLowerCase();
      return e.title?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q) || e.category?.toLowerCase().includes(q);
    }).sort((a, b) => {
      if (listSort === 'date') return new Date(a.date) - new Date(b.date);
      return (a.title || '').localeCompare(b.title || '');
    });
    const { items, page, totalPages } = paginated(f);
    return { items, page, totalPages, total: f.length };
  }, [events, listSearch, listSort, listPage]);

  const filteredCategories = useMemo(() => {
    const f = categories.filter(c => {
      if (!listSearch) return true;
      const q = listSearch.toLowerCase();
      return c.label?.toLowerCase().includes(q) || c.id?.toLowerCase().includes(q);
    }).sort((a, b) => {
      if (listSort === 'id') return (a.id || '').localeCompare(b.id || '');
      return (a.label || '').localeCompare(b.label || '');
    });
    const { items, page, totalPages } = paginated(f);
    return { items, page, totalPages, total: f.length };
  }, [categories, listSearch, listSort, listPage]);

  const filteredCalendar = useMemo(() => {
    const f = calendarItems.filter(ci => {
      if (!listSearch) return true;
      const q = listSearch.toLowerCase();
      return ci.title?.toLowerCase().includes(q) || ci.type?.toLowerCase().includes(q) || ci.description?.toLowerCase().includes(q);
    }).sort((a, b) => {
      if (listSort === 'title') return (a.title || '').localeCompare(b.title || '');
      return new Date(a.date) - new Date(b.date);
    });
    const { items, page, totalPages } = paginated(f);
    return { items, page, totalPages, total: f.length };
  }, [calendarItems, listSearch, listSort, listPage]);

  const filteredFeedback = useMemo(() => {
    const f = feedbackItems.filter(fb => {
      if (!listSearch) return true;
      const q = listSearch.toLowerCase();
      return fb.name?.toLowerCase().includes(q) || fb.message?.toLowerCase().includes(q) || fb.email?.toLowerCase().includes(q);
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const { items, page, totalPages } = paginated(f);
    return { items, page, totalPages, total: f.length };
  }, [feedbackItems, listSearch, listPage]);

  const filteredGallery = useMemo(() => {
    const f = galleryItems.filter(g => {
      if (!listSearch) return true;
      const q = listSearch.toLowerCase();
      return g.title?.toLowerCase().includes(q) || g.type?.toLowerCase().includes(q);
    }).sort((a, b) => {
      if (listSort === 'title') return (a.title || '').localeCompare(b.title || '');
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    const { items, page, totalPages } = paginated(f);
    return { items, page, totalPages, total: f.length };
  }, [galleryItems, listSearch, listSort, listPage]);

  useEffect(() => {
    if (!isAdmin) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    Promise.all([loadPlaces(), loadCategories(), loadEvents(), loadCalendarItems(), loadGalleryItems(), loadFeedback(), loadVisitorStats()]).then(() => setLoading(false));
    loadSystemInfo();
  }, [isAdmin, loadPlaces, loadCategories, loadEvents, loadCalendarItems, loadGalleryItems, loadVisitorStats, loadSystemInfo]);

  const handleDelete = async (type, id) => {
    const res = await fetchWithAuth(`${API}/${type}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      if (type === 'places') setPlaces(p => p.filter(x => x.id !== id));
      else if (type === 'events') setEvents(e => e.filter(x => x.id !== id));
      else if (type === 'calendar') setCalendarItems(c => c.filter(x => x.id !== id));
      else if (type === 'gallery') setGalleryItems(g => g.filter(x => x.id !== id));
      else setCategories(c => c.filter(x => x.id !== id));
      addToast('Item deleted successfully', 'success');
    } else {
      addToast('Failed to delete item', 'error');
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#030810]">
      <AdminHeader />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-7">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <TabNavigation activeTab={tab} onTabChange={switchTab} />
        </motion.div>

        <AnimatePresence mode="wait">
          {tab === 'dashboard' && (
            <motion.div key="dashboard" {...pageTransition}>
              {loading ? (
                <SkeletonDashboard />
              ) : (
                <div className="space-y-6">
                  <div>
                    <motion.h2
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xl font-sora font-bold text-white mb-1"
                    >
                      Welcome back, {username}
                    </motion.h2>
                    <p className="text-sm font-inter text-white/30">Here's what's happening with your platform</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <StatCard icon={MapPin} label="Places" value={places.length} color="gold" delay={0} />
                    <StatCard icon={LayoutGrid} label="Categories" value={categories.length} color="blue" delay={0.07} />
                    <StatCard icon={Calendar} label="Events" value={events.length} color="purple" delay={0.14} />
                    <StatCard icon={Circle} label="Calendar Items" value={calendarItems.length} color="cyan" delay={0.21} />
                    <StatCard icon={MessageSquare} label="Feedback" value={feedbackItems.length} color="green" delay={0.28} />
                    <StatCard icon={Eye} label="Total Visits" value={visitorStats?.totalVisits ?? 0} color="gold" delay={0.35} />
                    <StatCard icon={Activity} label="Unique Visitors" value={visitorStats?.uniqueVisitors ?? 0} color="red" delay={0.42} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
                    <AnimatedCard delay={0.15}>
                      <AnimatedCardHeader icon={Building2} title="Recent Places" />
                      {places.length === 0 ? (
                        <EmptyState icon={MapPin} title="No places yet" description="Add your first place to get started" />
                      ) : (
                        <div className="space-y-2">
                          {places.slice(0, 5).map((p, i) => (
                            <motion.div
                              key={p.id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + i * 0.06 }}
                              className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors group"
                            >
                              {p.image && (
                                <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover bg-navy-800 border border-white/[0.06]" />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-white text-sm font-inter font-medium truncate group-hover:text-gold-400 transition-colors">{p.name}</p>
                                <p className="text-white/25 text-xs font-inter">{p.catKey}</p>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-white/15 group-hover:text-gold-500/50 transition-colors" />
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </AnimatedCard>

                    <AnimatedCard delay={0.2}>
                      <AnimatedCardHeader icon={Sparkles} title="Upcoming Events" />
                      {events.length === 0 ? (
                        <EmptyState icon={Calendar} title="No events yet" description="Add your first event to get started" />
                      ) : (
                        <div className="space-y-2">
                          {events.slice(0, 5).map((e, i) => (
                            <motion.div
                              key={e.id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.25 + i * 0.06 }}
                              className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors group"
                            >
                              {e.image && (
                                <img src={e.image} alt={e.title} className="w-9 h-9 rounded-lg object-cover bg-navy-800 border border-white/[0.06]" />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-white text-sm font-inter font-medium truncate group-hover:text-gold-400 transition-colors">{e.title}</p>
                                <p className="text-white/25 text-xs font-inter flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {formatDate(e.date)}
                                </p>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-white/15 group-hover:text-gold-500/50 transition-colors" />
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </AnimatedCard>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
                    <AnimatedCard delay={0.25}>
                      <AnimatedCardHeader icon={BarChart3} title="Daily Visits" subtitle="Last 30 days" />
                      {visitorStats?.daily?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                          <BarChart data={visitorStats.daily} barCategoryGap="25%">
                            <XAxis
                              dataKey="date"
                              tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
                              tickFormatter={v => v.slice(5)}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={false} />
                            <Bar dataKey="count" fill="url(#goldGradient)" radius={[6, 6, 0, 0]} />
                            <defs>
                              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#C9A84C" />
                                <stop offset="100%" stopColor="#C9A84C" stopOpacity={0.3} />
                              </linearGradient>
                            </defs>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[220px] flex items-center justify-center text-white/20 text-sm font-inter">No visit data yet</div>
                      )}
                    </AnimatedCard>

                    <AnimatedCard delay={0.3}>
                      <AnimatedCardHeader icon={TrendingUp} title="Visit Trend" subtitle="Growth over time" />
                      {visitorStats?.daily?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                          <AreaChart data={visitorStats.daily}>
                            <defs>
                              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#C9A84C" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#C9A84C" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <XAxis
                              dataKey="date"
                              tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
                              tickFormatter={v => v.slice(5)}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                              type="monotone"
                              dataKey="count"
                              stroke="#C9A84C"
                              strokeWidth={2.5}
                              fill="url(#areaGradient)"
                              dot={false}
                              activeDot={{ r: 5, fill: '#C9A84C', stroke: '#030810', strokeWidth: 2 }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[220px] flex items-center justify-center text-white/20 text-sm font-inter">No visit data yet</div>
                      )}
                    </AnimatedCard>
                  </div>

                  <AnimatedCard delay={0.35}>
                    <AnimatedCardHeader icon={TrendingUp} title="Top Pages" />
                    {visitorStats?.topPages?.length > 0 ? (
                      <div className="space-y-2.5">
                        {visitorStats.topPages.map((p, i) => (
                          <motion.div
                            key={p.page}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + i * 0.05 }}
                            className="flex items-center gap-3 group"
                          >
                            <span className="text-white/20 text-xs font-mono w-5 text-right">{i + 1}</span>
                            <div className="flex-1 h-7 bg-white/[0.02] rounded-lg overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(p.count / (visitorStats.topPages[0]?.count || 1)) * 100}%` }}
                                transition={{ duration: 0.8, delay: 0.5 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                                className="h-full bg-gradient-to-r from-gold-500/20 to-gold-500/5 rounded-lg flex items-center px-3"
                              >
                                <span className="text-white/60 text-xs font-inter truncate">{p.page}</span>
                              </motion.div>
                            </div>
                            <span className="text-gold-500 text-xs font-sora font-bold w-8 text-right">{p.count}</span>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState icon={BarChart3} title="No page data yet" />
                    )}
                  </AnimatedCard>
                </div>
              )}
            </motion.div>
          )}

          {tab === 'places' && (
            <motion.div key="places" {...pageTransition}>
              <PageHeader
                title="Manage Places"
                count={places.length}
                onAddNew={() => navigate('/admin/places/new')}
                addLabel="Add Place"
              />
              {showForm && (
                <PlaceForm
                  place={editing}
                  categories={categories}
                  onSave={(p) => {
                    if (editing) setPlaces(pl => pl.map(x => x.id === p.id ? p : x));
                    else setPlaces(pl => [...pl, p]);
                    setShowForm(false);
                    setEditing(null);
                    addToast(editing ? 'Place updated' : 'Place created', 'success');
                  }}
                  onCancel={() => { setShowForm(false); setEditing(null); }}
                />
              )}
              <ListControls
                search={listSearch}
                onSearch={v => { setListSearch(v); setListPage(1); }}
                sort={listSort}
                onSort={v => { setListSort(v); setListPage(1); }}
                sortOptions={[{ value: 'name', label: 'Name' }, { value: 'catKey', label: 'Category' }]}
                placeholder="Search places..."
              />
              {loading ? (
                <SkeletonList />
              ) : filteredPlaces.items.length === 0 ? (
                <EmptyState
                  icon={MapPin}
                  title="No places found"
                  description={listSearch ? 'Try a different search term' : 'Add your first place to get started'}
                  action={!listSearch && (
                    <Link to="/admin/places/new" className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 text-gold-500 border border-gold-500/20 rounded-xl text-sm font-inter font-semibold hover:bg-gold-500/20 transition-all">
                      <Plus className="w-4 h-4" /> Add Place
                    </Link>
                  )}
                />
              ) : (
                <>
                  <AnimatedList className="space-y-2.5">
                    {filteredPlaces.items.map(place => (
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
                            <a href={`/stays/${place.id}`} target="_blank" rel="noopener noreferrer" className="p-2 text-white/30 hover:text-gold-500 transition-colors rounded-lg hover:bg-white/[0.04]" title="Preview">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button onClick={() => { setEditing(place); setShowForm(true); }} className="p-2 text-white/40 hover:text-gold-500 transition-colors rounded-lg hover:bg-white/[0.04]">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteTarget({ type: 'places', id: place.id, name: place.name })} className="p-2 text-white/40 hover:text-red-400 transition-colors rounded-lg hover:bg-white/[0.04]">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </AnimatedListItem>
                    ))}
                  </AnimatedList>
                  <Pagination page={filteredPlaces.page} totalPages={filteredPlaces.totalPages} onPage={setListPage} totalItems={filteredPlaces.total} itemsPerPage={PAGE_SIZE} />
                </>
              )}
            </motion.div>
          )}

          {tab === 'categories' && (
            <motion.div key="categories" {...pageTransition}>
              <PageHeader
                title="Manage Categories"
                count={categories.length}
                onAddNew={() => navigate('/admin/categories/new')}
                addLabel="Add Category"
              />
              {showForm && (
                <CategoryForm
                  category={editing}
                  onSave={(c) => {
                    if (editing) setCategories(cat => cat.map(x => x.id === c.id ? c : x));
                    else setCategories(cat => [...cat, c]);
                    setShowForm(false);
                    setEditing(null);
                    addToast(editing ? 'Category updated' : 'Category created', 'success');
                  }}
                  onCancel={() => { setShowForm(false); setEditing(null); }}
                />
              )}
              <ListControls
                search={listSearch}
                onSearch={v => { setListSearch(v); setListPage(1); }}
                sort={listSort}
                onSort={v => { setListSort(v); setListPage(1); }}
                sortOptions={[{ value: 'label', label: 'Label' }, { value: 'id', label: 'ID' }]}
                placeholder="Search categories..."
              />
              {loading ? (
                <SkeletonList />
              ) : filteredCategories.items.length === 0 ? (
                <EmptyState icon={LayoutGrid} title="No categories found" description={listSearch ? 'Try a different search term' : 'Add your first category'} />
              ) : (
                <>
                  <AnimatedList className="space-y-2.5">
                    {filteredCategories.items.map(cat => (
                      <AnimatedListItem key={cat.id}>
                        <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between hover:bg-white/[0.05] hover:border-white/[0.08] transition-all group">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span className="text-2xl shrink-0">{cat.icon}</span>
                            <div className="min-w-0">
                              <h3 className="text-white font-inter font-semibold text-sm group-hover:text-gold-400 transition-colors">{cat.label}</h3>
                              <p className="text-white/25 text-xs font-inter">ID: {cat.id} &middot; <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: cat.color }} />{cat.color}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditing(cat); setShowForm(true); }} className="p-2 text-white/40 hover:text-gold-500 transition-colors rounded-lg hover:bg-white/[0.04]">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteTarget({ type: 'categories', id: cat.id, name: cat.label })} className="p-2 text-white/40 hover:text-red-400 transition-colors rounded-lg hover:bg-white/[0.04]">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </AnimatedListItem>
                    ))}
                  </AnimatedList>
                  <Pagination page={filteredCategories.page} totalPages={filteredCategories.totalPages} onPage={setListPage} totalItems={filteredCategories.total} itemsPerPage={PAGE_SIZE} />
                </>
              )}
            </motion.div>
          )}

          {tab === 'events' && (
            <motion.div key="events" {...pageTransition}>
              <PageHeader
                title="Manage Events"
                count={events.length}
                onAddNew={() => navigate('/admin/events/new')}
                addLabel="Add Event"
              />
              {showForm && (
                <EventForm
                  event={editing}
                  onSave={(e) => {
                    if (editing) setEvents(ev => ev.map(x => x.id === e.id ? e : x));
                    else setEvents(ev => [...ev, e]);
                    setShowForm(false);
                    setEditing(null);
                    addToast(editing ? 'Event updated' : 'Event created', 'success');
                  }}
                  onCancel={() => { setShowForm(false); setEditing(null); }}
                />
              )}
              <ListControls
                search={listSearch}
                onSearch={v => { setListSearch(v); setListPage(1); }}
                sort={listSort}
                onSort={v => { setListSort(v); setListPage(1); }}
                sortOptions={[{ value: 'date', label: 'Date' }, { value: 'title', label: 'Title' }]}
                placeholder="Search events..."
              />
              {loading ? (
                <SkeletonList />
              ) : filteredEvents.items.length === 0 ? (
                <EmptyState icon={Calendar} title="No events found" description={listSearch ? 'Try a different search term' : 'Add your first event'} />
              ) : (
                <>
                  <AnimatedList className="space-y-2.5">
                    {filteredEvents.items.map(event => (
                      <AnimatedListItem key={event.id}>
                        <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between hover:bg-white/[0.05] hover:border-white/[0.08] transition-all group">
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            {event.image && (
                              <img src={event.image} alt={event.title} className="w-12 h-12 rounded-xl object-cover bg-navy-800 border border-white/[0.06] shrink-0" />
                            )}
                            <div className="min-w-0">
                              <h3 className="text-white font-inter font-semibold text-sm group-hover:text-gold-400 transition-colors truncate">{event.title}</h3>
                              <p className="text-white/25 text-xs font-inter mt-0.5">
                                {formatDate(event.date)} &middot; {event.location} &middot; <span className="text-gold-500/50">{event.category}</span>
                              </p>
                              {event.ticketLink && (
                                <p className="text-white/15 text-xs font-inter mt-0.5 truncate">Ticket: {event.ticketLink}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <a href={`/events?highlight=${event.id}`} target="_blank" rel="noopener noreferrer" className="p-2 text-white/30 hover:text-gold-500 transition-colors rounded-lg hover:bg-white/[0.04]" title="Preview">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button onClick={() => { setEditing(event); setShowForm(true); }} className="p-2 text-white/40 hover:text-gold-500 transition-colors rounded-lg hover:bg-white/[0.04]">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteTarget({ type: 'events', id: event.id, name: event.title })} className="p-2 text-white/40 hover:text-red-400 transition-colors rounded-lg hover:bg-white/[0.04]">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </AnimatedListItem>
                    ))}
                  </AnimatedList>
                  <Pagination page={filteredEvents.page} totalPages={filteredEvents.totalPages} onPage={setListPage} totalItems={filteredEvents.total} itemsPerPage={PAGE_SIZE} />
                </>
              )}
            </motion.div>
          )}

          {tab === 'calendar' && (
            <motion.div key="calendar" {...pageTransition}>
              <PageHeader
                title="Manage Calendar"
                count={calendarItems.length}
                onAddNew={() => navigate('/admin/calendar/new')}
                addLabel="Add Item"
              />
              {showForm && (
                <CalendarItemForm
                  item={editing}
                  onSave={(ci) => {
                    if (editing) setCalendarItems(items => items.map(x => x.id === ci.id ? ci : x));
                    else setCalendarItems(items => [...items, ci]);
                    setShowForm(false);
                    setEditing(null);
                    addToast(editing ? 'Item updated' : 'Item created', 'success');
                  }}
                  onCancel={() => { setShowForm(false); setEditing(null); }}
                />
              )}
              <ListControls
                search={listSearch}
                onSearch={v => { setListSearch(v); setListPage(1); }}
                sort={listSort}
                onSort={v => { setListSort(v); setListPage(1); }}
                sortOptions={[{ value: 'date', label: 'Date' }, { value: 'title', label: 'Title' }]}
                placeholder="Search calendar items..."
              />
              {loading ? (
                <SkeletonList />
              ) : filteredCalendar.items.length === 0 ? (
                <EmptyState icon={Circle} title="No calendar items found" description={listSearch ? 'Try a different search term' : 'Add your first calendar item'} />
              ) : (
                <>
                  <AnimatedList className="space-y-2.5">
                    {filteredCalendar.items.map(item => (
                      <AnimatedListItem key={item.id}>
                        <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between hover:bg-white/[0.05] hover:border-white/[0.08] transition-all group">
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}20` }}>
                              <Circle className="w-4 h-4" style={{ color: item.color }} fill={item.color} stroke="none" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-white font-inter font-semibold text-sm group-hover:text-gold-400 transition-colors truncate">{item.title}</h3>
                              <p className="text-white/25 text-xs font-inter">
                                {formatDate(item.date)}{item.time ? ` ${item.time}` : ''} &middot; <span className="capitalize" style={{ color: item.color }}>{item.type}</span>
                              </p>
                              {item.description && <p className="text-white/15 text-xs font-inter mt-0.5 line-clamp-1">{item.description}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button onClick={() => { setEditing(item); setShowForm(true); }} className="p-2 text-white/40 hover:text-gold-500 transition-colors rounded-lg hover:bg-white/[0.04]">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteTarget({ type: 'calendar', id: item.id, name: item.title })} className="p-2 text-white/40 hover:text-red-400 transition-colors rounded-lg hover:bg-white/[0.04]">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </AnimatedListItem>
                    ))}
                  </AnimatedList>
                  <Pagination page={filteredCalendar.page} totalPages={filteredCalendar.totalPages} onPage={setListPage} totalItems={filteredCalendar.total} itemsPerPage={PAGE_SIZE} />
                </>
              )}
            </motion.div>
          )}

          {tab === 'gallery' && (
            <motion.div key="gallery" {...pageTransition}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-lg font-sora font-bold text-white">Manage Gallery</h2>
                  <p className="text-xs text-white/30 font-inter mt-0.5">{galleryItems.length} items</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setEditing(null); setShowForm(true); }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 rounded-xl text-sm font-sora font-bold hover:from-gold-400 hover:to-gold-300 hover:shadow-lg hover:shadow-gold-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </motion.button>
              </div>
              {showForm && (
                <GalleryItemForm
                  item={editing}
                  onSave={(g) => {
                    if (editing) setGalleryItems(items => items.map(x => x.id === g.id ? g : x));
                    else setGalleryItems(items => [g, ...items]);
                    setShowForm(false);
                    setEditing(null);
                    addToast(editing ? 'Gallery item updated' : 'Gallery item added', 'success');
                  }}
                  onCancel={() => { setShowForm(false); setEditing(null); }}
                />
              )}
              <ListControls
                search={listSearch}
                onSearch={v => { setListSearch(v); setListPage(1); }}
                sort={listSort}
                onSort={v => { setListSort(v); setListPage(1); }}
                sortOptions={[{ value: 'date', label: 'Date' }, { value: 'title', label: 'Title' }]}
                placeholder="Search gallery..."
              />
              {loading ? (
                <SkeletonList />
              ) : filteredGallery.items.length === 0 ? (
                <EmptyState icon={ImageIcon} title="No gallery items found" />
              ) : (
                <>
                  <AnimatedList className="space-y-2.5">
                    {filteredGallery.items.map(item => (
                      <AnimatedListItem key={item.id}>
                        <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between hover:bg-white/[0.05] hover:border-white/[0.08] transition-all group">
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-navy-800 border border-white/[0.06] shrink-0 flex items-center justify-center">
                              {item.type === 'video' ? (
                                <Video className="w-5 h-5 text-gold-500" />
                              ) : (
                                <img src={item.url} alt={item.title || ''} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-white font-inter font-semibold text-sm group-hover:text-gold-400 transition-colors truncate">{item.title || 'Untitled'}</h3>
                              <p className="text-white/25 text-xs font-inter capitalize">{item.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 text-white/40 hover:text-gold-500 transition-colors rounded-lg hover:bg-white/[0.04]">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button onClick={() => setDeleteTarget({ type: 'gallery', id: item.id, name: item.title || 'Untitled' })} className="p-2 text-white/40 hover:text-red-400 transition-colors rounded-lg hover:bg-white/[0.04]">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </AnimatedListItem>
                    ))}
                  </AnimatedList>
                  <Pagination page={filteredGallery.page} totalPages={filteredGallery.totalPages} onPage={setListPage} totalItems={filteredGallery.total} itemsPerPage={PAGE_SIZE} />
                </>
              )}
            </motion.div>
          )}

          {tab === 'feedback' && (
            <motion.div key="feedback" {...pageTransition}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-lg font-sora font-bold text-white">Visitor Feedback</h2>
                  <p className="text-xs text-white/30 font-inter mt-0.5">{feedbackItems.length} messages</p>
                </div>
              </div>
              <ListControls
                search={listSearch}
                onSearch={v => { setListSearch(v); setListPage(1); }}
                sort={listSort}
                onSort={v => { setListSort(v); setListPage(1); }}
                sortOptions={[{ value: 'date', label: 'Date' }, { value: 'name', label: 'Name' }]}
                placeholder="Search feedback..."
              />
              {loading ? (
                <SkeletonList />
              ) : filteredFeedback.items.length === 0 ? (
                <EmptyState icon={MessageSquare} title="No feedback yet" description="Feedback from visitors will appear here" />
              ) : (
                <>
                  <AnimatedList className="space-y-3">
                    {filteredFeedback.items.map(fb => (
                      <AnimatedListItem key={fb.id}>
                        <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-5 hover:bg-white/[0.05] hover:border-white/[0.08] transition-all">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-white font-inter font-semibold text-sm">{fb.name}</h3>
                                {fb.email && <span className="text-white/25 text-xs font-inter hidden sm:inline">{fb.email}</span>}
                                {fb.page && (
                                  <span className="text-[9px] font-poppins font-bold text-white/20 uppercase tracking-[0.15em] bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.04]">{fb.page}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-0.5 mt-1.5">
                                {[1, 2, 3, 4, 5].map(n => (
                                  <Star key={n} className={`w-3.5 h-3.5 transition-colors ${n <= fb.rating ? 'fill-gold-500 text-gold-500' : 'text-white/[0.06]'}`} />
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
                  <Pagination page={filteredFeedback.page} totalPages={filteredFeedback.totalPages} onPage={setListPage} totalItems={filteredFeedback.total} itemsPerPage={PAGE_SIZE} />
                </>
              )}
            </motion.div>
          )}

          {tab === 'system' && (
            <motion.div key="system" {...pageTransition}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-lg font-sora font-bold text-white">System Health</h2>
                  <p className="text-xs text-white/30 font-inter mt-0.5">Server and infrastructure status</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={loadSystemInfo}
                  className="flex items-center gap-2 px-3.5 py-2 bg-white/[0.04] text-white/50 rounded-xl text-xs font-inter hover:bg-white/[0.08] hover:text-white/70 transition-all border border-white/[0.06]"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </motion.button>
              </div>
              {!systemInfo ? (
                <SkeletonDashboard />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                  <AnimatedCard delay={0}>
                    <AnimatedCardHeader icon={Database} title="Database" />
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-white/35 text-xs font-inter">Status</span>
                        <span className={`flex items-center gap-2 text-xs font-inter font-semibold ${systemInfo.database.status === 'connected' ? 'text-green-400' : 'text-red-400'}`}>
                          <span className={`w-2 h-2 rounded-full ${systemInfo.database.status === 'connected' ? 'bg-green-400 animate-pulse-soft' : 'bg-red-400'}`} />
                          {systemInfo.database.status === 'connected' ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      {systemInfo.database.pingMs != null && (
                        <div className="flex items-center justify-between">
                          <span className="text-white/35 text-xs font-inter">Ping</span>
                          <span className="text-white/60 text-xs font-mono">{systemInfo.database.pingMs}ms</span>
                        </div>
                      )}
                    </div>
                  </AnimatedCard>

                  <AnimatedCard delay={0.1}>
                    <AnimatedCardHeader icon={Server} title="Server" />
                    <div className="space-y-3">
                      {[
                        ['Uptime', (() => {
                          const u = Math.floor(systemInfo.server.uptime);
                          const d = Math.floor(u / 86400);
                          const h = Math.floor((u % 86400) / 3600);
                          const m = Math.floor((u % 3600) / 60);
                          return d > 0 ? `${d}d ${h}h ${m}m` : h > 0 ? `${h}h ${m}m` : `${m}m`;
                        })()],
                        ['Node.js', systemInfo.server.nodeVersion],
                        ['Environment', systemInfo.server.env],
                        ['Platform', `${systemInfo.server.platform} (${systemInfo.server.arch})`],
                        ['CPU Cores', systemInfo.server.cpus],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between">
                          <span className="text-white/35 text-xs font-inter">{label}</span>
                          <span className="text-white/60 text-xs font-mono">{value}</span>
                        </div>
                      ))}
                    </div>
                  </AnimatedCard>

                  <AnimatedCard delay={0.2}>
                    <AnimatedCardHeader icon={Activity} title="Memory" />
                    <div className="space-y-5">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/35 text-xs font-inter">System RAM</span>
                          <span className="text-white/60 text-xs font-mono">{Math.round(systemInfo.memory.system.used / 1024 / 1024)} MB / {Math.round(systemInfo.memory.system.total / 1024 / 1024)} MB</span>
                        </div>
                        <div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(systemInfo.memory.system.used / systemInfo.memory.system.total * 100)}%` }}
                            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/35 text-xs font-inter">Heap Used</span>
                          <span className="text-white/60 text-xs font-mono">{Math.round(systemInfo.memory.process.heapUsed / 1024 / 1024)} MB / {Math.round(systemInfo.memory.process.heapTotal / 1024 / 1024)} MB</span>
                        </div>
                        <div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (systemInfo.memory.process.heapUsed / systemInfo.memory.process.heapTotal * 100))}%` }}
                            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) handleDelete(deleteTarget.type, deleteTarget.id);
          setDeleteTarget(null);
        }}
        title={deleteTarget?.name || 'this item'}
      />

      <SuccessModal
        isOpen={successModal.open}
        onClose={() => setSuccessModal({ open: false, title: '', message: '' })}
        title={successModal.title}
        message={successModal.message}
      />
    </div>
  );
}

function PageHeader({ title, count, onAddNew, addLabel }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div>
        <h2 className="text-lg font-sora font-bold text-white">{title}</h2>
        <p className="text-xs text-white/30 font-inter mt-0.5">{count} items</p>
      </div>
      <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
          to={onAddNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 rounded-xl text-sm font-sora font-bold hover:from-gold-400 hover:to-gold-300 hover:shadow-lg hover:shadow-gold-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> {addLabel}
        </Link>
      </motion.div>
    </div>
  );
}

function PlaceForm({ place, categories, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: place?.name || '',
    lat: place?.lat || '',
    lon: place?.lon || '',
    catKey: place?.catKey || (categories[0]?.id || ''),
    description: place?.description || '',
    image: place?.image || '',
    gallery: place?.gallery ? JSON.stringify(place.gallery) : '[]',
    rating: place?.rating || 4.5,
    tags: place?.tags ? JSON.stringify(place.tags) : '[]'
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      ...form,
      lat: parseFloat(form.lat),
      lon: parseFloat(form.lon),
      rating: parseFloat(form.rating),
      gallery: JSON.parse(form.gallery || '[]'),
      tags: JSON.parse(form.tags || '[]')
    };
    const url = place ? `${API}/places/${place.id}` : `${API}/places`;
    const method = place ? 'PUT' : 'POST';
    const res = await fetchWithAuth(url, { method, body: JSON.stringify(body) });
    if (res.ok) onSave(await res.json());
    setSaving(false);
  };

  const updateGalleryUrl = (index, value) => {
    const arr = JSON.parse(form.gallery || '[]');
    arr[index] = value;
    setForm(f => ({ ...f, gallery: JSON.stringify(arr) }));
  };

  return (
    <motion.form
      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
      animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      onSubmit={handleSubmit}
      className="glass rounded-2xl border border-white/[0.06] p-5 md:p-6 space-y-5 overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Name">
          <Input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </FormField>
        <FormField label="Category">
          <Select
            value={form.catKey}
            onChange={e => setForm(f => ({ ...f, catKey: e.target.value }))}
            options={categories.map(c => ({ value: c.id, label: c.label }))}
          />
        </FormField>
        <FormField label="Latitude">
          <Input type="number" step="any" value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))} required />
        </FormField>
        <FormField label="Longitude">
          <Input type="number" step="any" value={form.lon} onChange={e => setForm(f => ({ ...f, lon: e.target.value }))} required />
        </FormField>
        <FormField label="Description" className="md:col-span-2">
          <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
        </FormField>
        <ImageUpload value={form.image} onChange={v => setForm(f => ({ ...f, image: v }))} label="Hero Image" preview />
        <FormField label="Rating">
          <Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} />
        </FormField>
      </div>

      <FormField label="Gallery Images (up to 4)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[0, 1, 2, 3].map(i => {
            const val = JSON.parse(form.gallery || '[]')[i] || '';
            return (
              <div key={i}>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-poppins font-bold text-white/25 uppercase tracking-wider w-6 shrink-0">#{i + 1}</span>
                  <Input type="url" value={val} onChange={e => updateGalleryUrl(i, e.target.value)} placeholder="https://example.com/photo.jpg" className="flex-1" />
                  <GalleryUpload onUrl={url => updateGalleryUrl(i, url)} />
                </div>
                {val && (
                  <img src={val} alt="Gallery item preview" className="mt-2 h-20 w-full rounded-xl object-cover bg-navy-800 border border-white/[0.04]" onError={e => { e.target.style.display = 'none' }} />
                )}
              </div>
            );
          })}
        </div>
      </FormField>

      <FormActions saving={saving} saveLabel={place ? 'Update Place' : 'Create Place'} onCancel={onCancel} />
    </motion.form>
  );
}

function EventForm({ event, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date ? toDateString(event.date) : '',
    time: event?.time || '',
    location: event?.location || '',
    category: event?.category || 'concert',
    price: event?.price || '',
    image: event?.image || '',
    ticketLink: event?.ticketLink || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const url = event ? `${API}/events/${event.id}` : `${API}/events`;
    const method = event ? 'PUT' : 'POST';
    const res = await fetchWithAuth(url, { method, body: JSON.stringify(form) });
    if (res.ok) onSave(await res.json());
    setSaving(false);
  };

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit}
      className="glass rounded-2xl border border-white/[0.06] p-5 md:p-6 mb-6 space-y-5 overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Title">
          <Input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
        </FormField>
        <FormField label="Category">
          <Select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} options={[
            { value: 'concert', label: 'Concert' },
            { value: 'movie', label: 'Movie Night' },
            { value: 'comedy', label: 'Comedy' },
            { value: 'arts', label: 'Arts' },
            { value: 'cultural', label: 'Cultural' },
          ]} />
        </FormField>
        <FormField label="Date">
          <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
        </FormField>
        <FormField label="Time">
          <Input type="text" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} placeholder="e.g. 7:00 PM" />
        </FormField>
        <FormField label="Location">
          <Input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />
        </FormField>
        <FormField label="Price">
          <Input type="text" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="e.g. 15,000 RWF or Free" />
        </FormField>
        <FormField label="Description" className="md:col-span-2">
          <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
        </FormField>
        <ImageUpload value={form.image} onChange={v => setForm(f => ({ ...f, image: v }))} label="Flyer / Banner Image" preview />
        <FormField label="Ticket Link">
          <Input type="url" value={form.ticketLink} onChange={e => setForm(f => ({ ...f, ticketLink: e.target.value }))} placeholder="https://example.com/buy-tickets" />
        </FormField>
      </div>
      <FormActions saving={saving} saveLabel={event ? 'Update Event' : 'Create Event'} onCancel={onCancel} />
    </motion.form>
  );
}

function CalendarItemForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: item?.title || '',
    description: item?.description || '',
    date: item?.date ? toDateString(item.date) : '',
    time: item?.time || '',
    type: item?.type || 'note',
    color: item?.color || '#4A90D9',
    location: item?.location || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const url = item ? `${API}/calendar/${item.id}` : `${API}/calendar`;
    const method = item ? 'PUT' : 'POST';
    const res = await fetchWithAuth(url, { method, body: JSON.stringify(form) });
    if (res.ok) onSave(await res.json());
    setSaving(false);
  };

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit}
      className="glass rounded-2xl border border-white/[0.06] p-5 md:p-6 mb-6 space-y-5 overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Title">
          <Input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
        </FormField>
        <FormField label="Type">
          <Select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} options={[
            { value: 'event', label: 'Event' },
            { value: 'note', label: 'Note' },
            { value: 'reminder', label: 'Reminder' },
            { value: 'holiday', label: 'Holiday' },
          ]} />
        </FormField>
        <FormField label="Date">
          <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
        </FormField>
        <FormField label="Time">
          <Input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
        </FormField>
        <FormField label="Description" className="md:col-span-2">
          <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
        </FormField>
        <FormField label="Location">
          <Input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
        </FormField>
        <FormField label="Color">
          <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-xl cursor-pointer" />
        </FormField>
      </div>
      <FormActions saving={saving} saveLabel={item ? 'Update Item' : 'Create Item'} onCancel={onCancel} />
    </motion.form>
  );
}

function GalleryItemForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState({
    url: item?.url || '',
    type: item?.type || 'image',
    title: item?.title || ''
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadFile(file);
      setForm(f => ({ ...f, url }));
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const url = item ? `${API}/gallery/${item.id}` : `${API}/gallery`;
    const method = item ? 'PUT' : 'POST';
    const res = await fetchWithAuth(url, { method, body: JSON.stringify(form) });
    if (res.ok) onSave(await res.json());
    setSaving(false);
  };

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit}
      className="glass rounded-2xl border border-white/[0.06] p-5 md:p-6 mb-6 space-y-5 overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Title">
          <Input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Photo title (optional)" />
        </FormField>
        <FormField label="Type">
          <Select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} options={[
            { value: 'image', label: 'Image' },
            { value: 'video', label: 'Video' },
          ]} />
        </FormField>
        <FormField label="URL" className="md:col-span-2">
          <div className="flex gap-2">
            <Input
              type="url"
              value={form.url}
              onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
              placeholder={form.type === 'video' ? 'https://youtube.com/watch?v=...' : 'https://example.com/image.jpg'}
              className="flex-1"
              required
            />
            <label className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-inter font-semibold cursor-pointer transition-all flex items-center gap-2 ${uploading ? 'bg-white/[0.04] text-white/30 border border-white/[0.06]' : 'bg-white/[0.06] text-white/60 hover:bg-white/[0.1] border border-white/[0.08]'}`}>
              {uploading ? <div className="w-4 h-4 border-2 border-white/20 border-t-gold-500 rounded-full animate-spin" /> : 'Upload'}
              <input type="file" accept={form.type === 'video' ? 'video/*' : 'image/*'} onChange={handleFile} className="hidden" disabled={uploading} />
            </label>
          </div>
        </FormField>
        {form.url && form.type === 'image' && (
          <div className="md:col-span-2">
            <img src={form.url} alt="Gallery item preview" className="h-32 rounded-xl object-cover bg-navy-800 border border-white/[0.06]" onError={e => { e.target.style.display = 'none' }} />
          </div>
        )}
      </div>
      <FormActions saving={saving} saveLabel={item ? 'Update' : 'Add to Gallery'} onCancel={onCancel} />
    </motion.form>
  );
}

function CategoryForm({ category, onSave, onCancel }) {
  const [form, setForm] = useState({
    id: category?.id || '',
    label: category?.label || '',
    icon: category?.icon || '',
    color: category?.color || '#C9A84C'
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const url = category ? `${API}/categories/${category.id}` : `${API}/categories`;
    const method = category ? 'PUT' : 'POST';
    const res = await fetchWithAuth(url, { method, body: JSON.stringify(form) });
    if (res.ok) onSave(await res.json());
    setSaving(false);
  };

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit}
      className="glass rounded-2xl border border-white/[0.06] p-5 md:p-6 mb-6 space-y-5 overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="ID (key)">
          <Input type="text" value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} disabled={!!category} required />
        </FormField>
        <FormField label="Label">
          <Input type="text" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} required />
        </FormField>
        <FormField label="Icon (emoji)">
          <Input type="text" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} required />
        </FormField>
        <FormField label="Color">
          <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-xl cursor-pointer" />
        </FormField>
      </div>
      <FormActions saving={saving} saveLabel={category ? 'Update Category' : 'Create Category'} onCancel={onCancel} />
    </motion.form>
  );
}

export default function AdminPage() {
  return (
    <ToastProvider>
      <AdminPageInner />
    </ToastProvider>
  );
}
