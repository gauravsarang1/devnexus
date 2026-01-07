
import React from 'react';
import { User as UserIcon, Check, Loader2 } from 'lucide-react';

interface AccountPaneProps {
  data: { name: string; uId: string; email: string };
  setData: (data: any) => void;
  onSave: (e: React.FormEvent) => void;
  isSaving: boolean;
}

const AccountPane: React.FC<AccountPaneProps> = ({ data, setData, onSave, isSaving }) => {
  return (
    <div className="max-w-xl">
      <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
        <UserIcon className="text-blue-600" /> Account Information
      </h3>
      <form onSubmit={onSave} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
          <input 
            type="text" 
            value={data.name} 
            onChange={(e) => setData({...data, name: e.target.value})}
            className="w-full bg-white border-2 border-slate-100 focus:border-blue-500 rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username (UID)</label>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">@</span>
            <input 
              type="text" 
              value={data.uId} 
              onChange={(e) => setData({...data, uId: e.target.value.toLowerCase().replace(/\s/g, '')})}
              className="w-full bg-white border-2 border-slate-100 focus:border-blue-500 rounded-2xl py-4 pl-10 pr-6 text-sm font-bold outline-none transition-all" 
            />
          </div>
        </div>
        <div className="space-y-2 opacity-60">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
          <input type="email" value={data.email} disabled className="w-full bg-slate-100 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold outline-none cursor-not-allowed" />
        </div>
        <button 
          type="submit" 
          disabled={isSaving}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all disabled:bg-slate-400"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <><Check size={18} /> Save Changes</>}
        </button>
      </form>
    </div>
  );
};

export default AccountPane;
