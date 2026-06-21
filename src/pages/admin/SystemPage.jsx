import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Database, Server, Activity, RefreshCw, HardDrive, Cpu, MemoryStick,
  Globe, Shield, Zap, Folder, Image, MessageSquare, MapPin, Calendar,
  LayoutGrid, Eye, CheckCircle, XCircle, AlertTriangle, Clock, Wifi,
  Gauge, BarChart3, Layers
} from 'lucide-react';
import { fetchWithAuth, API } from '../../utils/admin';
import { AnimatedCard, AnimatedCardHeader } from '../../components/admin/AnimatedCard';
import { SkeletonDashboard } from '../../components/admin/SkeletonLoader';

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function CircularGauge({ value, max = 100, size = 80, strokeWidth = 6, color = '#C9A84C', label }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const offset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={strokeWidth} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-sora font-bold text-sm">{typeof value === 'number' ? value.toFixed(1) : value}%</span>
        </div>
      </div>
      {label && <span className="text-[10px] text-white/30 font-inter uppercase tracking-wider">{label}</span>}
    </div>
  );
}

function StatusBadge({ ok, label }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-inter font-medium ${ok ? 'bg-green-500/10 text-green-400 border border-green-500/15' : 'bg-red-500/10 text-red-400 border border-red-500/15'}`}>
      {ok ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {label}
    </span>
  );
}

function MetricRow({ label, value, sub, icon: Icon }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/[0.03] last:border-0">
      <div className="flex items-center gap-2.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-white/20" />}
        <span className="text-white/40 text-xs font-inter">{label}</span>
      </div>
      <div className="text-right">
        <span className="text-white/70 text-xs font-mono">{value}</span>
        {sub && <span className="text-white/25 text-[10px] font-inter ml-1.5">{sub}</span>}
      </div>
    </div>
  );
}

export default function SystemPage() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${API}/system`);
      if (res.ok) {
        const data = await res.json();
        setInfo(data);
        setLastRefresh(new Date());
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const avgCpu = useMemo(() => {
    if (!info?.server?.cpuUsage?.length) return 0;
    const sum = info.server.cpuUsage.reduce((a, b) => a + parseFloat(b), 0);
    return sum / info.server.cpuUsage.length;
  }, [info]);

  const dbConnected = info?.database?.status === 'connected';
  const healthScore = useMemo(() => {
    if (!info) return 0;
    let score = 0;
    if (dbConnected) score += 40;
    if (info.database.pingMs < 100) score += 15;
    else if (info.database.pingMs < 500) score += 10;
    const memUsedPercent = info.memory.system.used / info.memory.system.total;
    if (memUsedPercent < 0.8) score += 20;
    else if (memUsedPercent < 0.9) score += 10;
    if (avgCpu < 70) score += 15;
    else if (avgCpu < 90) score += 8;
    if (info.server.uptime > 3600) score += 10;
    return Math.min(100, score);
  }, [info, dbConnected, avgCpu]);

  const healthColor = healthScore >= 80 ? '#22c55e' : healthScore >= 50 ? '#eab308' : '#ef4444';
  const healthLabel = healthScore >= 80 ? 'Healthy' : healthScore >= 50 ? 'Degraded' : 'Critical';

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-sora font-bold text-white">System Health</h1>
          <p className="text-xs text-white/30 font-inter mt-0.5">
            {lastRefresh ? `Last updated ${lastRefresh.toLocaleTimeString()}` : 'Loading system diagnostics...'}
          </p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={load} className="flex items-center gap-2 px-3.5 py-2 bg-white/[0.04] text-white/50 rounded-xl text-xs font-inter hover:bg-white/[0.08] hover:text-white/70 transition-all border border-white/[0.06]">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </motion.button>
      </div>

      {loading && !info ? <SkeletonDashboard /> : !info ? null : (
        <>
          {/* Health Score Banner */}
          <AnimatedCard delay={0}>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <CircularGauge value={healthScore} size={100} strokeWidth={8} color={healthColor} />
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                  <h2 className="text-lg font-sora font-bold text-white">System Status</h2>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-poppins font-bold uppercase tracking-wider" style={{ backgroundColor: `${healthColor}15`, color: healthColor, border: `1px solid ${healthColor}25` }}>
                    {healthLabel}
                  </span>
                </div>
                <p className="text-xs text-white/35 font-inter">
                  {healthScore >= 80 ? 'All systems operating normally.' : healthScore >= 50 ? 'Some services may be degraded.' : 'Critical issues detected. Immediate attention required.'}
                </p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                  <StatusBadge ok={dbConnected} label="Database" />
                  <StatusBadge ok={info.services?.auth?.configured} label="Auth" />
                  <StatusBadge ok={info.services?.cloudinary?.configured} label="Cloudinary" />
                  <StatusBadge ok={info.services?.supabase?.configured} label="Supabase" />
                  <StatusBadge ok={info.services?.tracking?.configured} label="Tracking" />
                </div>
              </div>
              <div className="hidden md:flex flex-col items-end gap-1 text-right">
                <div className="text-2xl font-sora font-extrabold text-white">{info.content?.visits?.toLocaleString() || 0}</div>
                <div className="text-[10px] font-poppins font-bold text-white/30 uppercase tracking-[0.15em]">Total Visits</div>
              </div>
            </div>
          </AnimatedCard>

          {/* CPU + Memory Gauges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <AnimatedCard delay={0.05} className="flex flex-col items-center py-5">
              <CircularGauge value={avgCpu} color={avgCpu > 80 ? '#ef4444' : avgCpu > 60 ? '#eab308' : '#C9A84C'} />
              <p className="text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.15em] mt-2">CPU Usage</p>
              <p className="text-[10px] text-white/20 font-inter">{info.server.cpus} cores</p>
            </AnimatedCard>
            <AnimatedCard delay={0.1} className="flex flex-col items-center py-5">
              <CircularGauge value={(info.memory.process.heapUsed / info.memory.process.heapTotal * 100)} color="#3b82f6" />
              <p className="text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.15em] mt-2">Heap Used</p>
              <p className="text-[10px] text-white/20 font-inter">{formatBytes(info.memory.process.heapUsed)}</p>
            </AnimatedCard>
            <AnimatedCard delay={0.15} className="flex flex-col items-center py-5">
              <CircularGauge value={(info.memory.system.used / info.memory.system.total * 100)} color={info.memory.system.used / info.memory.system.total > 0.85 ? '#ef4444' : '#C9A84C'} />
              <p className="text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.15em] mt-2">System RAM</p>
              <p className="text-[10px] text-white/20 font-inter">{formatBytes(info.memory.system.used)} / {formatBytes(info.memory.system.total)}</p>
            </AnimatedCard>
            <AnimatedCard delay={0.2} className="flex flex-col items-center py-5">
              <CircularGauge value={info.database.pingMs ? Math.min(100, (1 - info.database.pingMs / 1000) * 100) : 0} color={info.database.pingMs < 100 ? '#22c55e' : info.database.pingMs < 500 ? '#eab308' : '#ef4444'} />
              <p className="text-[10px] font-poppins font-bold text-white/40 uppercase tracking-[0.15em] mt-2">DB Latency</p>
              <p className="text-[10px] text-white/20 font-inter">{info.database.pingMs}ms</p>
            </AnimatedCard>
          </div>

          {/* Database + Server + Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {/* Database */}
            <AnimatedCard delay={0.1}>
              <AnimatedCardHeader icon={Database} title="Database" subtitle={dbConnected ? 'Connected' : 'Disconnected'} />
              <div className="space-y-0">
                <MetricRow label="Status" value={dbConnected ? 'Connected' : 'Disconnected'} icon={Wifi} />
                <MetricRow label="Ping" value={`${info.database.pingMs}ms`} icon={Zap} />
                <MetricRow label="Size" value={info.database.size} icon={HardDrive} />
                <MetricRow label="Tables" value={info.database.tables?.length || 0} icon={Layers} />
              </div>
              {info.database.tables?.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/[0.04]">
                  <p className="text-[9px] font-poppins font-bold text-white/25 uppercase tracking-[0.15em] mb-2">Table Sizes</p>
                  <div className="space-y-1.5">
                    {info.database.tables.map(t => (
                      <div key={t.table_name} className="flex items-center justify-between">
                        <span className="text-white/40 text-[11px] font-inter truncate">{t.table_name}</span>
                        <span className="text-white/25 text-[10px] font-mono shrink-0 ml-2">{t.total_size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </AnimatedCard>

            {/* Server */}
            <AnimatedCard delay={0.15}>
              <AnimatedCardHeader icon={Server} title="Server" />
              <div className="space-y-0">
                <MetricRow label="Uptime" value={formatUptime(info.server.uptime)} icon={Clock} />
                <MetricRow label="Node.js" value={info.server.nodeVersion} icon={Activity} />
                <MetricRow label="Environment" value={info.server.env} icon={Globe} />
                <MetricRow label="Platform" value={`${info.server.platform} (${info.server.arch})`} icon={Server} />
                <MetricRow label="Hostname" value={info.server.hostname} icon={Globe} />
                <MetricRow label="PID" value={info.server.pid} />
                <MetricRow label="CPU" value={info.server.cpuModel} icon={Cpu} />
                <MetricRow label="CPU Speed" value={`${info.server.cpuSpeed} MHz`} icon={Gauge} />
              </div>
              {info.server.loadAverage && (
                <div className="mt-4 pt-3 border-t border-white/[0.04]">
                  <p className="text-[9px] font-poppins font-bold text-white/25 uppercase tracking-[0.15em] mb-2">Load Average</p>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(info.server.loadAverage).map(([key, val]) => (
                      <div key={key} className="text-center">
                        <span className="text-white/60 text-sm font-sora font-bold block">{val}</span>
                        <span className="text-white/20 text-[9px] font-inter">{key}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </AnimatedCard>

            {/* Content Overview */}
            <AnimatedCard delay={0.2}>
              <AnimatedCardHeader icon={Folder} title="Content" subtitle={`${(info.content?.visits || 0).toLocaleString()} total visits`} />
              <div className="space-y-2">
                {[
                  { label: 'Places', value: info.content?.places, icon: MapPin, color: 'text-gold-500' },
                  { label: 'Events', value: info.content?.events, icon: Calendar, color: 'text-purple-400' },
                  { label: 'Categories', value: info.content?.categories, icon: LayoutGrid, color: 'text-blue-400' },
                  { label: 'Calendar Items', value: info.content?.calendar, icon: Calendar, color: 'text-cyan-400' },
                  { label: 'Gallery Items', value: info.content?.gallery, icon: Image, color: 'text-pink-400' },
                  { label: 'Feedback', value: info.content?.feedback, icon: MessageSquare, color: 'text-green-400' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  const maxVal = Math.max(...[info.content?.places, info.content?.events, info.content?.categories, info.content?.calendar, info.content?.gallery, info.content?.feedback].filter(Boolean), 1);
                  return (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                          <span className="text-white/40 text-xs font-inter">{item.label}</span>
                        </div>
                        <span className="text-white/60 text-xs font-mono">{item.value || 0}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${((item.value || 0) / maxVal) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.3 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full bg-gradient-to-r from-gold-500/40 to-gold-500/20 rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </AnimatedCard>
          </div>

          {/* Memory Details */}
          <AnimatedCard delay={0.25}>
            <AnimatedCardHeader icon={MemoryStick} title="Memory Breakdown" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-[9px] font-poppins font-bold text-white/25 uppercase tracking-[0.15em] mb-3">System Memory</p>
                <div className="space-y-3">
                  {[
                    { label: 'Used', value: info.memory.system.used, color: 'from-gold-500 to-gold-400' },
                    { label: 'Free', value: info.memory.system.free, color: 'from-green-500 to-green-400' },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-white/35 text-xs font-inter">{item.label}</span>
                        <span className="text-white/50 text-xs font-mono">{formatBytes(item.value)}</span>
                      </div>
                      <div className="w-full h-2 bg-white/[0.03] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.value / info.memory.system.total) * 100}%` }}
                          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] font-poppins font-bold text-white/25 uppercase tracking-[0.15em] mb-3">Process Memory</p>
                <div className="space-y-3">
                  {[
                    { label: 'RSS', value: info.memory.process.rss, color: 'from-blue-500 to-blue-400' },
                    { label: 'Heap Used', value: info.memory.process.heapUsed, color: 'from-purple-500 to-purple-400' },
                    { label: 'Heap Total', value: info.memory.process.heapTotal, color: 'from-white/20 to-white/10' },
                    { label: 'External', value: info.memory.process.external, color: 'from-cyan-500 to-cyan-400' },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-white/35 text-xs font-inter">{item.label}</span>
                        <span className="text-white/50 text-xs font-mono">{formatBytes(item.value)}</span>
                      </div>
                      <div className="w-full h-2 bg-white/[0.03] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (item.value / (info.memory.process.heapTotal || 1)) * 100)}%` }}
                          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedCard>

          {/* CPU Per-Core */}
          {info.server.cpuUsage?.length > 0 && (
            <AnimatedCard delay={0.3}>
              <AnimatedCardHeader icon={Cpu} title="CPU Cores" subtitle={`${info.server.cpus} cores`} />
              <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-2">
                {info.server.cpuUsage.map((usage, i) => {
                  const val = parseFloat(usage);
                  const color = val > 80 ? '#ef4444' : val > 60 ? '#eab308' : '#22c55e';
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35 + i * 0.03 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="relative w-8 h-8">
                        <svg width={32} height={32} className="-rotate-90">
                          <circle cx={16} cy={16} r={12} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={3} />
                          <circle cx={16} cy={16} r={12} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeDasharray={2 * Math.PI * 12} strokeDashoffset={2 * Math.PI * 12 * (1 - val / 100)} />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[8px] text-white/50 font-mono">{Math.round(val)}</span>
                        </div>
                      </div>
                      <span className="text-[8px] text-white/20 font-inter">C{i}</span>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatedCard>
          )}
        </>
      )}
    </div>
  );
}
