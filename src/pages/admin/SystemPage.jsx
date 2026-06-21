import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Server, Activity, RefreshCw } from 'lucide-react';
import { fetchWithAuth, API } from '../../utils/admin';
import { AnimatedCard, AnimatedCardHeader } from '../../components/admin/AnimatedCard';
import { SkeletonDashboard } from '../../components/admin/SkeletonLoader';

export default function SystemPage() {
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${API}/system`);
      if (res.ok) setSystemInfo(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-sora font-bold text-white">System Health</h1>
          <p className="text-xs text-white/30 font-inter mt-0.5">Server and infrastructure status</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={load} className="flex items-center gap-2 px-3.5 py-2 bg-white/[0.04] text-white/50 rounded-xl text-xs font-inter hover:bg-white/[0.08] hover:text-white/70 transition-all border border-white/[0.06]">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </motion.button>
      </div>

      {loading && !systemInfo ? <SkeletonDashboard /> : !systemInfo ? null : (
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
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(systemInfo.memory.system.used / systemInfo.memory.system.total * 100)}%` }} transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/35 text-xs font-inter">Heap Used</span>
                  <span className="text-white/60 text-xs font-mono">{Math.round(systemInfo.memory.process.heapUsed / 1024 / 1024)} MB / {Math.round(systemInfo.memory.process.heapTotal / 1024 / 1024)} MB</span>
                </div>
                <div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (systemInfo.memory.process.heapUsed / systemInfo.memory.process.heapTotal * 100))}%` }} transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }} className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" />
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>
      )}
    </div>
  );
}
