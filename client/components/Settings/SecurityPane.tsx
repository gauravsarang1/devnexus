
import React, { useState } from 'react';
import { Lock, AlertTriangle, Eye, EyeOff, Loader2, Trash2, ChevronRight } from 'lucide-react';

interface SecurityPaneProps {
  onSave: (current: string, next: string) => void;
  onDelete: () => void;
  isSaving: boolean;
}

const SecurityPane: React.FC<SecurityPaneProps> = ({ onSave, onDelete, isSaving }) => {
  const [data, setData] = useState({ current: '', next: '', confirm: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);

  return (
    <div className="max-w-xl">
      <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
        <Lock className="text-blue-600" /> Security
      </h3>
      
      <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100 mb-10">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0 shadow-sm">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 text-sm mb-1">Update Password</h4>
            <p className="text-blue-700/70 text-xs leading-relaxed">Pick a unique password to keep your account secure.</p>
          </div>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSave(data.current, data.next); }} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
          <div className="relative">
            <input type={showCurrent ? "text" : "password"} value={data.current} onChange={(e) => setData({...data, current: e.target.value})} className="w-full bg-white border-2 border-slate-100 focus:border-blue-500 rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all" />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
          <div className="relative">
            <input type={showNext ? "text" : "password"} value={data.next} onChange={(e) => setData({...data, next: e.target.value})} className="w-full bg-white border-2 border-slate-100 focus:border-blue-500 rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all" />
            <button type="button" onClick={() => setShowNext(!showNext)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {showNext ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button 
          type="submit" 
          disabled={isSaving || !data.current || !data.next}
          className="w-full bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : "Update Password"}
        </button>
      </form>

      <div className="mt-16 pt-8 border-t border-slate-100">
        <h4 className="text-red-600 font-black text-xs uppercase tracking-[0.2em] mb-4">Danger Zone</h4>
        <button onClick={onDelete} className="flex items-center justify-between w-full p-6 bg-red-50 hover:bg-red-100 border border-red-100 rounded-[32px] transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl text-red-600"><Trash2 size={20} /></div>
            <div className="text-left"><p className="font-bold text-red-900 text-sm">Delete Account</p><p className="text-red-700/60 text-[10px] font-bold">Wipe all data</p></div>
          </div>
          <ChevronRight size={20} className="text-red-300" />
        </button>
      </div>
    </div>
  );
};

export default SecurityPane;
