
import React from 'react';
import { X, User as UserIcon, Folder as ProjectIcon } from 'lucide-react';
import { Mention } from '../../types';

interface MentionChipProps {
  mention: Mention;
  onRemove: () => void;
}

const MentionChip: React.FC<MentionChipProps> = ({ mention, onRemove }) => {
  const isUser = mention.type === 'user';
  
  return (
    <div className={`flex items-center gap-2 pl-1 pr-2 py-1.5 rounded-full border shadow-sm transition-all hover:shadow-md animate-in zoom-in-95 duration-200 group ${
      isUser 
        ? 'bg-blue-50 border-blue-100 text-blue-700' 
        : 'bg-emerald-50 border-emerald-100 text-emerald-700'
    }`}>
      <div className="relative shrink-0">
        {mention.avatar ? (
          <img 
            src={mention.avatar} 
            alt="" 
            className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-sm" 
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center ring-2 ring-white">
            {isUser ? <UserIcon className="w-3.5 h-3.5 text-slate-400" /> : <ProjectIcon className="w-3.5 h-3.5 text-slate-400" />}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <span className="text-[11px] font-black leading-none truncate max-w-[100px]">
          {mention.name}
        </span>
        <span className={`text-[8px] font-black uppercase tracking-tighter mt-0.5 opacity-60 ${isUser ? 'text-blue-500' : 'text-emerald-500'}`}>
          {isUser ? 'User' : 'Project'}
        </span>
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className={`ml-1 p-1 rounded-full transition-colors ${
          isUser ? 'hover:bg-blue-200 text-blue-400' : 'hover:bg-emerald-200 text-emerald-400'
        } hover:text-slate-900`}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

export default MentionChip;
