
import React from 'react';
import { ArrowUp } from 'lucide-react';

const ProfileStats: React.FC = () => {
  return (
    <div className="bg-slate-900 rounded-[32px] p-6 text-white overflow-hidden relative shadow-xl">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-xl" />
      <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Swap Stats</h4>
      <div className="space-y-4">
         <div className="flex justify-between items-center"><span className="text-slate-400 text-xs font-bold">Total Swaps</span><span className="text-xl font-black">12</span></div>
         <div className="flex justify-between items-center"><span className="text-slate-400 text-xs font-bold">Endorsements</span><span className="text-xl font-black">8</span></div>
         <div className="pt-4 border-t border-white/10">
           <div className="flex items-center gap-2 text-blue-400 mb-1"><ArrowUp size={14} /><span className="text-[10px] font-black uppercase">Top Performer</span></div>
           <p className="text-xs text-slate-300">You are in the top 5% of collaborators this month.</p>
         </div>
      </div>
    </div>
  );
};

export default ProfileStats;
