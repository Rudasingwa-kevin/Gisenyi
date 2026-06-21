import { motion } from 'framer-motion';
import { ShieldAlert, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminHeader() {
  const { username, logout } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 bg-navy-950/60 backdrop-blur-2xl border-b border-white/[0.04]"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20">
              <ShieldAlert className="w-4.5 h-4.5 text-navy-950" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-navy-950" />
          </div>
          <div>
            <span className="text-white font-sora font-bold text-sm tracking-tight">Admin Panel</span>
            <span className="text-white/25 text-xs font-inter ml-2 hidden sm:inline">
              {username}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="relative p-2 text-white/30 hover:text-white/60 transition-colors rounded-xl hover:bg-white/[0.04]">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold-500 rounded-full" />
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 text-white/40 hover:text-red-400 transition-all text-xs font-inter rounded-xl hover:bg-white/[0.04]"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
