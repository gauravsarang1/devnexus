
import React from 'react';
import { MentionEntry } from '../../types';

interface MentionTextProps {
  content: string;
  mentions: MentionEntry[];
}

const MentionText: React.FC<MentionTextProps> = ({ content, mentions }) => {  
  return (
    <div className="space-y-4">
      <p className="text-slate-800 leading-relaxed whitespace-pre-wrap text-[1.05rem] font-medium">
        {content}
      </p>
      
      {mentions && mentions.length > 0 && (
        <div className="flex flex-wrap gap-2.5 pt-1">
          {mentions.map((mention) => {
            if (mention.project) {
              return (
                <div 
                  key={mention.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 text-emerald-700 cursor-pointer hover:shadow-md transition-all active:scale-95 group"
                >
                  <img 
                    src={mention.project.logo || ''} 
                    className="w-5 h-5 rounded-lg object-cover ring-1 ring-emerald-200" 
                    alt="" 
                  />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black opacity-50 leading-none">Project</span>
                    <span className="text-xs font-bold leading-tight group-hover:underline">
                      {mention.project.title}
                    </span>
                  </div>
                </div>
              );
            }
            if (mention.user) {
              return (
                <div 
                  key={mention.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 cursor-pointer hover:shadow-md transition-all active:scale-95 group"
                >
                  <img 
                    src={mention.user.avatar || ''} 
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-blue-200" 
                    alt="" 
                  />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black opacity-50 leading-none">Contributor</span>
                    <span className="text-xs font-bold leading-tight group-hover:underline">
                      {mention.user.name}
                    </span>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default MentionText;
