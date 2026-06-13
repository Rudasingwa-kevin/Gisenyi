import { MapPin, ArrowUpRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Footer = ({ onAdminClick }) => {
  const { isAdmin } = useAuth();
  return (
  <footer className="bg-navy-900 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-gold-500" />
            </div>
            <span className="text-2xl font-sora font-extrabold text-white">GISENYI<span className="text-gold-500">.</span></span>
          </div>
          <p className="text-white/40 font-inter text-lg leading-relaxed max-w-md">
            Experience the pinnacle of African lakeside luxury. Every sunrise is a masterpiece, every wave carries a secret.
          </p>
        </div>
        <div>
          <h4 className="text-[10px] font-poppins font-bold text-gold-500 uppercase tracking-[0.3em] mb-6">Explore</h4>
          <div className="space-y-3">
            {['Stays', 'Events', 'Map', 'History', 'Gallery'].map(item => (
              <Link key={item} to={`/${item.toLowerCase()}`} className="block text-white/50 hover:text-gold-500 transition-colors font-inter text-sm">
                {item}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-[10px] font-poppins font-bold text-gold-500 uppercase tracking-[0.3em] mb-6">Connect</h4>
          <div className="space-y-3 text-white/50 font-inter text-sm">
            <a href="#" className="flex items-center gap-2 hover:text-gold-500 transition-colors">Instagram <ArrowUpRight className="w-3 h-3" /></a>
            <a href="#" className="flex items-center gap-2 hover:text-gold-500 transition-colors">Email <ArrowUpRight className="w-3 h-3" /></a>
            <a href="#" className="flex items-center gap-2 hover:text-gold-500 transition-colors">Press <ArrowUpRight className="w-3 h-3" /></a>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4 text-[10px] font-poppins font-bold text-white/20 uppercase tracking-[0.2em]">
        <span>© 2026 Gisenyi Tourism</span>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white/40 transition-colors">Privacy</a>
          <a href="#" className="hover:text-white/40 transition-colors">Terms</a>
          <a href="#" className="hover:text-white/40 transition-colors">Data via OpenStreetMap</a>
          {isAdmin ? (
            <Link to="/admin" className="hover:text-gold-500 transition-colors flex items-center gap-1.5">
              <Shield className="w-3 h-3" /> Admin
            </Link>
          ) : (
            <button onClick={onAdminClick} className="hover:text-gold-500 transition-colors flex items-center gap-1.5">
              <Shield className="w-3 h-3" /> Admin
            </button>
          )}
        </div>
      </div>
    </div>
  </footer>
  );
};
 
export default Footer;
