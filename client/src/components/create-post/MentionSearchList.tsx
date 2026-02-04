
import React from 'react';

interface SearchResult {
  id: string;
  name: string;
  avatar: string;
  uId?: string;
}

interface MentionSearchListProps {
  results: SearchResult[];
  onSelect: (item: SearchResult) => void;
  isLoading: boolean;
}

const MentionSearchList: React.FC<MentionSearchListProps> = ({ results, onSelect, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center animate-pulse">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-sm font-bold text-slate-400">Searching...</span>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-10 text-center">
        <div className="text-3xl mb-2">🔍</div>
        <p className="text-sm font-bold text-slate-500">No matches found</p>
        <p className="text-xs text-slate-400">Try a different name or ID</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-50">
      {results.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left group"
        >
          <div className="relative">
            <img 
              src={item.avatar} 
              alt={item.name} 
              className="w-10 h-10 rounded-full object-cover border border-slate-100 group-hover:scale-105 transition-transform" 
            />
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-sm font-black text-slate-900 truncate">
              {item.name}
            </span>
            {item.uId && (
              <span className="text-xs font-bold text-blue-500 truncate">
                {item.uId}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default MentionSearchList;
