
import React from 'react';
import { motion as m } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { User } from '../types';

// Cast motion to any to avoid property existence errors in JSX
const motion = m as any;

const DashboardHero: React.FC<{currentUser: User}> = ({currentUser}) => {

  //current time based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <section className="pt-32 md:pt-40 pb-8 px-4 md:px-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto bg-blue-50/50 border border-blue-100/50 rounded-[32px] p-8 md:p-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-blue-600" />
            <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">{getGreeting()}, {currentUser?.name}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
            Who would you like to build with today?
          </h1>
          <p className="text-slate-600 mb-8 max-w-md">
            You have 3 new matching requests for your <span className="text-blue-600 font-semibold">React.js</span> skills.
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-500/20 hover:scale-105 transition-all">
            Review Requests
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default DashboardHero;
