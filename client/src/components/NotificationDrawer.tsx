
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import {
  X, Bell, MessageSquare, UserPlus, CheckCircle2, Sparkles, Clock, Info, Loader2, Star
} from 'lucide-react';
import { toast } from 'sonner';
import { notificationService } from '../services/notificationService';
import NotificationDrawerSkeleton from './skeleton/NotificationDrawerSkeleton';

const motion = m as any;

export type NotificationType = 'CHAT' | 'MATCH_REQUEST' | 'MATCH_ACCEPTED' | 'SYSTEM' | 'SKILL_UPDATE' | 'REVIEW';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  link: string;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  navigate: (to: string) => void;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen, onClose, notifications, setNotifications, setUnreadCount, navigate
}) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isFetching || !isOpen) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        handleLoadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [isFetching, hasMore, isOpen]);

  // Reset pagination when drawer opens
  useEffect(() => {
    if (isOpen) {
      setPage(1);
      setHasMore(true);
    }
  }, [isOpen]);

  const handleLoadMore = async () => {
    if (isFetching || !hasMore) return;
    setIsFetching(true);
    try {
      const nextPage = page + 1;
      const res = await notificationService.getNotifications(nextPage, 15);

      // Filter out notifications we already have from real-time updates
      const newItems = res.notifications.filter(
        n => !notifications.some(existing => existing.id === n.id)
      );

      setNotifications(prev => [...prev, ...newItems]);
      setHasMore(res.pagination.hasNextPage);
      setPage(nextPage);
    } catch (err) { console.error(err); }
    finally { setIsFetching(false); }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (err) { toast.error("Update failed"); }
  };

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.isRead) {
      try {
        await notificationService.markRead(notification.id);
        setNotifications(prev => prev.map(n =>
          n.id === notification.id ? { ...n, isRead: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) { console.error("Mark read failed", err); }
    }
    onClose();
    navigate(notification.link);
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'CHAT': return <MessageSquare size={18} className="text-blue-500" />;
      case 'MATCH_REQUEST': return <UserPlus size={18} className="text-green-500" />;
      case 'MATCH_ACCEPTED': return <CheckCircle2 size={18} className="text-blue-600" />;
      case 'SYSTEM': return <Info size={18} className="text-amber-500" />;
      case 'SKILL_UPDATE': return <Sparkles size={18} className="text-purple-500" />;
      case 'REVIEW': return <Star size={18} className="text-yellow-500" />;
      default: return <Bell size={18} className="text-slate-400" />;
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

  const drawerVariants: any = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } },
    exit: { x: '100%' }
  };

  return (
    <AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
            />

            {/* Drawer */}
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-white shadow-2xl z-[70] flex flex-col overflow-hidden"
            >
              {/* HEADER */}
              <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Notifications
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={markAllRead}
                    className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 px-2 py-1 rounded-lg"
                  >
                    Mark all read
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-slate-900"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* CONTENT */}
              <div className="flex-grow overflow-y-auto px-3 py-4 custom-scrollbar">
                {isFetching && notifications.length === 0 ? (
                  <NotificationDrawerSkeleton />
                ) : notifications.length > 0 ? (
                  <>
                    {notifications.map((notif, i) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i < 15 ? i * 0.05 : 0 }}
                        onClick={() => handleNotificationClick(notif)}
                        className={`group p-4 rounded-[24px] cursor-pointer transition-all flex gap-4 border border-transparent ${notif.isRead
                            ? "hover:bg-slate-50"
                            : "bg-blue-50/40 border-blue-100/50"
                          }`}
                      >
                        <div className="w-11 h-11 bg-white rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm">
                          {getIcon(notif.type)}
                        </div>

                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-start mb-1 gap-2">
                            <h4
                              className={`text-sm truncate ${notif.isRead
                                  ? "text-slate-600 font-bold"
                                  : "text-slate-900 font-black"
                                }`}
                            >
                              {notif.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">
                              {formatTime(notif.createdAt)}
                            </span>
                          </div>
                          <p
                            className={`text-xs line-clamp-2 ${notif.isRead
                                ? "text-slate-400"
                                : "text-slate-500 font-medium"
                              }`}
                          >
                            {notif.message}
                          </p>
                        </div>
                      </motion.div>
                    ))}

                    <div ref={lastElementRef} className="h-10 flex items-center justify-center">
                      {isFetching && (
                        <Loader2 className="animate-spin text-blue-600" size={20} />
                      )}
                      {!hasMore && (
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                          End of history
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                    <Bell size={48} className="text-slate-200 mb-4" />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                      Inbox is clear
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </AnimatePresence>
  );
};

export default NotificationDrawer;
