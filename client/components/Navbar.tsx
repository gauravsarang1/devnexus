
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, ChevronDown, User as UserIcon, LogOut, Settings, Loader2 } from 'lucide-react';
import NotificationDrawer, { NotificationItem } from './NotificationDrawer';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { authService } from '../services/authService';
import { notificationService } from '../services/notificationService';
import { User, SocketNotificationPayload, SocketPresencePayload } from '../src/types';

interface NavbarProps {
  navigate?: (to: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ navigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    let socket: Socket | null = null;

    const init = async () => {
      const res = await authService.me();
      if (!res.success || !res.data) return;
      
      const user = res.data;
      setCurrentUser(user);

      // Load initial persistent notifications
      try {
        const [notifsRes, countRes] = await Promise.all([
          notificationService.getNotifications(1, 15),
          notificationService.getUnreadCount()
        ]);
        setNotifications(notifsRes.notifications);
        setUnreadCount(countRes);
      } catch (err) { console.error("Notif error", err); }

      socket = io(import.meta.env.VITE_API_URL!, {
        transports: ['websocket']
      });

      socket.on('connect', () => {
        socket?.emit('hello', { id: user.id, name: user.name });
      });

      socket.on('notification', (data: SocketNotificationPayload) => {
        // Socket notifications will have random IDs until next reload where they get DB IDs
        const newNotif: NotificationItem = {
          id: Math.random().toString(36).substr(2, 9),
          type: data.type,
          title: data.title,
          message: data.message,
          createdAt: new Date().toISOString(),
          isRead: false,
          link: data.link
        };

        setNotifications(prev => [newNotif, ...prev]);
        setUnreadCount(prev => prev + 1);

        if (Notification.permission === 'granted' && document.visibilityState !== 'visible') {
           if ('serviceWorker' in navigator) {
             navigator.serviceWorker.ready.then(registration => {
               registration.showNotification(data.title, {
                 body: data.message,
                 icon: 'https://cdn-icons-png.flaticon.com/512/1160/1160358.png',
                 data: { link: data.link }
               });
             });
           }
        }

        if (data.type === 'MATCH_ACCEPTED') {
          toast.success(data.title, { description: data.message });
        } else if (data.type === 'MATCH_REQUEST') {
          toast.info(data.title, { description: data.message });
        } else {
          toast(data.title, { description: data.message });
        }
      });

      socket.on('userJoined', (data: SocketPresencePayload) => {
        if (data.userId !== user.id) {
          toast(`A new builder joined the community!`, { icon: '👋' });
        }
      });
    };

    init();
    return () => { socket?.disconnect(); };
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const logoutToast = toast.loading('Signing out gracefully...');
    try {
      await authService.logout();
      toast.success('Signed out successfully', { id: logoutToast });
      if (navigate) navigate('/');
      else window.location.href = '/';
    } catch (err) {
      toast.error('Error during sign out', { id: logoutToast });
    } finally {
      setIsLoggingOut(false);
      setIsDropdownOpen(false);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-3 glass shadow-sm border-b border-slate-100' : 'py-5 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center gap-4">
          <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer" onClick={() => navigate?.('/home')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">SkillSwap</span>
          </div>

          <div className="hidden md:flex flex-grow max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search skills, people, or projects..." 
              onClick={() => navigate?.('/search')}
              readOnly
              className="w-full bg-slate-100 border-none rounded-full py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <button 
              onClick={() => setIsNotifDrawerOpen(true)}
              className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors group"
            >
              <Bell size={22} className="group-active:scale-90 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white text-[8px] font-black text-white flex items-center justify-center animate-in fade-in zoom-in">
                  {unreadCount}
                </span>
              )}
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-1 pr-2 hover:bg-slate-100 rounded-full transition-all border border-transparent hover:border-slate-200"
              >
                <img src={currentUser?.avatar || `https://picsum.photos/seed/${currentUser?.uId || 'user'}/100/100`} className="w-8 h-8 rounded-full object-cover" alt="User" />
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-50 mb-1">
                    <p className="text-sm font-bold text-slate-900">{currentUser?.name || 'User'}</p>
                    <p className="text-xs text-slate-500">@{currentUser?.uId || 'username'}</p>
                  </div>
                  <button onClick={() => { navigate?.('/profile'); setIsDropdownOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors text-left"><UserIcon size={16} /> Profile</button>
                  <button onClick={() => { navigate?.('/settings'); setIsDropdownOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors text-left"><Settings size={16} /> Settings</button>
                  <button 
                    onClick={handleLogout} 
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left disabled:opacity-50"
                  >
                    {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />} Sign out
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <NotificationDrawer 
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        notifications={notifications}
        setNotifications={setNotifications}
        setUnreadCount={setUnreadCount}
        navigate={navigate || (() => {})}
      />
    </>
  );
};

export default Navbar;
