import React from 'react';
import { ArrowRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-primary pt-40 pb-20 text-white">
            <div className="max-w-7xl mx-auto px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-20 mb-40">
                    <div className="lg:col-span-2">
                        <span className="text-4xl font-sora font-extrabold text-gold tracking-tighter mb-10 block">GISENYI</span>
                        <p className="text-2xl text-soft-gray/40 font-light leading-relaxed max-w-xl">
                            Experience the pinnacle of African lakeside luxury. Where every sunrise is a masterpiece and every wave carries a secret.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-xs font-poppins font-bold text-gold uppercase tracking-[0.4em] mb-10">Discover</h4>
                        <ul className="space-y-6 text-soft-gray/60 font-inter text-lg">
                            <li><a href="#" className="hover:text-white transition-colors">The Riviera</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Volcanic Trails</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Beach Clubs</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-poppins font-bold text-gold uppercase tracking-[0.4em] mb-10">Connect</h4>
                        <ul className="space-y-6 text-soft-gray/60 font-inter text-lg">
                            <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Concierge</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center pt-20 border-t border-white/5 gap-8 text-[10px] font-poppins font-bold text-soft-gray/20 uppercase tracking-[0.3em]">
                    <span>© 2026 Gisenyi Tourism</span>
                    <div className="flex space-x-10">
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Sustainability</a>
                    </div>
                    <span>Data via OpenStreetMap</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
