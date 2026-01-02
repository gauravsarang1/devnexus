import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Plus, ChevronDown, CheckCircle2 } from 'lucide-react';
// Fixed: Import Skill from global types
import { SkillLevel, SkillRole, Skill } from '../../src/types';

interface AddSkillModalProps {
  role: SkillRole;
  allSkills: Skill[];
  onAdd: (skill: Skill | { name: string; isNew: boolean }, level: SkillLevel) => void;
  onClose: () => void;
}

const AddSkillModal: React.FC<AddSkillModalProps> = ({ role, allSkills, onAdd, onClose }) => {
  const [skillSearch, setSkillSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<Skill | { name: string; isNew: boolean } | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel>(role === 'TEACH' ? 'EXPERT' : 'BEGINNER');

  const filteredChoices = useMemo(() => {
    return allSkills.filter(s => s.name.toLowerCase().includes(skillSearch.toLowerCase())).slice(0, 10);
  }, [skillSearch, allSkills]);

  const showCreateOption = useMemo(() => {
    if (!skillSearch.trim()) return false;
    return !allSkills.some(s => s.name.toLowerCase() === skillSearch.toLowerCase().trim());
  }, [skillSearch, allSkills]);

  const levels: { value: SkillLevel; label: string; desc: string }[] = [
    { value: 'BEGINNER', label: 'Beginner', desc: 'Just starting out' },
    { value: 'INTERMEDIATE', label: 'Intermediate', desc: 'Solid foundation' },
    { value: 'EXPERT', label: 'Expert', desc: 'Proven expertise' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }} 
        className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-8 border border-slate-100 overflow-hidden"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-black text-slate-900">{selectedSkill ? 'Set Proficiency' : `Add ${role === 'TEACH' ? 'Expertise' : 'Goal'}`}</h3>
            <p className="text-sm text-slate-500">{selectedSkill ? `How's your experience level?` : 'Find or create a skill to add.'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
        </div>

        {!selectedSkill ? (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input autoFocus value={skillSearch} onChange={(e) => setSkillSearch(e.target.value)} placeholder="Search Skills..." className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredChoices.map(skill => (
                <button key={skill.id} onClick={() => setSelectedSkill(skill)} className="flex flex-col items-start p-4 bg-slate-50 hover:bg-blue-50 rounded-2xl transition-all group">
                  <span className="text-sm font-bold text-slate-900 group-hover:text-blue-700">{skill.name}</span>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{skill.popularity} users</span>
                </button>
              ))}
              {showCreateOption && (
                <button onClick={() => setSelectedSkill({ name: skillSearch.trim(), isNew: true })} className="col-span-2 flex items-center gap-3 p-4 bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><Plus size={18} /></div>
                  <div className="text-left"><span className="text-sm font-bold text-blue-900">Add "{skillSearch}"</span></div>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
              <div className="grid grid-cols-1 gap-3">
                {levels.map((lvl) => (
                  <button key={lvl.value} onClick={() => setSelectedLevel(lvl.value)} className={`group flex items-center justify-between p-5 rounded-[24px] border-2 transition-all font-bold text-sm ${selectedLevel === lvl.value ? 'bg-blue-600 border-blue-600 text-white shadow-xl scale-[1.02]' : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200'}`}>
                    <div className="flex flex-col items-start">
                       <span className="text-base">{lvl.label}</span>
                       <span className={`text-[10px] uppercase opacity-70 ${selectedLevel === lvl.value ? 'text-blue-100' : 'text-slate-400'}`}>{lvl.desc}</span>
                    </div>
                    {selectedLevel === lvl.value ? <CheckCircle2 size={24} /> : <div className="w-6 h-6 rounded-full border-2 border-slate-100 group-hover:border-blue-200" />}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSelectedSkill(null)} className="flex-grow bg-slate-100 text-slate-600 px-6 py-4.5 rounded-3xl font-bold text-sm">Back</button>
              <button onClick={() => onAdd(selectedSkill, selectedLevel)} className="flex-[2] bg-blue-600 text-white px-6 py-4.5 rounded-3xl font-black text-base shadow-xl">Add Skill</button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AddSkillModal;