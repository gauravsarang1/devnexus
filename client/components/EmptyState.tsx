
import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  desc: string;
  ctaText?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, desc, ctaText = "Start Exploring" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <Search className="text-blue-500" size={32} />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-xs mb-8">{desc}</p>
      <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-500/20 hover:scale-105 transition-all">
        {ctaText}
      </button>
    </div>
  );
};

export default EmptyState;
