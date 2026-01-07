
import React from 'react';
import { ChevronLeft, Sparkles, Phone, Video, Info, MoreHorizontal } from 'lucide-react';
import { ChatParticipant, User } from '../../types';

interface ChatHeaderProps {
  partner: any;
  isOnline: boolean;
  isTyping: boolean;
  onBack: () => void;
  onNavigate: (path: string) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ partner, isOnline, isTyping, onBack, onNavigate }) => {
  if (!partner) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-5 border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="md:hidden p-2 -ml-2 text-slate-400 hover:text-blue-600 transition-colors bg-slate-50 rounded-xl">
          <ChevronLeft size={20} />
        </button>
        
        <div className="relative cursor-pointer group" onClick={() => onNavigate(`/profile?uId=${partner.uId}`)}>
          <img 
            src={partner.avatar || `https://picsum.photos/seed/${partner.uId}/100/100`} 
            className="w-10 h-10 md:w-12 md:h-12 rounded-2xl object-cover ring-2 ring-blue-50 group-hover:ring-blue-200 transition-all" 
            alt={partner.name}
          />
          <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white rounded-full transition-colors ${isOnline ? 'bg-green-500' : 'bg-slate-300'}`}></div>
        </div>

        <div>
          <h4 className="font-black text-slate-900 leading-tight flex items-center gap-1.5 text-base md:text-lg cursor-pointer hover:text-blue-600 transition-colors" onClick={() => onNavigate(`/profile?uId=${partner.uId}`)}>
            {partner.name}
            <Sparkles size={12} className="text-blue-500" />
          </h4>
          <div className="flex items-center gap-2 mt-0.5">
            {isTyping ? (
              <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest animate-pulse">Typing...</span>
            ) : (
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-3">
        <button className="hidden sm:flex p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
          <Phone size={20} />
        </button>
        <button className="hidden sm:flex p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
          <Video size={20} />
        </button>
        <div className="w-px h-6 bg-slate-100 mx-1 hidden sm:block"></div>
        <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
          <Info size={20} />
        </button>
        <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
          <MoreHorizontal size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
