
import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Smartphone } from 'lucide-react';

interface NotificationsPaneProps {
  prefs: { push: boolean; matches: boolean; email: boolean };
  onToggle: (key: string) => void;
  onPushActivate: () => void;
  onPushTest: () => void;
  isSaving: boolean;
}

const NotificationsPane: React.FC<NotificationsPaneProps> = ({ 
  prefs, onToggle, onPushActivate, onPushTest, isSaving 
}) => {
  return (
    <div className="max-w-xl">
      <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
        <Bell className="text-blue-600" /> Notifications
      </h3>
      <div className="space-y-4">
        <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[32px] text-white mb-8 shadow-xl flex items-center gap-6 overflow-hidden relative">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0"><Smartphone size={32} /></div>
          <div className="flex-grow">
            <h4 className="text-lg font-bold mb-1">Persistent Push</h4>
            <p className="text-blue-100 text-xs mb-4">Background alerts for matches & messages.</p>
            <div className="flex gap-2">
              <button onClick={onPushActivate} disabled={isSaving} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${prefs.push ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'}`}>
                {isSaving ? 'Working...' : prefs.push ? 'Push Enabled' : 'Enable Push'}
              </button>
              {prefs.push && <button onClick={onPushTest} className="px-4 py-2 bg-white/10 rounded-xl text-xs font-bold">Test</button>}
            </div>
          </div>
        </div>

        {[
          { key: 'matches', title: 'New Match Requests', sub: 'Notify me when someone wants to swap' },
          { key: 'email', title: 'Email Digest', sub: 'Weekly summary of your skill growth' },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100">
            <div><p className="font-bold text-slate-900 text-sm">{item.title}</p><p className="text-slate-400 text-xs">{item.sub}</p></div>
            <button onClick={() => onToggle(item.key)} className={`w-12 h-6 rounded-full transition-all relative ${prefs[item.key as keyof typeof prefs] ? 'bg-blue-600' : 'bg-slate-200'}`}>
              <motion.div animate={{ x: prefs[item.key as keyof typeof prefs] ? 26 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPane;
