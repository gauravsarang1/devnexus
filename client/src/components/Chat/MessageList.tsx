
import React, { useCallback, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCheck, Clock, Loader2, Calendar } from 'lucide-react';
import { ChatMessage, User } from '../../types';

interface MessageListProps {
  messages: ChatMessage[];
  currentUser: User | null;
  partner: any;
  isPartnerTyping: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isFetchingMore?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, currentUser, partner, isPartnerTyping, scrollRef,
  hasMore, onLoadMore, isFetchingMore
}) => {
  const observer = useRef<IntersectionObserver | null>(null);
  
  const topRef = useCallback((node: HTMLDivElement | null) => {
    if (isFetchingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && onLoadMore) {
        onLoadMore();
      }
    }, { threshold: 0.1 });

    if (node) observer.current.observe(node);
  }, [isFetchingMore, hasMore, onLoadMore]);

  const StatusIcon = ({ status }: { status?: string }) => {
    switch (status) {
      case 'READ': return <CheckCheck size={12} className="text-blue-500" />;
      case 'DELIVERED': return <CheckCheck size={12} className="text-slate-300" />;
      case 'SENT': return <Check size={12} className="text-slate-300" />;
      default: return <Clock size={10} className="text-slate-300" />;
    }
  };

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString([], { month: 'long', day: 'numeric', year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
  };

  return (
    <div ref={scrollRef} className="flex-grow overflow-y-auto px-4 py-8 md:px-12 space-y-2 scroll-smooth pb-32 custom-scrollbar bg-white">
      <div ref={topRef} className="h-10 flex items-center justify-center mb-4">
        {isFetchingMore ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
            <Loader2 className="animate-spin text-blue-600" size={16} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading history</span>
          </div>
        ) : hasMore && (
          <div className="h-4 w-full" />
        )}
      </div>

      {messages.map((msg, idx) => {
        const isMe = msg.senderId === currentUser?.id;
        const prevMsg = messages[idx - 1];
        const isNewDay = !prevMsg || new Date(prevMsg.createdAt).toDateString() !== new Date(msg.createdAt).toDateString();
        const isConsecutive = prevMsg && prevMsg.senderId === msg.senderId && !isNewDay;
        
        return (
          <React.Fragment key={msg.id}>
            {isNewDay && (
              <div className="flex justify-center my-10">
                <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100/50">
                  <Calendar size={10} className="text-slate-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {formatDateLabel(msg.createdAt)}
                  </span>
                </div>
              </div>
            )}
            
            <div className={`flex group ${isMe ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mt-1' : 'mt-6'}`}>
              {!isMe && (
                <div className="w-10 flex-shrink-0 mr-3">
                  {!isConsecutive && (
                    <img 
                      src={partner?.avatar || `https://picsum.photos/seed/${partner?.uId}/100/100`} 
                      className="w-10 h-10 rounded-2xl object-cover shadow-sm ring-2 ring-blue-50" 
                    />
                  )}
                </div>
              )}

              <div className={`max-w-[85%] md:max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`px-5 py-3 shadow-sm transition-all duration-300 ${
                  isMe 
                    ? `bg-blue-600 text-white font-medium ${isConsecutive ? 'rounded-[20px]' : 'rounded-[24px] rounded-br-none'}` 
                    : `bg-slate-50 text-slate-800 font-medium border border-slate-100/50 ${isConsecutive ? 'rounded-[20px]' : 'rounded-[24px] rounded-bl-none'}`
                }`}>
                  <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
                
                <div className={`flex items-center gap-2 mt-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && <StatusIcon status={msg.status} />}
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}

      {isPartnerTyping && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mt-6">
          <div className="w-10 flex-shrink-0">
            <img 
              src={partner?.avatar || `https://picsum.photos/seed/${partner?.uId}/100/100`} 
              className="w-10 h-10 rounded-2xl object-cover opacity-50 grayscale" 
            />
          </div>
          <div className="bg-slate-50 px-5 py-4 rounded-[24px] rounded-bl-none border border-slate-100/50 flex gap-1.5 items-center">
            {[0, 0.2, 0.4].map(delay => (
              <motion.div 
                key={delay} 
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }} 
                transition={{ repeat: Infinity, duration: 1, delay }} 
                className="w-1.5 h-1.5 bg-blue-400 rounded-full" 
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MessageList;
