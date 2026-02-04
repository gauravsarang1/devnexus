
import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Author } from '../../types';

interface PostHeaderProps {
  author: Author;
  timestamp: string;
}

const PostHeader: React.FC<PostHeaderProps> = ({ author, timestamp }) => {
  const timeFormatted = new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Open menu logic...
  };

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <div className="relative group">
          <img 
            src={author.avatar || 'https://picsum.photos/40/40'} 
            alt={author.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-100 transition-opacity"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-bold text-slate-900 text-sm leading-tight">
              {author.name}
            </span>
            <span className="text-slate-400 text-xs px-1">•</span>
            <span className="text-slate-500 text-xs">{timeFormatted}</span>
          </div>
          <span className="text-slate-400 text-xs">{author.uId}</span>
        </div>
      </div>
      
      <button 
        onClick={handleMoreClick}
        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>
    </div>
  );
};

export default PostHeader;
