import React, { useState, useMemo, useEffect } from 'react';
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
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { authService } from '../services/authService';
import { skillService } from '../services/skillService';
import { aiService } from '../services/aiService';
import { toast } from 'sonner';

interface Skill {
  id: string;
  name: string;
}

const MAX_SKILLS = 5;
const MAX_STEPS = 5;

const getDiceBearAvatars = (uId: string) =>
  Array.from({ length: 20 }).map(
    (_, i) =>
      `https://api.dicebear.com/7.x/lorelei/svg?seed=${uId}-${i}&backgroundColor=b6e3f4,c0aede,d1d4f9`
  );

const BACKGROUNDS = [
  "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1557683311-eac922347aa1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1618005181859-7b53b0c02c46?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1604079628040-94301bb21b91?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1618005182384-0d4d78f9c7a6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1618005182566-9b8a7f2c2d3a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?auto=format&fit=crop&w=1200&q=80"
];

const RegisterPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    uId: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [offeredSkills, setOfferedSkills] = useState<string[]>([]);
  const [seekingSkills, setSeekingSkills] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [uidSuggestions, setUidSuggestions] = useState<string[]>([]);
  const [isSuggestingUid, setIsSuggestingUid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);

  const passwordStrength = useMemo(() => {
    const pwd = formData.password;
    let strength = 0;
    if (pwd.length > 6) strength++;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  }, [formData.password]);

  useEffect(() => {
  skillService.getAllSkills()
    .then(res => setAllSkills(res.skills))
    .catch(() => console.error('Failed to load skills'));
}, []);

  const filteredSkills = useMemo(
    () =>
      allSkills.filter(skill =>
        skill.name.toLowerCase().includes(skillSearch.toLowerCase())
      ),
    [skillSearch, allSkills]
  );

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.uId.length < 4) {
      newErrors.uId = 'Username must be at least 4 characters';
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (passwordStrength < 2) {
      newErrors.password = 'Password is too weak';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStepValid = useMemo(() => {
    if (step === 1) {
      return (
        formData.name.trim() &&
        formData.uId.length >= 4 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
        passwordStrength >= 2
      );
    }
    if (step === 2 || step === 3) return true;
    if (step === 4) return !!selectedAvatar;
    if (step === 5) return !!selectedBackground;
    return false;
  }, [step, formData, passwordStrength, selectedAvatar, selectedBackground]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleToggleSkill = (skill: string, type: 'offered' | 'seeking') => {
    const list = type === 'offered' ? offeredSkills : seekingSkills;
    if (!list.includes(skill) && list.length >= MAX_SKILLS) {
      alert(`Maximum ${MAX_SKILLS} skills allowed`);
      return;
    }
    const update = list.includes(skill)
      ? list.filter(s => s !== skill)
      : [...list, skill];

    type === 'offered' ? setOfferedSkills(update) : setSeekingSkills(update);
  };

  const handleSuggestUid = async () => {
  if (!formData.name) {
    toast.info('Enter your name first');
    return;
  }

  setIsSuggestingUid(true);
  try {
    const res = await aiService.suggestUid(formData.name);
    if (res.success) {
      setUidSuggestions(res.data);
    }
  } catch {
    toast.error('UID suggestion failed');
  } finally {
    setIsSuggestingUid(false);
  }
};


  const nextStep = () => {
    if (step === 1 && !validateStep1()) {
      return;
    }
    
    if (!isStepValid) return;
    
    if (step < MAX_STEPS) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      submit();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      background: selectedBackground,
    };

    const res = await authService.register(payload);

    if (res.success) {
      toast.success('Registered successfully');
      navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
    } else {
      toast.error(res.message);
    }
  } catch {
    toast.error('Registration failed');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 -z-10" />
      {/* Back/Exit Button */}
      <button
        onClick={() => (step === 1 ? navigate('/') : prevStep())}
        className="fixed top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-colors z-10 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg hover:shadow-xl"
      >
        <ArrowLeft size={18} />
        <span className="hidden sm:inline">{step === 1 ? 'Exit' : 'Back'}</span>
      </button>

      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-blue-500/10 p-8 md:p-12 border border-slate-100">
        {/* Progress Bar */}
        <div className="flex gap-1.5 sm:gap-2 mb-8 sm:mb-10">
          {Array.from({ length: MAX_STEPS }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden"
            >
              <div
                className={`h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-out ${
                  step > i ? 'w-full' : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

        <div className="relative">
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col items-center mb-8 sm:mb-10">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                  <div className="w-6 h-6 border-2 border-white rounded-sm rotate-45" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Create Account
                </h1>
                <p className="text-slate-500 mt-2 text-sm sm:text-base font-medium text-center">
                  Join SkillSwap and start sharing your expertise
                </p>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Aryan Sharma"
                      className="w-full bg-slate-50 border-2 border-transparent rounded-2xl sm:rounded-3xl py-3 sm:py-4 pl-10 sm:pl-12 pr-4 text-sm focus:bg-white focus:border-blue-200 outline-none transition-all font-medium"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-500 ml-1 animate-shake">{errors.name}</p>
                  )}
                </div>

                {/* UID */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center pr-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Unique ID
                    </label>
                    <button
                      type="button"
                      onClick={handleSuggestUid}
                      disabled={isSuggestingUid}
                      className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1 hover:underline disabled:opacity-50 transition-opacity"
                    >
                      {isSuggestingUid ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : (
                        <Sparkles size={10} />
                      )}
                      Suggest
                    </button>
                  </div>
                  <div className="relative group">
                    <AtSign
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.uId}
                      onChange={(e) =>
                        handleInputChange('uId', e.target.value.toLowerCase().replace(/\s/g, ''))
                      }
                      placeholder="username"
                      className="w-full bg-slate-50 border-2 border-transparent rounded-2xl sm:rounded-3xl py-3 sm:py-4 pl-10 sm:pl-12 pr-4 text-sm focus:bg-white focus:border-blue-200 outline-none transition-all font-medium"
                    />
                  </div>
                  {errors.uId && (
                    <p className="text-xs text-red-500 ml-1 animate-shake">{errors.uId}</p>
                  )}
                  {uidSuggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 px-1 animate-fadeIn">
                      {uidSuggestions.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            handleInputChange('uId', s);
                            setUidSuggestions([]);
                          }}
                          className="text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          @{s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Email
                  </label>
                  <div className="relative group">
                    <Mail
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                      size={18}
                    />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="hello@example.com"
                      className="w-full bg-slate-50 border-2 border-transparent rounded-2xl sm:rounded-3xl py-3 sm:py-4 pl-10 sm:pl-12 pr-4 text-sm focus:bg-white focus:border-blue-200 outline-none transition-all font-medium"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 ml-1 animate-shake">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                      size={18}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border-2 border-transparent rounded-2xl sm:rounded-3xl py-3 sm:py-4 pl-10 sm:pl-12 pr-12 text-sm focus:bg-white focus:border-blue-200 outline-none transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 ml-1 animate-shake">{errors.password}</p>
                  )}
                  {/* Password Strength */}
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength >= i
                            ? passwordStrength === 1
                              ? 'bg-red-500'
                              : passwordStrength === 2
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 ml-1">
                    {passwordStrength === 0 && 'Enter a password'}
                    {passwordStrength === 1 && 'Weak password'}
                    {passwordStrength === 2 && 'Good password'}
                    {passwordStrength === 3 && 'Strong password'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 & 3: Skills */}
          {(step === 2 || step === 3) && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {step === 2 ? '🎯 Skills you offer' : '📚 Skills you want to learn'}
                </h2>
                <p className="text-slate-500 text-sm mt-2">
                  Select up to {MAX_SKILLS} skills (optional)
                </p>
              </div>

              {/* Search */}
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={skillSearch}
                  onChange={e => setSkillSearch(e.target.value)}
                  placeholder="Search skills..."
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 pl-10 sm:pl-11 pr-4 text-sm outline-none focus:border-blue-200 transition"
                />
              </div>

              {/* Selected Skills */}
              {(step === 2 ? offeredSkills : seekingSkills).length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Selected ({(step === 2 ? offeredSkills : seekingSkills).length}/{MAX_SKILLS})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(step === 2 ? offeredSkills : seekingSkills).map(skill => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs font-bold animate-scaleIn"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleSkill(skill, step === 2 ? 'offered' : 'seeking')
                          }
                          className="hover:text-blue-900 text-lg leading-none"
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 max-h-60 sm:max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                  {filteredSkills.map(skill => {
                    const isSelected = (step === 2 ? offeredSkills : seekingSkills).includes(
                      skill.name
                    );
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() =>
                          handleToggleSkill(skill.name, step === 2 ? 'offered' : 'seeking')
                        }
                        className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border-2 text-xs font-bold text-left transition-all hover:scale-[1.02] ${
                          isSelected
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-500 text-blue-700 shadow-sm'
                            : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200'
                        }`}
                      >
                        {skill.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Avatar */}
          {step === 4 && (
            <div className="animate-fadeIn">
              <h2 className="text-xl sm:text-2xl font-black mb-6 text-center text-slate-900">
                🎨 Choose Your Avatar
              </h2>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-4 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                {getDiceBearAvatars(formData.uId || 'default').map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setSelectedAvatar(a)}
                    className={`rounded-full border-4 transition-all hover:scale-110 ${
                      selectedAvatar === a
                        ? 'border-blue-600 shadow-lg scale-105'
                        : 'border-transparent hover:border-slate-200'
                    }`}
                  >
                    <img src={a} className="rounded-full w-full" alt="avatar" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Background */}
          {step === 5 && (
            <div className="animate-fadeIn">
              <h2 className="text-xl sm:text-2xl font-black mb-6 text-center text-slate-900">
                🌈 Choose Profile Background
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                {BACKGROUNDS.map(bg => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setSelectedBackground(bg)}
                    className={`h-24 sm:h-28 rounded-xl overflow-hidden border-4 transition-all hover:scale-[1.02] ${
                      selectedBackground === bg
                        ? 'border-blue-600 shadow-lg'
                        : 'border-transparent hover:border-slate-200'
                    }`}
                  >
                    <img src={bg} className="w-full h-full object-cover" alt="background" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8 sm:mt-10">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 py-3 sm:py-4 rounded-2xl sm:rounded-3xl border-2 border-slate-200 text-slate-700 font-black hover:bg-slate-50 transition-all hover:shadow-md flex items-center justify-center gap-2"
            >
              <ChevronLeft size={20} />
              <span className="hidden sm:inline">Previous</span>
            </button>
          )}
          <button
            type="button"
            onClick={nextStep}
            disabled={!isStepValid || isLoading}
            className={`py-3 sm:py-4 rounded-2xl sm:rounded-3xl text-white font-black transition-all shadow-xl shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
            } ${step > 1 ? 'flex-1' : 'w-full'}`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>{step === MAX_STEPS ? 'Complete Setup' : 'Continue'}</span>
                {step < MAX_STEPS && <ChevronRight size={20} />}
              </>
            )}
          </button>
        </div>

        {/* Login Link */}
        {step === 1 && (
          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <a href="#" className="text-blue-600 font-bold hover:underline">
                Login
              </a>
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;