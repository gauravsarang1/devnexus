import React from 'react';
import { CheckCircle2, Zap, UserCheck, UserX, MessageSquare, ArrowUpRight, Clock, X } from 'lucide-react';
// Fixed: Import Match from global types
import { Match } from '../../types';

interface MatchCardProps {
  match: Match;
  activeTab: 'Incoming' | 'Sent' | 'Active';
  // Fixed: Changed REJECTED to DECLINED
  onStatusUpdate: (id: string, status: 'ACCEPTED' | 'DECLINED') => void;
  onNavigate: (path: string) => void;
}

/**
 * MatchCard component to display individual swap requests or active matches.
 * Handles different UI states based on the active tab (Incoming, Sent, Active).
 */
const MatchCard: React.FC<MatchCardProps> = ({ match, activeTab, onStatusUpdate, onNavigate }) => {
  const otherUser = activeTab === 'Incoming' ? match.userA : match.userB;
  if (!otherUser) return null;

  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img 
              src={otherUser.avatar || `https://picsum.photos/seed/${otherUser.id}/200/200`} 
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50" 
              alt={otherUser.name}
            />
            <div>
              <h4 className="font-bold text-slate-900 flex items-center gap-1">
                {otherUser.name} <CheckCircle2 size={14} className="text-blue-500" />
              </h4>
              <p className="text-xs text-slate-500 truncate max-w-[120px]">{otherUser.bio || 'SkillSwapper'}</p>
            </div>
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg">
            {new Date(match.createdAt).toLocaleDateString()}
          </div>
        </div>

        {match.matchedSkills && match.matchedSkills.length > 0 && (
          <div className="mb-6">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Zap size={10} fill="currentColor" /> Common Ground
            </p>
            <div className="flex flex-wrap gap-1.5">
              {match.matchedSkills.map(skill => (
                <span key={skill} className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto">
        {activeTab === 'Incoming' && (
          <div className="flex gap-3">
            <button 
              onClick={() => onStatusUpdate(match.id, 'ACCEPTED')}
              className="flex-grow flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
            >
              <UserCheck size={18} /> Accept
            </button>
            <button 
              onClick={() => onStatusUpdate(match.id, 'DECLINED')}
              className="p-3.5 bg-slate-100 text-slate-500 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <UserX size={18} />
            </button>
          </div>
        )}

        {activeTab === 'Active' && (
          <div className="flex gap-3">
            <button 
              onClick={() => onNavigate('/chat')}
              className="flex-grow flex items-center justify-center gap-2 bg-slate-900 text-white py-3.5 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all"
            >
              <MessageSquare size={18} /> Open Chat
            </button>
            <button 
              onClick={() => onNavigate(`/profile?uId=${otherUser.uId}`)}
              className="p-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all"
            >
              <ArrowUpRight size={18} />
            </button>
          </div>
        )}

        {activeTab === 'Sent' && (
          <div className="flex items-center justify-between w-full p-2 bg-amber-50 rounded-2xl border border-amber-100">
             <div className="flex items-center gap-3 pl-2">
                <Clock size={16} className="text-amber-600" />
                <span className="text-xs font-bold text-amber-700">Waiting for Response</span>
             </div>
             <button className="p-2 hover:bg-amber-100 rounded-xl transition-colors text-amber-600"><X size={16} /></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchCard;