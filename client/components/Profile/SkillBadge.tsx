
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Trash2 } from 'lucide-react';
import { SkillOnUser, SkillLevel } from '../../src/types';

interface SkillBadgeProps {
  skill: SkillOnUser;
  isOwnProfile: boolean;
  onUpdateLevel?: (id: string, level: SkillLevel) => void;
  onRemove?: (id: string) => void;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, isOwnProfile, onUpdateLevel, onRemove }) => {
  const isTeach = skill.role === 'TEACH';
  const colorClass = isTeach ? 'bg-green-50/50 border-green-100 text-green-600' : 'bg-blue-50/50 border-blue-100 text-blue-600';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.9 }} 
      className={`px-5 py-3 border rounded-2xl flex items-center gap-3 group transition-all hover:shadow-md ${colorClass}`}
    >
      <div className={`w-2 h-2 rounded-full ${isTeach ? 'bg-green-500' : 'bg-blue-500'}`} />
      <div className="flex flex-col">
        <p className="text-sm font-bold text-slate-900">{skill.skill.name}</p>
        {isOwnProfile && onUpdateLevel ? (
          <div className="relative inline-flex items-center gap-1 mt-0.5">
            <select 
              value={skill.level} 
              onChange={(e) => onUpdateLevel(skill.id, e.target.value as SkillLevel)} 
              className="appearance-none bg-transparent text-[10px] font-black uppercase tracking-widest border-b border-current cursor-pointer outline-none hover:opacity-80 transition-opacity"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="EXPERT">Expert</option>
            </select>
            <ChevronDown size={8} className="pointer-events-none" />
          </div>
        ) : (
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{skill.level}</p>
        )}
      </div>
      {isOwnProfile && onRemove && (
        <button 
          onClick={() => onRemove(skill.id)} 
          className="ml-2 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      )}
    </motion.div>
  );
};

export default SkillBadge;
