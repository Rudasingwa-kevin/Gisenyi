import { motion } from 'framer-motion';
import { LayoutDashboard, MapPin, LayoutGrid, Calendar, Circle, ImageIcon, MessageSquare, Server } from 'lucide-react';
import { cn } from '../../utils/helpers';

const tabs = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'places', label: 'Places', icon: MapPin },
  { key: 'categories', label: 'Categories', icon: LayoutGrid },
  { key: 'events', label: 'Events', icon: Calendar },
  { key: 'calendar', label: 'Calendar', icon: Circle },
  { key: 'gallery', label: 'Gallery', icon: ImageIcon },
  { key: 'feedback', label: 'Feedback', icon: MessageSquare },
  { key: 'system', label: 'System', icon: Server },
];

export default function TabNavigation({ activeTab, onTabChange }) {
  return (
    <div className="relative">
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 -mb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={cn(
                'relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-inter font-semibold transition-colors duration-200 whitespace-nowrap',
                isActive ? 'text-navy-950' : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-gold-500 to-gold-400 rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
