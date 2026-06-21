import { useState, useEffect } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert, LogOut, ChevronRight, Bell, Menu, X,
  LayoutDashboard, MapPin, LayoutGrid, Calendar, Circle,
  ImageIcon, MessageSquare, Server, Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ToastProvider } from './Toast';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/places', label: 'Places', icon: MapPin },
  { path: '/admin/categories', label: 'Categories', icon: LayoutGrid },
  { path: '/admin/events', label: 'Events', icon: Calendar },
  { path: '/admin/calendar', label: 'Calendar', icon: Circle },
  { path: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { path: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
  { path: '/admin/system', label: 'System', icon: Server },
];

function SidebarLink({ item, isActive, onClick }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      onClick={onClick}
      className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-inter font-medium transition-colors duration-200 group"
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 bg-gradient-to-r from-gold-500/15 to-gold-500/5 border border-gold-500/20 rounded-xl"
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-3">
        <Icon className={`w-[18px] h-[18px] transition-colors ${isActive ? 'text-gold-500' : 'text-white/30 group-hover:text-white/60'}`} />
        <span className={`transition-colors ${isActive ? 'text-gold-400' : 'text-white/50 group-hover:text-white/80'}`}>
          {item.label}
        </span>
      </span>
    </Link>
  );
}

export default function AdminLayout() {
  const { username, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin) navigate('/');
  }, [isAdmin, navigate]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (!isAdmin) return null;

  return <ToastProvider><AdminLayoutInner location={location} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} username={username} logout={logout} /></ToastProvider>;
}

function AdminLayoutInner({ location, sidebarOpen, setSidebarOpen, username, logout }) {
  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  const breadcrumbs = location.pathname
    .replace('/admin', '')
    .split('/')
    .filter(Boolean);

  const breadcrumbLabels = {
    places: 'Places', categories: 'Categories', events: 'Events',
    calendar: 'Calendar', gallery: 'Gallery', feedback: 'Feedback',
    system: 'System', new: 'New', edit: 'Edit',
  };

  return (
    <div className="min-h-screen bg-[#030810] flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-[260px]
        bg-[#060B14] border-r border-white/[0.04]
        flex flex-col
        transition-transform duration-300 ease-out
        lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="px-5 h-16 flex items-center gap-3 border-b border-white/[0.04] shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20">
            <ShieldAlert className="w-4 h-4 text-navy-950" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-white font-sora font-bold text-sm tracking-tight block">Gisenyi</span>
            <span className="text-white/25 text-[10px] font-inter">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-white/30 hover:text-white/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto sidebar-scrollbar px-3 py-4 space-y-0.5">
          <p className="text-[9px] font-poppins font-bold text-white/20 uppercase tracking-[0.2em] px-3 mb-2">Navigation</p>
          {navItems.map((item) => (
            <SidebarLink
              key={item.path}
              item={item}
              isActive={isActive(item)}
              onClick={() => setSidebarOpen(false)}
            />
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-3 border-t border-white/[0.04] shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.02]">
            <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center border border-gold-500/10">
              <span className="text-gold-500 text-xs font-sora font-bold uppercase">
                {username?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-inter font-medium truncate">{username}</p>
              <p className="text-white/25 text-[10px] font-inter">Administrator</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="p-1.5 text-white/25 hover:text-red-400 transition-colors rounded-lg hover:bg-white/[0.04]"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 bg-[#030810]/80 backdrop-blur-xl border-b border-white/[0.04] flex items-center px-4 lg:px-6 gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-white/40 hover:text-white/70 transition-colors -ml-2 rounded-lg hover:bg-white/[0.04]"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs font-inter">
            <Link to="/admin" className="text-white/30 hover:text-white/60 transition-colors">Admin</Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-white/15" />
                <span className={i === breadcrumbs.length - 1 ? 'text-white/70 font-medium' : 'text-white/30'}>
                  {breadcrumbLabels[crumb] || crumb}
                </span>
              </span>
            ))}
          </nav>

          <div className="flex-1" />

          <button className="relative p-2 text-white/30 hover:text-white/60 transition-colors rounded-lg hover:bg-white/[0.04]">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold-500 rounded-full" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
