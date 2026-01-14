
import React from 'react';

interface LandingNavbarProps {
  navigate: (to: string) => void;
}

const LandingNavbar: React.FC<LandingNavbarProps> = ({ navigate }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-6 flex justify-between items-center">
    
    {/* Logo */}
    <div
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => navigate('/')}
    >
      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white rounded-sm rotate-45" />
      </div>

      <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
        SkillSwap
      </span>
    </div>

    {/* Actions */}
    <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
      
      {/* Desktop-only link */}
      <a
        href="#how-it-works"
        className="hidden md:block text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
      >
        How it works
      </a>

      {/* Login */}
      <button
        onClick={() => navigate('/login')}
        className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors px-2"
      >
        Login
      </button>

      {/* CTA */}
      <button
        onClick={() => navigate('/register')}
        className="
          bg-blue-600 hover:bg-blue-700
          text-white
          px-4 sm:px-6
          py-2 sm:py-2.5
          rounded-full
          text-sm font-semibold
          transition-all
          shadow-md sm:shadow-lg shadow-blue-500/20
        "
      >
        Get Started
      </button>
    </div>
  </div>
</nav>

  );
};

export default LandingNavbar;
