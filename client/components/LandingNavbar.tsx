
import React from 'react';

interface LandingNavbarProps {
  navigate: (to: string) => void;
}

const LandingNavbar: React.FC<LandingNavbarProps> = ({ navigate }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-6 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">SkillSwap</span>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <a href="#how-it-works" className="hidden md:block text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">How it works</a>
          <button 
            onClick={() => navigate('/login')}
            className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-500/20"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
