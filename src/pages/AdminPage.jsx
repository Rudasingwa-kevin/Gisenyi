import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Plus, Pencil, Trash2, LogOut, MapPin, LayoutGrid, Calendar, Circle, LayoutDashboard, Building2, Sparkles, Clock, Search, ArrowUpDown, ExternalLink } from 'lucide-react';
import { API, fetchWithAuth, uploadFile } from '../utils/admin';

export default function AdminPage() {
  const { token, username, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [calendarItems, setCalendarItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [listSearch, setListSearch] = useState('');
  const [listSort, setListSort] = useState('name');
  const [listPage, setListPage] = useState(1);

  const switchTab = (t) => { setTab(t); setListSearch(''); setListPage(1); };

  const paginated = (arr) => {
    const totalPages = Math.ceil(arr.length / PAGE_SIZE);
    const safePage = Math.min(listPage, totalPages || 1);
    const start = (safePage - 1) * PAGE_SIZE;
    return { items: arr.slice(start, start + PAGE_SIZE), page: safePage, totalPages };
  };

  const onSearchChange = (v) => { setListSearch(v); setListPage(1); };
  const onSortChange = (v) => { setListSort(v); setListPage(1); };

  useEffect(() => {
    if (!isAdmin) navigate('/');
  }, [isAdmin, navigate]);

  const loadPlaces = useCallback(async () => {
    const res = await fetchWithAuth(`${API}/places`, token);
    if (res.ok) { const d = await res.json(); setPlaces(d.data || d); }
  }, [token]);

  const loadCategories = useCallback(async () => {
    const res = await fetchWithAuth(`${API}/categories`, token);
    if (res.ok) { const d = await res.json(); setCategories(d.data || d); }
  }, [token]);

  const loadEvents = useCallback(async () => {
    const res = await fetchWithAuth(`${API}/events`, token);
    if (res.ok) { const d = await res.json(); setEvents(d.data || d); }
  }, [token]);

  const loadCalendarItems = useCallback(async () => {
    const res = await fetchWithAuth(`${API}/calendar`, token);
    if (res.ok) { const d = await res.json(); setCalendarItems(d.data || d); }
  }, [token]);

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    Promise.all([loadPlaces(), loadCategories(), loadEvents(), loadCalendarItems()]).then(() => setLoading(false));
  }, [isAdmin, loadPlaces, loadCategories, loadEvents]);

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const res = await fetchWithAuth(`${API}/${type}/${id}`, token, { method: 'DELETE' });
    if (res.ok) {
      if (type === 'places') setPlaces(p => p.filter(x => x.id !== id));
      else if (type === 'events') setEvents(e => e.filter(x => x.id !== id));
      else if (type === 'calendar') setCalendarItems(c => c.filter(x => x.id !== id));
      else setCategories(c => c.filter(x => x.id !== id));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAdmin) return null;

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
      if (listSort === 'date') return (a.date || '').localeCompare(b.date || '');
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
      return (a.date || '').localeCompare(b.date || '');
    });
    const { items, page, totalPages } = paginated(f);
    return { items, page, totalPages, total: f.length };
  }, [calendarItems, listSearch, listSort, listPage]);

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="sticky top-0 z-40 bg-navy-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-gold-500" />
            <span className="text-white font-sora font-bold">Admin Panel</span>
            <span className="text-white/30 text-sm font-inter">({username})</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/50 hover:text-red-400 transition-colors text-sm font-inter"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => switchTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-inter font-semibold transition-all ${
              tab === 'dashboard' ? 'bg-gold-500 text-navy-950' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>
          <button
            onClick={() => switchTab('places')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-inter font-semibold transition-all ${
              tab === 'places' ? 'bg-gold-500 text-navy-950' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <MapPin className="w-4 h-4" /> Places
          </button>
          <button
            onClick={() => switchTab('categories')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-inter font-semibold transition-all ${
              tab === 'categories' ? 'bg-gold-500 text-navy-950' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Categories
          </button>
          <button
            onClick={() => switchTab('events')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-inter font-semibold transition-all ${
              tab === 'events' ? 'bg-gold-500 text-navy-950' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <Calendar className="w-4 h-4" /> Events
          </button>
          <button
            onClick={() => switchTab('calendar')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-inter font-semibold transition-all ${
              tab === 'calendar' ? 'bg-gold-500 text-navy-950' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <Circle className="w-4 h-4" /> Calendar
          </button>
        </div>

        {tab === 'dashboard' && (
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-sora font-bold text-white mb-1">Dashboard</h2>
              <p className="text-sm font-inter text-white/40">Overview of your Gisenyi platform</p>
            </div>

            {loading ? (
              <div className="text-white/40 text-center py-20 font-inter">Loading...</div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="glass rounded-2xl border border-white/5 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-gold-500" />
                      </div>
                    </div>
                    <span className="text-3xl font-sora font-extrabold text-white">{places.length}</span>
                    <p className="text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.15em] mt-1">Places</p>
                  </div>
                  <div className="glass rounded-2xl border border-white/5 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                        <LayoutGrid className="w-5 h-5 text-gold-500" />
                      </div>
                    </div>
                    <span className="text-3xl font-sora font-extrabold text-white">{categories.length}</span>
                    <p className="text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.15em] mt-1">Categories</p>
                  </div>
                  <div className="glass rounded-2xl border border-white/5 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-gold-500" />
                      </div>
                    </div>
                    <span className="text-3xl font-sora font-extrabold text-white">{events.length}</span>
                    <p className="text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.15em] mt-1">Events</p>
                  </div>
                  <div className="glass rounded-2xl border border-white/5 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                        <Circle className="w-5 h-5 text-gold-500" />
                      </div>
                    </div>
                    <span className="text-3xl font-sora font-extrabold text-white">{calendarItems.length}</span>
                    <p className="text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.15em] mt-1">Calendar Items</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass rounded-2xl border border-white/5 p-6">
                    <h3 className="font-sora font-bold text-white text-sm mb-4 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gold-500" /> Recent Places
                    </h3>
                    {places.length === 0 ? (
                      <p className="text-white/30 text-sm font-inter">No places yet</p>
                    ) : (
                      <div className="space-y-2">
                        {places.slice(0, 5).map(p => (
                          <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                            {p.image && <img src={p.image} alt="" className="w-8 h-8 rounded-lg object-cover bg-navy-800" />}
                            <div className="min-w-0">
                              <p className="text-white text-sm font-inter truncate">{p.name}</p>
                              <p className="text-white/30 text-[10px] font-inter">{p.catKey}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="glass rounded-2xl border border-white/5 p-6">
                    <h3 className="font-sora font-bold text-white text-sm mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-gold-500" /> Upcoming Events
                    </h3>
                    {events.length === 0 ? (
                      <p className="text-white/30 text-sm font-inter">No events yet</p>
                    ) : (
                      <div className="space-y-2">
                        {events.slice(0, 5).map(e => (
                          <div key={e.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                            {e.image && <img src={e.image} alt="" className="w-8 h-8 rounded-lg object-cover bg-navy-800" />}
                            <div className="min-w-0">
                              <p className="text-white text-sm font-inter truncate">{e.title}</p>
                              <p className="text-white/30 text-[10px] font-inter flex items-center gap-1"><Clock className="w-3 h-3" /> {e.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'places' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-sora font-bold text-white">Manage Places ({places.length})</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-navy-950 rounded-xl text-sm font-sora font-bold hover:bg-gold-600 transition-all"
              >
                <Plus className="w-4 h-4" /> {showForm ? 'Close' : 'Edit'}
              </button>
            </div>
            <div className="flex gap-3 mb-6">
              <Link to="/admin/places/new" className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white/70 rounded-xl text-sm font-sora font-bold hover:bg-white/20 transition-all">
                <Plus className="w-4 h-4" /> Add New Place
              </Link>
            </div>

            {showForm && (
              <PlaceForm
                place={editing}
                categories={categories}
                token={token}
                onSave={(p) => {
                  if (editing) setPlaces(pl => pl.map(x => x.id === p.id ? p : x));
                  else setPlaces(pl => [...pl, p]);
                  setShowForm(false);
                  setEditing(null);
                }}
                onCancel={() => { setShowForm(false); setEditing(null); }}
              />
            )}

            <ListControls search={listSearch} onSearch={onSearchChange} sort={listSort} onSort={onSortChange} sortOptions={[{ value: 'name', label: 'Name' }, { value: 'catKey', label: 'Category' }]} placeholder="Search places..." />
            {loading ? (
              <div className="text-white/40 text-center py-20 font-inter">Loading...</div>
            ) : (<div>
              <div className="grid gap-3">
                {filteredPlaces.items.map(place => (
                  <div key={place.id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-inter font-semibold">{place.name}</h3>
                      <p className="text-white/30 text-sm font-inter">{place.catKey} &middot; <a href={`https://www.google.com/maps?q=${place.lat},${place.lon}`} target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors">{place.lat?.toFixed(4)}, {place.lon?.toFixed(4)}</a></p>
                    </div>
                    <div className="flex gap-1">
                      <a href={`/stays/${place.id}`} target="_blank" rel="noopener noreferrer"
                        className="p-2 text-white/30 hover:text-gold-500 transition-colors" title="Preview">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button onClick={() => { setEditing(place); setShowForm(true); }}
                        className="p-2 text-white/40 hover:text-gold-500 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete('places', place.id)}
                        className="p-2 text-white/40 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination page={filteredPlaces.page} totalPages={filteredPlaces.totalPages} onPage={setListPage} />
              </div>)}
          </div>
        )}

        {tab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-sora font-bold text-white">Manage Categories ({categories.length})</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-navy-950 rounded-xl text-sm font-sora font-bold hover:bg-gold-600 transition-all"
              >
                <Plus className="w-4 h-4" /> {showForm ? 'Close' : 'Edit'}
              </button>
            </div>
            <div className="flex gap-3 mb-6">
              <Link to="/admin/categories/new" className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white/70 rounded-xl text-sm font-sora font-bold hover:bg-white/20 transition-all">
                <Plus className="w-4 h-4" /> Add New Category
              </Link>
            </div>

            {showForm && (
              <CategoryForm
                category={editing}
                token={token}
                onSave={(c) => {
                  if (editing) setCategories(cat => cat.map(x => x.id === c.id ? c : x));
                  else setCategories(cat => [...cat, c]);
                  setShowForm(false);
                  setEditing(null);
                }}
                onCancel={() => { setShowForm(false); setEditing(null); }}
              />
            )}

            <ListControls search={listSearch} onSearch={onSearchChange} sort={listSort} onSort={onSortChange} sortOptions={[{ value: 'label', label: 'Label' }, { value: 'id', label: 'ID' }]} placeholder="Search categories..." />
            {loading ? (
              <div className="text-white/40 text-center py-20 font-inter">Loading...</div>
            ) : (<div>
              <div className="grid gap-3">
                {filteredCategories.items.map(cat => (
                  <div key={cat.id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cat.icon}</span>
                      <div>
                        <h3 className="text-white font-inter font-semibold">{cat.label}</h3>
                        <p className="text-white/30 text-sm font-inter">ID: {cat.id} &middot; Color: {cat.color}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditing(cat); setShowForm(true); }}
                        className="p-2 text-white/40 hover:text-gold-500 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete('categories', cat.id)}
                        className="p-2 text-white/40 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination page={filteredCategories.page} totalPages={filteredCategories.totalPages} onPage={setListPage} />
              </div>)}
          </div>
        )}

        {tab === 'events' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-sora font-bold text-white">Manage Events ({events.length})</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-navy-950 rounded-xl text-sm font-sora font-bold hover:bg-gold-600 transition-all"
              >
                <Plus className="w-4 h-4" /> {showForm ? 'Close' : 'Edit'}
              </button>
            </div>
            <div className="flex gap-3 mb-6">
              <Link to="/admin/events/new" className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white/70 rounded-xl text-sm font-sora font-bold hover:bg-white/20 transition-all">
                <Plus className="w-4 h-4" /> Add New Event
              </Link>
            </div>

            {showForm && (
              <EventForm
                event={editing}
                token={token}
                onSave={(e) => {
                  if (editing) setEvents(ev => ev.map(x => x.id === e.id ? e : x));
                  else setEvents(ev => [...ev, e]);
                  setShowForm(false);
                  setEditing(null);
                }}
                onCancel={() => { setShowForm(false); setEditing(null); }}
              />
            )}

            <ListControls search={listSearch} onSearch={onSearchChange} sort={listSort} onSort={onSortChange} sortOptions={[{ value: 'date', label: 'Date' }, { value: 'title', label: 'Title' }]} placeholder="Search events..." />
            {loading ? (
              <div className="text-white/40 text-center py-20 font-inter">Loading...</div>
            ) : (<div>
              <div className="grid gap-3">
                {filteredEvents.items.map(event => (
                  <div key={event.id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {event.image && (
                        <img src={event.image} alt="" className="w-14 h-14 rounded-lg object-cover bg-navy-800" />
                      )}
                      <div>
                        <h3 className="text-white font-inter font-semibold">{event.title}</h3>
                        <p className="text-white/30 text-sm font-inter">{event.date} &middot; {event.location} &middot; <span className="text-gold-500/60">{event.category}</span></p>
                        {event.ticketLink && (
                          <p className="text-white/20 text-xs font-inter mt-0.5">Ticket: {event.ticketLink}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <a href={`/events?highlight=${event.id}`} target="_blank" rel="noopener noreferrer"
                        className="p-2 text-white/30 hover:text-gold-500 transition-colors" title="Preview">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button onClick={() => { setEditing(event); setShowForm(true); }}
                        className="p-2 text-white/40 hover:text-gold-500 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete('events', event.id)}
                        className="p-2 text-white/40 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination page={filteredEvents.page} totalPages={filteredEvents.totalPages} onPage={setListPage} />
              </div>)}
          </div>
        )}

        {tab === 'calendar' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-sora font-bold text-white">Manage Calendar Items ({calendarItems.length})</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-navy-950 rounded-xl text-sm font-sora font-bold hover:bg-gold-600 transition-all"
              >
                <Plus className="w-4 h-4" /> {showForm ? 'Close' : 'Edit'}
              </button>
            </div>
            <div className="flex gap-3 mb-6">
              <Link to="/admin/calendar/new" className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white/70 rounded-xl text-sm font-sora font-bold hover:bg-white/20 transition-all">
                <Plus className="w-4 h-4" /> Add New Item
              </Link>
            </div>

            {showForm && (
              <CalendarItemForm
                item={editing}
                token={token}
                onSave={(ci) => {
                  if (editing) setCalendarItems(items => items.map(x => x.id === ci.id ? ci : x));
                  else setCalendarItems(items => [...items, ci]);
                  setShowForm(false);
                  setEditing(null);
                }}
                onCancel={() => { setShowForm(false); setEditing(null); }}
              />
            )}

            <ListControls search={listSearch} onSearch={onSearchChange} sort={listSort} onSort={onSortChange} sortOptions={[{ value: 'date', label: 'Date' }, { value: 'title', label: 'Title' }]} placeholder="Search calendar items..." />
            {loading ? (
              <div className="text-white/40 text-center py-20 font-inter">Loading...</div>
            ) : (<div>
              <div className="grid gap-3">
                {filteredCalendar.items.map(item => (
                  <div key={item.id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl" style={{ backgroundColor: `${item.color}15` }}>
                        <Circle className="w-4 h-4" style={{ color: item.color }} fill={item.color} stroke="none" />
                      </div>
                      <div>
                        <h3 className="text-white font-inter font-semibold">{item.title}</h3>
                        <p className="text-white/30 text-sm font-inter">
                          {item.date}{item.time ? ` ${item.time}` : ''} &middot; <span className="capitalize" style={{ color: item.color }}>{item.type}</span>
                        </p>
                        {item.description && <p className="text-white/20 text-xs font-inter mt-0.5 line-clamp-1">{item.description}</p>}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => { setEditing(item); setShowForm(true); }}
                        className="p-2 text-white/40 hover:text-gold-500 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete('calendar', item.id)}
                        className="p-2 text-white/40 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination page={filteredCalendar.page} totalPages={filteredCalendar.totalPages} onPage={setListPage} />
              </div>)}
          </div>
        )}
      </div>
    </div>
  );
}

const PAGE_SIZE = 10;

function ListControls({ search, onSearch, sort, onSort, sortOptions, placeholder }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input type="text" value={search} onChange={e => onSearch(e.target.value)}
          placeholder={placeholder || 'Search...'}
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-sm text-white font-inter focus:outline-none focus:border-gold-500/50 placeholder:text-white/20" />
      </div>
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-3.5 h-3.5 text-white/30" />
        <select value={sort} onChange={e => onSort(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 font-inter focus:outline-none focus:border-gold-500/50">
          {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) pages.push(i);
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button onClick={() => onPage(page - 1)} disabled={page <= 1}
        className="px-3 py-1.5 rounded-lg text-xs font-inter font-semibold bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all">
        Prev
      </button>
      {pages[0] > 1 && <span className="text-white/20 text-xs">...</span>}
      {pages.map(p => (
        <button key={p} onClick={() => onPage(p)}
          className={`w-8 h-8 rounded-lg text-xs font-inter font-semibold transition-all ${p === page ? 'bg-gold-500 text-navy-950' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
          {p}
        </button>
      ))}
      {pages[pages.length - 1] < totalPages && <span className="text-white/20 text-xs">...</span>}
      <button onClick={() => onPage(page + 1)} disabled={page >= totalPages}
        className="px-3 py-1.5 rounded-lg text-xs font-inter font-semibold bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all">
        Next
      </button>
    </div>
  );
}

function ImageUpload({ value, onChange, label, preview, token: t }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadFile(file, t);
      onChange(url);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
    setUploading(false);
  };

  return (
    <div className="md:col-span-2">
      <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">{label}</label>
      <div className="flex gap-2">
        <input type="url" value={value} onChange={e => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" />
        <label className={`shrink-0 px-4 py-2 rounded-lg text-sm font-inter font-semibold cursor-pointer transition-all ${uploading ? 'bg-white/10 text-white/40' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
          {uploading ? 'Uploading...' : 'Upload'}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
        </label>
      </div>
      {preview && value && (
        <img src={value} alt="" className="mt-2 h-24 rounded-lg object-cover bg-navy-800" onError={e => { e.target.style.display = 'none' }} />
      )}
    </div>
  );
}

function GalleryUpload({ index, token, onUrl }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadFile(file, token);
      onUrl(url);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
    setUploading(false);
  };

  return (
    <label className={`shrink-0 px-3 py-2 rounded-lg text-[10px] font-inter font-semibold cursor-pointer transition-all ${uploading ? 'bg-white/5 text-white/30' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>
      {uploading ? '...' : 'Upload'}
      <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
    </label>
  );
}

function EventForm({ event, token, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date || '',
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
    const res = await fetchWithAuth(url, token, { method, body: JSON.stringify(form) });
    if (res.ok) onSave(await res.json());
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/5 rounded-xl p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Title</label>
          <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" required />
        </div>
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Category</label>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50">
            <option value="concert">Concert</option>
            <option value="movie">Movie Night</option>
            <option value="comedy">Comedy</option>
            <option value="arts">Arts</option>
            <option value="cultural">Cultural</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Date</label>
          <input type="text" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            placeholder="e.g. June 20, 2026"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" required />
        </div>
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Time</label>
          <input type="text" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
            placeholder="e.g. 7:00 PM"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" />
        </div>
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Location</label>
          <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" required />
        </div>
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Price</label>
          <input type="text" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            placeholder="e.g. 15,000 RWF or Free"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Description</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50 resize-none" />
        </div>
        <ImageUpload value={form.image} onChange={v => setForm(f => ({ ...f, image: v }))} label="Flyer / Banner Image" preview token={token} />
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Ticket Link (URL)</label>
          <input type="url" value={form.ticketLink} onChange={e => setForm(f => ({ ...f, ticketLink: e.target.value }))}
            placeholder="https://example.com/buy-tickets"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" />
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={saving}
          className="px-5 py-2 bg-gold-500 text-navy-950 rounded-xl text-sm font-sora font-bold hover:bg-gold-600 transition-all disabled:opacity-50">
          {saving ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
        </button>
        <button type="button" onClick={onCancel}
          className="px-5 py-2 bg-white/5 text-white/60 rounded-xl text-sm font-inter hover:bg-white/10 transition-all">
          Cancel
        </button>
      </div>
    </form>
  );
}

function PlaceForm({ place, categories, token, onSave, onCancel }) {
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
    const res = await fetchWithAuth(url, token, { method, body: JSON.stringify(body) });
    if (res.ok) onSave(await res.json());
    setSaving(false);
  };

  const updateGalleryUrl = (index, value) => {
    const arr = JSON.parse(form.gallery || '[]');
    arr[index] = value;
    setForm(f => ({ ...f, gallery: JSON.stringify(arr) }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/5 rounded-xl p-6 mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Name</label>
          <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" required />
        </div>
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Category</label>
          <select value={form.catKey} onChange={e => setForm(f => ({ ...f, catKey: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50">
            {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Latitude</label>
          <input type="number" step="any" value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" required />
        </div>
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Longitude</label>
          <input type="number" step="any" value={form.lon} onChange={e => setForm(f => ({ ...f, lon: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Description</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50 resize-none" />
        </div>
        <ImageUpload value={form.image} onChange={v => setForm(f => ({ ...f, image: v }))} label="Hero Image" preview token={token} />
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Rating</label>
          <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-2">Gallery Images (up to 4)</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[0, 1, 2, 3].map(i => {
            const val = JSON.parse(form.gallery || '[]')[i] || '';
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[9px] font-poppins font-bold text-white/30 uppercase tracking-wider w-6 shrink-0">#{i + 1}</span>
                <input
                  type="url"
                  value={val}
                  onChange={e => updateGalleryUrl(i, e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50"
                />
                <GalleryUpload index={i} token={token} onUrl={url => updateGalleryUrl(i, url)} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="px-5 py-2 bg-gold-500 text-navy-950 rounded-xl text-sm font-sora font-bold hover:bg-gold-600 transition-all disabled:opacity-50">
          {saving ? 'Saving...' : place ? 'Update Place' : 'Create Place'}
        </button>
        <button type="button" onClick={onCancel}
          className="px-5 py-2 bg-white/5 text-white/60 rounded-xl text-sm font-inter hover:bg-white/10 transition-all">
          Cancel
        </button>
      </div>
    </form>
  );
}

function CalendarItemForm({ item, token, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: item?.title || '',
    description: item?.description || '',
    date: item?.date || '',
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
    const res = await fetchWithAuth(url, token, { method, body: JSON.stringify(form) });
    if (res.ok) onSave(await res.json());
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/5 rounded-xl p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Title</label>
          <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" required />
        </div>
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Type</label>
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50">
            <option value="event">Event</option>
            <option value="note">Note</option>
            <option value="reminder">Reminder</option>
            <option value="holiday">Holiday</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Date (YYYY-MM-DD)</label>
          <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" required />
        </div>
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Time</label>
          <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Description</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50 resize-none" />
        </div>
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Location</label>
          <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" />
        </div>
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Color</label>
          <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
            className="w-full h-10 bg-white/5 border border-white/10 rounded-lg cursor-pointer" />
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={saving}
          className="px-5 py-2 bg-gold-500 text-navy-950 rounded-xl text-sm font-sora font-bold hover:bg-gold-600 transition-all disabled:opacity-50">
          {saving ? 'Saving...' : item ? 'Update Item' : 'Create Item'}
        </button>
        <button type="button" onClick={onCancel}
          className="px-5 py-2 bg-white/5 text-white/60 rounded-xl text-sm font-inter hover:bg-white/10 transition-all">
          Cancel
        </button>
      </div>
    </form>
  );
}

function CategoryForm({ category, token, onSave, onCancel }) {
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
    const res = await fetchWithAuth(url, token, { method, body: JSON.stringify(form) });
    if (res.ok) onSave(await res.json());
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/5 rounded-xl p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">ID (key)</label>
          <input type="text" value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50"
            disabled={!!category} required />
        </div>
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Label</label>
          <input type="text" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" required />
        </div>
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Icon (emoji)</label>
          <input type="text" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-inter focus:outline-none focus:border-gold-500/50" required />
        </div>
        <div>
          <label className="block text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Color (hex)</label>
          <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
            className="w-full h-10 bg-white/5 border border-white/10 rounded-lg cursor-pointer" />
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={saving}
          className="px-5 py-2 bg-gold-500 text-navy-950 rounded-xl text-sm font-sora font-bold hover:bg-gold-600 transition-all disabled:opacity-50">
          {saving ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
        </button>
        <button type="button" onClick={onCancel}
          className="px-5 py-2 bg-white/5 text-white/60 rounded-xl text-sm font-inter hover:bg-white/10 transition-all">
          Cancel
        </button>
      </div>
    </form>
  );
}
