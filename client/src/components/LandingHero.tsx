import React from 'react';
import { motion as m } from 'framer-motion';
import { ArrowRight, Play, Sparkles, Code, Palette } from 'lucide-react';

const motion = m as any;

interface LandingHeroProps {
  navigate: (to: string) => void;
}

const LandingHero: React.FC<LandingHeroProps> = ({ navigate }) => {
  return (
    <section className="relative pt-25 pb-16 sm:pt-28 sm:pb-20 lg:pt-35 lg:pb-32 overflow-hidden bg-white">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[360px] h-[360px] sm:w-[600px] sm:h-[600px] bg-blue-50 rounded-full blur-[100px] sm:blur-[120px] opacity-60 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-5 sm:mb-6">
            <Sparkles size={14} />
            <span>Built for India's Gen-Z</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold text-slate-900 leading-[1.15] mb-5 sm:mb-8">
            Swap Skills, <br />
            <span className="relative inline-block">
              <span className="relative z-10 text-blue-600">
                Build Your Future.
              </span>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute bottom-1 sm:bottom-2 left-0 h-2 sm:h-3 bg-blue-100 -z-0"
              />
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl mb-7 sm:mb-10">
            Trade your expertise in React for UI design, or share marketing tips
            for music production. No fees, no courses — just real peer-to-peer
            growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
            <button
              onClick={() => navigate('/home')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-base sm:text-lg font-bold transition-all hover:scale-105 shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group"
            >
              Get Early Access
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 text-slate-700 font-bold text-base sm:text-lg hover:text-blue-600 transition-colors">
              <Play size={18} fill="currentColor" />
              Explore Skills
            </button>
          </div>
        </motion.div>

        {/* RIGHT IMAGE (hidden on very small screens if needed later) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative bg-white rounded-3xl p-3 sm:p-4 shadow-2xl border border-slate-100 blue-glow">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
              className="rounded-2xl w-full aspect-[4/5] object-cover"
              alt="Community building"
            />

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute -top-5 -right-5 bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Code size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  Match Found!
                </p>
                <p className="text-sm font-bold text-slate-900">Python Dev</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3, delay: 1, ease: 'easeInOut' }}
              className="absolute -bottom-5 -left-5 bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Palette size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  Learning
                </p>
                <p className="text-sm font-bold text-slate-900">
                  UI/UX Mastery
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingHero;
