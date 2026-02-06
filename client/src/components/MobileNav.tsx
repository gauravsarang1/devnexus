import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Users, 
  MessageSquare, 
  User, 
  PlusSquare, 
  Briefcase 
} from 'lucide-react';

const MobileNav: React.FC = () => {
  // Navigation items configuration
  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/posts', icon: PlusSquare, label: 'Posts' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/projects', icon: Briefcase, label: 'Projects' },
    { path: '/matches', icon: Users, label: 'Matches' },
    { path: '/chat', icon: MessageSquare, label: 'Chat', hasNotification: true },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md md:hidden">
      <div className="bg-slate-900/80 backdrop-blur-lg border border-white/10 rounded-3xl p-2 shadow-2xl flex justify-between items-center px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              relative p-2.5 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center
              ${isActive 
                ? 'text-blue-400 bg-blue-500/10 scale-110' 
                : 'text-slate-400 hover:text-slate-200'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                
                {/* Notification Dot for Chat */}
                {item.hasNotification && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-900" />
                )}

                {/* Active Indicator Dot under the icon */}
                {isActive && (
                  <span className="absolute -bottom-1 w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;