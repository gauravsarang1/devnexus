
import React from 'react';
import { Home, Search, Users, MessageSquare, User } from 'lucide-react';

interface MobileNavProps {
  navigate?: (to: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ navigate }) => {
  const currentPath = window.location.pathname;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden w-[90%] max-w-[400px]">
      <div className="bg-slate-900 rounded-3xl p-3 flex justify-between items-center shadow-2xl border border-white/10 glass">
        <button 
          onClick={() => navigate?.('/home')}
          className={`p-3 rounded-2xl transition-colors ${currentPath === '/home' ? 'text-blue-400 bg-white/10' : 'text-slate-400'}`}
        >
          <Home size={22} />
        </button>
        <button 
          onClick={() => navigate?.('/search')}
          className={`p-3 rounded-2xl transition-colors ${currentPath === '/search' ? 'text-blue-400 bg-white/10' : 'text-slate-400'}`}
        >
          <Search size={22} />
        </button>
        <button 
          onClick={() => navigate?.('/matches')}
          className={`p-3 rounded-2xl transition-colors ${currentPath === '/matches' ? 'text-blue-400 bg-white/10' : 'text-slate-400'}`}
        >
          <Users size={22} />
        </button>
        <button 
          onClick={() => navigate?.('/chat')}
          className={`p-3 rounded-2xl transition-colors relative ${currentPath === '/chat' ? 'text-blue-400 bg-white/10' : 'text-slate-400'}`}
        >
          <MessageSquare size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>
        <button 
          onClick={() => navigate?.('/profile')}
          className={`p-3 rounded-2xl transition-colors ${currentPath === '/profile' ? 'text-blue-400 bg-white/10' : 'text-slate-400'}`}
        >
          <User size={22} />
        </button>
      </div>
    </div>
  );
};

export default MobileNav;
