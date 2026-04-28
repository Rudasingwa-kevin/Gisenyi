import React from 'react';
import Hero from '../components/Hero';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SectionTeaser = ({ title, desc, link, linkText, image }) => (
    <div className="py-32 border-b border-white/5 last:border-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="font-sora text-5xl font-extrabold mb-6">{title}</h2>
                <p className="text-xl text-muted-text font-light mb-10 leading-relaxed">{desc}</p>
                <Link to={link} className="inline-flex items-center text-gold font-poppins font-bold uppercase tracking-widest group">
                    {linkText} <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-2" />
                </Link>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="aspect-video rounded-[3rem] overflow-hidden shadow-2xl"
            >
                <img src={image} className="w-full h-full object-cover" loading="lazy" />
            </motion.div>
        </div>
    </div>
);

const HomePage = () => {
    return (
        <div>
            <Hero />
            <section className="py-40 px-8 max-w-7xl mx-auto">
                <SectionTeaser 
                    title="A Legacy of Fire & Water"
                    desc="From volcanic genesis to the modern renaissance, Gisenyi's soul is etched into the very shores of Lake Kivu. Explore the chronicles of Rwanda's most resilient city."
                    link="/history"
                    linkText="Discover History"
                    image="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200"
                />
                <SectionTeaser 
                    title="Curated Destinations"
                    desc="Experience the pinnacle of African lakeside luxury. From boutique resorts to world-class dining, discover the best Gisenyi has to offer."
                    link="/stays"
                    linkText="View Stays"
                    image="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200"
                />
                <SectionTeaser 
                    title="Endless Adventure"
                    desc="From kayaking on Lake Kivu to exploring volcanic trails and cultural museums, Gisenyi is a playground for the adventurous soul."
                    link="/stays"
                    linkText="Explore Activities"
                    image="https://images.unsplash.com/photo-1540541338287-41700207eda5?auto=format&fit=crop&q=80&w=1200"
                />
                <SectionTeaser 
                    title="Interactive Exploration"
                    desc="Navigate the shoreline with real-time data powered by OpenStreetMap. Find your way to hidden gems and iconic landmarks."
                    link="/map"
                    linkText="Open Map"
                    image="https://images.unsplash.com/photo-1540541338287-41700207eda5?auto=format&fit=crop&q=80&w=1200"
                />
            </section>
        </div>
    );
};

export default HomePage;
