import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AtSign,
  Loader2,
  ArrowLeft,
  Sparkles,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '../services/authService';
import { skillService } from '../services/skillService';
import { Skill } from '../types';
import { aiService } from '../services/aiService';

interface RegisterPageProps {
  navigate: (to: string) => void;
}

const MAX_SKILLS = 5;
const MAX_STEPS = 5;

/* ---------- AVATARS & BACKGROUNDS ---------- */

const getDiceBearAvatars = (uId: string) =>
  Array.from({ length: 20 }).map(
    (_, i) =>
      `https://api.dicebear.com/7.x/lorelei/svg?seed=${uId}-${i}&backgroundColor=b6e3f4,c0aede,d1d4f9`
  );

const BACKGROUNDS = [
  "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80", // blue-purple gradient
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1200&q=80", // soft violet
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80", // dark blue glow
  "https://images.unsplash.com/photo-1557683311-eac922347aa1?auto=format&fit=crop&w=1200&q=80", // cyan gradient
  "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1200&q=80", // neon purple
  "https://images.unsplash.com/photo-1618005181859-7b53b0c02c46?auto=format&fit=crop&w=1200&q=80", // soft blur gradient
  "https://images.unsplash.com/photo-1604079628040-94301bb21b91?auto=format&fit=crop&w=1200&q=80", // deep blue abstract
  "https://images.unsplash.com/photo-1618005182384-0d4d78f9c7a6?auto=format&fit=crop&w=1200&q=80", // purple wave
  "https://images.unsplash.com/photo-1618005182566-9b8a7f2c2d3a?auto=format&fit=crop&w=1200&q=80", // gradient mesh
  "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?auto=format&fit=crop&w=1200&q=80"  // blue abstract texture
];

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
  const [skillSearch, setSkillSearch] = useState('');

  const [uidSuggestions, setUidSuggestions] = useState<string[]>([]);
  const [isSuggestingUid, setIsSuggestingUid] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);

  /* ---------- EFFECTS ---------- */

  useEffect(() => {
    skillService.getAllSkills().then(res => setAllSkills(res.skills));
  }, []);

  useEffect(() => {
    const pwd = formData.password;
    let strength = 0;
    if (pwd.length > 6) strength++;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  }, [formData.password]);

  /* ---------- HELPERS ---------- */

  const filteredSkills = useMemo(
    () =>
      allSkills.filter(skill =>
        skill.name.toLowerCase().includes(skillSearch.toLowerCase())
      ),
    [skillSearch, allSkills]
  );

  const isStepValid = useMemo(() => {
    if (step === 1) {
      return (
        formData.name.trim() &&
        formData.uId.length >= 4 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
        passwordStrength >= 2
      );
    }
    if (step === 2 || step === 3) return true; // skippable
    if (step === 4) return !!selectedAvatar;
    if (step === 5) return !!selectedBackground;
    return false;
  }, [step, formData, passwordStrength, selectedAvatar, selectedBackground]);

  const handleToggleSkill = (skill: string, type: 'offered' | 'seeking') => {
    const list = type === 'offered' ? offeredSkills : seekingSkills;
    if (!list.includes(skill) && list.length >= MAX_SKILLS) {
      return toast.warning(`Max ${MAX_SKILLS} skills`);
    }
    const update = list.includes(skill)
      ? list.filter(s => s !== skill)
      : [...list, skill];

    type === 'offered' ? setOfferedSkills(update) : setSeekingSkills(update);
  };

  const handleSuggestUid = async () => {
    if (!formData.name) return toast.info('Enter name first');
    setIsSuggestingUid(true);
    try {
      const res = await aiService.suggestUid(formData.name);
      if (res.success) setUidSuggestions(res.data);
    } finally {
      setIsSuggestingUid(false);
    }
  };

  const nextStep = () => {
    if (!isStepValid) return;
    if (step < MAX_STEPS) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      submit();
    }
  };

  const submit = async () => {
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        offeredSkills,
        seekingSkills,
        avatar: selectedAvatar,
        background: selectedBackground
      };

      const res = await authService.register(payload);
      if (res.success) {
        toast.success('Registered successfully');
        navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
      } else toast.error(res.message);
    } catch {
      toast.error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen flex justify-center items-center p-4 bg-white">
      <motion.button
        onClick={() => (step > 1 ? setStep(step - 1) : navigate('/'))}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 font-bold"
      >
        <ArrowLeft size={18} /> {step === 1 ? 'Exit' : 'Back'}
      </motion.button>

      <div className="w-full max-w-lg bg-white rounded-[48px] shadow-xl p-8">
        {/* Progress */}
        <div className="flex gap-2 mb-10">
          {Array.from({ length: MAX_STEPS }).map((_, i) => (
            <div key={i} className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: step > i ? '100%' : '0%' }}
                className="h-full bg-blue-600"
              />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ---------- STEP 1 ---------- */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Create Account</h1>
                <p className="text-slate-500 mt-2 font-medium">Join SkillSwap and start sharing your expertise.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Aryan Sharma" className="w-full bg-slate-50 border-2 border-transparent rounded-3xl py-4 pl-12 pr-4 text-sm focus:bg-white focus:border-blue-100 outline-none transition-all font-medium" />
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
                    <input type="text" value={formData.uId} onChange={(e) => setFormData({ ...formData, uId: e.target.value.toLowerCase().replace(/\s/g, '') })} placeholder="username" className="w-full bg-slate-50 border-2 border-transparent rounded-3xl py-4 pl-12 pr-4 text-sm focus:bg-white focus:border-blue-100 outline-none transition-all font-medium" />
                  </div>
                  {uidSuggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 px-1">
                      {uidSuggestions.map(s => (
                        <button key={s} onClick={() => { setFormData({ ...formData, uId: s }); setUidSuggestions([]); }} className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">@{s}</button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="hello@example.com" className="w-full bg-slate-50 border-2 border-transparent rounded-3xl py-4 pl-12 pr-4 text-sm focus:bg-white focus:border-blue-100 outline-none transition-all font-medium" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" className="w-full bg-slate-50 border-2 border-transparent rounded-3xl py-4 pl-12 pr-12 text-sm focus:bg-white focus:border-blue-100 outline-none transition-all font-medium" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ---------- STEP 2 & 3 (SKILLS) ---------- */}
          {(step === 2 || step === 3) && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="text-center">
                <h2 className="text-2xl font-black text-slate-900">
                  {step === 2 ? 'Skills you offer' : 'Skills you want to learn'}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  You can skip this step if you want
                </p>
              </div>

              {/* Search */}
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={skillSearch}
                  onChange={e => setSkillSearch(e.target.value)}
                  placeholder="Search skills..."
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-200 transition"
                />
              </div>

              {/* Selected Badges */}
              {(step === 2 ? offeredSkills : seekingSkills).length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Selected ({(step === 2 ? offeredSkills : seekingSkills).length}/{MAX_SKILLS})
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {(step === 2 ? offeredSkills : seekingSkills).map(skill => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold"
                      >
                        {skill}
                        <button
                          onClick={() =>
                            handleToggleSkill(skill, step === 2 ? 'offered' : 'seeking')
                          }
                          className="hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Skills */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Available Skills
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                  {filteredSkills.map(skill => {
                    const isSelected = (step === 2 ? offeredSkills : seekingSkills).includes(
                      skill.name
                    );

                    return (
                      <button
                        key={skill.id}
                        onClick={() =>
                          handleToggleSkill(skill.name, step === 2 ? 'offered' : 'seeking')
                        }
                        className={`p-3 rounded-2xl border-2 text-xs font-bold text-left transition-all
                ${isSelected
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200'
                          }`}
                      >
                        {skill.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}


          {/* ---------- STEP 4 AVATAR ---------- */}
          {step === 4 && (
            <motion.div key="avatar" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-xl font-black mb-4 text-center">Choose Avatar</h2>
              <div className="grid grid-cols-5 gap-4">
                {getDiceBearAvatars(formData.uId).map(a => (
                  <button
                    key={a}
                    onClick={() => setSelectedAvatar(a)}
                    className={`rounded-full border-2 ${selectedAvatar === a ? 'border-blue-600' : 'border-transparent'
                      }`}
                  >
                    <img src={a} className="rounded-full" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ---------- STEP 5 BACKGROUND ---------- */}
          {step === 5 && (
            <motion.div key="bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-xl font-black mb-4 text-center">Choose Background</h2>
              <div className="grid grid-cols-2 gap-4">
                {BACKGROUNDS.map(bg => (
                  <button
                    key={bg}
                    onClick={() => setSelectedBackground(bg)}
                    className={`h-28 rounded-xl overflow-hidden border-2 ${selectedBackground === bg ? 'border-blue-600' : 'border-transparent'
                      }`}
                  >
                    <img src={bg} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------- ACTION ---------- */}
        <button
          onClick={nextStep}
          disabled={!isStepValid || isLoading}
          className="mt-10 w-full py-4 rounded-3xl bg-blue-600 text-white font-black"
        >
          {isLoading ? <Loader2 className="animate-spin mx-auto" /> : step === MAX_STEPS ? 'Complete Setup' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
