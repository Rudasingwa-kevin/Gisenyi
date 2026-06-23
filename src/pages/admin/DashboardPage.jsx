import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, LayoutGrid, Calendar, Circle, MessageSquare, Activity,
  Building2, Sparkles, Clock, ChevronRight, TrendingUp, Eye,
  BarChart3, Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchWithAuth, API } from '../../utils/admin';
import { formatDate } from '../../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import StatCard from '../../components/admin/StatCard';
import { AnimatedCard, AnimatedCardHeader } from '../../components/admin/AnimatedCard';
import { SkeletonDashboard } from '../../components/admin/SkeletonLoader';
import EmptyState from '../../components/admin/EmptyState';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-dark rounded-xl px-3 py-2 border border-white/10 shadow-xl">
      <p className="text-[10px] text-white/40 font-inter mb-0.5">{label}</p>
      <p className="text-sm text-gold-500 font-sora font-bold">{payload[0].value}</p>
    </div>
  );
};

export default function DashboardPage() {
  const { username } = useAuth();
  const [stats, setStats] = useState(null);
  const [visitorStats, setVisitorStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [placesRes, catRes, eventsRes, calRes, fbRes, visRes] = await Promise.all([
        fetchWithAuth(`${API}/places?limit=500`),
        fetchWithAuth(`${API}/categories?limit=500`),
        fetchWithAuth(`${API}/events?limit=500`),
        fetchWithAuth(`${API}/calendar?limit=500`),
        fetchWithAuth(`${API}/feedback?limit=500`),
        fetchWithAuth(`${API}/visitor-stats`),
      ]);

      const places = placesRes.ok ? (await placesRes.json()).data || [] : [];
      const categories = catRes.ok ? (await catRes.json()).data || [] : [];
      const events = eventsRes.ok ? (await eventsRes.json()).data || [] : [];
      const calendar = calRes.ok ? (await calRes.json()).data || [] : [];
      const feedback = fbRes.ok ? (await fbRes.json()).data || [] : [];
      const visitors = visRes.ok ? await visRes.json() : null;

      setStats({ places, categories, events, calendar, feedback });
      setVisitorStats(visitors);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadAll(); }, [loadAll]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-sora font-bold text-white"
          >
            Welcome back, {username}
          </motion.h1>
          <p className="text-sm font-inter text-white/30 mt-1">Here's what's happening with your platform</p>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Link to="/admin/places/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 rounded-xl text-sm font-sora font-bold hover:from-gold-400 hover:to-gold-300 hover:shadow-lg hover:shadow-gold-500/20 transition-all">
            <Plus className="w-4 h-4" /> Add Place
          </Link>
        </motion.div>
      </div>

      {loading ? (
        <SkeletonDashboard />
      ) : stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatCard icon={MapPin} label="Places" value={stats.places.length} color="gold" delay={0} />
            <StatCard icon={LayoutGrid} label="Categories" value={stats.categories.length} color="blue" delay={0.06} />
            <StatCard icon={Calendar} label="Events" value={stats.events.length} color="purple" delay={0.12} />
            <StatCard icon={Circle} label="Calendar" value={stats.calendar.length} color="cyan" delay={0.18} />
            <StatCard icon={MessageSquare} label="Feedback" value={stats.feedback.length} color="green" delay={0.24} />
            <StatCard icon={Eye} label="Total Visits" value={visitorStats?.totalVisits ?? 0} color="gold" delay={0.30} />
            <StatCard icon={Activity} label="Visitors" value={visitorStats?.uniqueVisitors ?? 0} color="red" delay={0.36} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
            <AnimatedCard delay={0.12}>
              <AnimatedCardHeader icon={Building2} title="Recent Places" action={
                <Link to="/admin/places" className="text-[10px] font-inter text-gold-500/60 hover:text-gold-500 transition-colors">View all</Link>
              } />
              {stats.places.length === 0 ? (
                <EmptyState icon={MapPin} title="No places yet" />
              ) : (
                <div className="space-y-2">
                  {stats.places.slice(0, 5).map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.05 }}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors group"
                    >
                      {p.image && <img src={p.image} alt="" className="w-9 h-9 rounded-lg object-cover bg-navy-800 border border-white/[0.06]" />}
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

            <AnimatedCard delay={0.18}>
              <AnimatedCardHeader icon={Sparkles} title="Upcoming Events" action={
                <Link to="/admin/events" className="text-[10px] font-inter text-gold-500/60 hover:text-gold-500 transition-colors">View all</Link>
              } />
              {stats.events.length === 0 ? (
                <EmptyState icon={Calendar} title="No events yet" />
              ) : (
                <div className="space-y-2">
                  {stats.events.slice(0, 5).map((e, i) => (
                    <motion.div
                      key={e.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors group"
                    >
                      {e.image && <img src={e.image} alt="" className="w-9 h-9 rounded-lg object-cover bg-navy-800 border border-white/[0.06]" />}
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
            <AnimatedCard delay={0.22}>
              <AnimatedCardHeader icon={BarChart3} title="Daily Visits" subtitle="Last 30 days" />
              {visitorStats?.daily?.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={visitorStats.daily} barCategoryGap="25%">
                    <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} tickFormatter={v => v.slice(5)} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                    <Bar dataKey="count" fill="url(#goldGrad)" radius={[6, 6, 0, 0]} />
                    <defs>
                      <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
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

            <AnimatedCard delay={0.28}>
              <AnimatedCardHeader icon={TrendingUp} title="Visit Trend" />
              {visitorStats?.daily?.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={visitorStats.daily}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C9A84C" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#C9A84C" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} tickFormatter={v => v.slice(5)} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="count" stroke="#C9A84C" strokeWidth={2.5} fill="url(#areaGrad)" dot={false} activeDot={{ r: 5, fill: '#C9A84C', stroke: '#030810', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-white/20 text-sm font-inter">No visit data yet</div>
              )}
            </AnimatedCard>
          </div>

          <AnimatedCard delay={0.32}>
            <AnimatedCardHeader icon={TrendingUp} title="Top Pages" />
            {visitorStats?.topPages?.length > 0 ? (
              <div className="space-y-2.5">
                {visitorStats.topPages.map((p, i) => (
                  <motion.div
                    key={p.page}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.04 }}
                    className="flex items-center gap-3 group"
                  >
                    <span className="text-white/20 text-xs font-mono w-5 text-right">{i + 1}</span>
                    <div className="flex-1 h-7 bg-white/[0.02] rounded-lg overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(p.count / (visitorStats.topPages[0]?.count || 1)) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.4 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
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
        </>
      )}
    </div>
  );
}
