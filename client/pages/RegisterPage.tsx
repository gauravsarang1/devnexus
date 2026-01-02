import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  AtSign, 
  Check, 
  X, 
  Loader2, 
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Search,
  Plus,
  ArrowRight,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '../services/authService';
import { skillService } from '../services/skillService';
import { Skill } from '../src/types';
import { aiService } from '../services/aiService';

interface RegisterPageProps {
  navigate: (to: string) => void;
}

const MAX_SKILLS = 5;

const RegisterPage: React.FC<RegisterPageProps> = ({ navigate }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    uId: '',
    email: '',
    password: ''
  });
  
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [offeredSkills, setOfferedSkills] = useState<string[]>([]);
  const [seekingSkills, setSeekingSkills] = useState<string[]>([]);
  const [uidSuggestions, setUidSuggestions] = useState<string[]>([]);
  const [isSuggestingUid, setIsSuggestingUid] = useState(false);
  const [skillSearch, setSkillSearch] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skillsResponse = await skillService.getAllSkills();
        setAllSkills(skillsResponse.skills);
      } catch (err) {
        console.error("Failed to fetch skills", err);
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    const pwd = formData.password;
    let strength = 0;
    if (pwd.length > 6) strength++;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleSuggestUid = async () => {
    const name = formData.name || formData.uId;
    if (!name) return toast.info("Enter your name first!");
    setIsSuggestingUid(true);
    try {
      const res = await aiService.suggestUid(name);
      if (res.success) setUidSuggestions(res.data);
    } catch (err) {
      toast.error("Failed to get suggestions");
    } finally { setIsSuggestingUid(false); }
  };

  const filteredSkills = useMemo(() => {
    return allSkills.filter(s => 
      s.name.toLowerCase().includes(skillSearch.toLowerCase())
    );
  }, [skillSearch, allSkills]);

  const handleToggleSkill = (skillName: string, type: 'offered' | 'seeking') => {
    const currentList = type === 'offered' ? offeredSkills : seekingSkills;
    const isAlreadySelected = currentList.includes(skillName);

    if (!isAlreadySelected && currentList.length >= MAX_SKILLS) {
      toast.warning(`You can select up to ${MAX_SKILLS} skills.`);
      return;
    }

    if (type === 'offered') {
      setOfferedSkills(prev => 
        prev.includes(skillName) ? prev.filter(s => s !== skillName) : [...prev, skillName]
      );
    } else {
      setSeekingSkills(prev => 
        prev.includes(skillName) ? prev.filter(s => s !== skillName) : [...prev, skillName]
      );
    }
  };

  const isStepValid = useMemo(() => {
    if (step === 1) {
      return (
        formData.name.trim().length > 0 &&
        formData.uId.length >= 4 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
        passwordStrength >= 2
      );
    }
    if (step === 2) return offeredSkills.length >= 1;
    if (step === 3) return seekingSkills.length >= 1;
    return false;
  }, [step, formData, passwordStrength, offeredSkills, seekingSkills]);

  const nextStep = () => {
    if (isStepValid) {
      if (step < 3) {
        setStep(step + 1);
        window.scrollTo(0, 0);
      } else {
        handleFinalSubmit();
      }
    }
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        offeredSkills,
        seekingSkills
      };
      const response = await authService.register(payload);
      if (response.success) {
        toast.success('Registration successful! Verification code sent.');
        // Pass email in search params instead of localStorage for better stateless flow
        navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 opacity-60 -z-10" />
      
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors z-20 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        {step === 1 ? 'Exit' : 'Step ' + (step - 1)}
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-[48px] shadow-2xl shadow-blue-500/5 border border-slate-100 p-8 md:p-12 relative"
      >
        <div className="flex gap-2.5 mb-12">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex-grow h-1.5 rounded-full bg-slate-100 relative overflow-hidden">
              <motion.div animate={{ width: step >= i ? '100%' : '0%' }} className={`h-full ${step >= i ? 'bg-blue-600' : 'bg-transparent'}`} />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Create Account</h1>
                <p className="text-slate-500 mt-2 font-medium">Join SkillSwap and start sharing your expertise.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Aryan Sharma" className="w-full bg-slate-50 border-2 border-transparent rounded-3xl py-4 pl-12 pr-4 text-sm focus:bg-white focus:border-blue-100 outline-none transition-all font-medium" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center pr-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unique ID</label>
                    <button onClick={handleSuggestUid} disabled={isSuggestingUid} className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1 hover:underline">
                      {isSuggestingUid ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />} Suggest
                    </button>
                  </div>
                  <div className="relative group">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input type="text" value={formData.uId} onChange={(e) => setFormData({...formData, uId: e.target.value.toLowerCase().replace(/\s/g, '')})} placeholder="username" className="w-full bg-slate-50 border-2 border-transparent rounded-3xl py-4 pl-12 pr-4 text-sm focus:bg-white focus:border-blue-100 outline-none transition-all font-medium" />
                  </div>
                  {uidSuggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 px-1">
                      {uidSuggestions.map(s => (
                        <button key={s} onClick={() => {setFormData({...formData, uId: s}); setUidSuggestions([]);}} className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">@{s}</button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="hello@example.com" className="w-full bg-slate-50 border-2 border-transparent rounded-3xl py-4 pl-12 pr-4 text-sm focus:bg-white focus:border-blue-100 outline-none transition-all font-medium" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="w-full bg-slate-50 border-2 border-transparent rounded-3xl py-4 pl-12 pr-12 text-sm focus:bg-white focus:border-blue-100 outline-none transition-all font-medium" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {(step === 2 || step === 3) && (
            <motion.div key={step === 2 ? "step2" : "step3"} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4">
                  <Sparkles size={14} /> {step === 2 ? 'Offering Expertise' : 'Learning Goals'}
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  {step === 2 ? 'What can you teach?' : 'What do you want to learn?'}
                </h1>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" value={skillSearch} onChange={(e) => setSkillSearch(e.target.value)} placeholder="Search skills..." className="w-full bg-slate-50 border-2 border-slate-100/50 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-blue-100 transition-all font-medium" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredSkills.map(skill => {
                  const isSelected = (step === 2 ? offeredSkills : seekingSkills).includes(skill.name);
                  return (
                    <button key={skill.id} onClick={() => handleToggleSkill(skill.name, step === 2 ? 'offered' : 'seeking')} className={`p-4 rounded-3xl border-2 text-xs font-bold text-left transition-all ${isSelected ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-100 text-slate-600'}`}>
                      {skill.name}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12">
          <button onClick={nextStep} disabled={!isStepValid || isLoading} className={`w-full py-4.5 rounded-3xl font-black text-base transition-all flex items-center justify-center gap-2 shadow-2xl ${isLoading ? 'bg-blue-400 text-white' : isStepValid ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]' : 'bg-slate-100 text-slate-400'}`}>
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : (step === 3 ? 'Complete Setup' : 'Continue')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;