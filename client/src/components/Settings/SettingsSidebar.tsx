
import React from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  icon: React.ReactNode;
  desc: string;
}

interface SettingsSidebarProps {
  tabs: Tab[];
  activeTab: string;
  onSelect: (id: any) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ tabs, activeTab, onSelect }) => {
  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={`flex items-center gap-4 p-4 rounded-3xl transition-all text-left min-w-[200px] lg:min-w-0 border-2 ${
              activeTab === tab.id 
                ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20 scale-[1.02]' 
                : 'bg-white border-transparent text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className={`${activeTab === tab.id ? 'text-white' : 'text-blue-600'} bg-white/10 p-2 rounded-xl`}>
              {tab.icon}
            </div>
            <div>
              <p className="font-bold text-sm">{tab.id}</p>
              <p className={`text-[10px] uppercase font-black tracking-widest opacity-60 ${activeTab === tab.id ? 'text-blue-100' : 'text-slate-400'}`}>
                Manage
              </p>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default SettingsSidebar;
