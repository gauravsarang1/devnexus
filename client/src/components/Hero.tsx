
import React from 'react';
import { motion as m } from 'framer-motion';
import { ArrowRight, Sparkles, Code, Palette, Play } from 'lucide-react';

// Cast motion to any to avoid property existence errors in JSX
const motion = m as any;

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] opacity-60 -z-10"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] opacity-40 -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} />
            <span>Redefining learning for Gen-Z</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8">
            Don't just watch. <br />
            <span className="relative inline-block">
              <span className="relative z-10 text-blue-600">Swap & Build.</span>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute bottom-2 left-0 h-3 bg-blue-100 -z-0"
              />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl mb-10">
            The premium skill-exchange marketplace. Trade your expertise in React for UI design, or share marketing tips for music production. No fees, just real growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all hover:scale-105 shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group">
              Get Early Access
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-slate-700 font-bold hover:text-blue-600 transition-colors">
              <Play size={18} fill="currentColor" />
              Explore Skills
            </button>
          </div>

          <div className="mt-12 flex items-center gap-4 text-slate-400">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <img key={i} src={`https://picsum.photos/seed/${i + 10}/100/100`} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="user" />
              ))}
            </div>
            <p className="text-sm">Join <span className="text-slate-900 font-bold">2,000+</span> early birds in India</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Mockup Card Container */}
          <div className="relative bg-white rounded-3xl p-4 shadow-2xl border border-slate-100 blue-glow">
            <img src="https://picsum.photos/seed/skillswap_dash/800/1000" className="rounded-2xl w-full h-[500px] object-cover" alt="App interface" />
            
            {/* Floating UI Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Code size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Match Found!</p>
                <p className="text-sm font-bold text-slate-900">Python Expert</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3, delay: 1, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Palette size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Wants to Learn</p>
                <p className="text-sm font-bold text-slate-900">Figma Mastery</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
