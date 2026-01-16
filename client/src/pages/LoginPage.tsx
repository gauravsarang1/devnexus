
import React, { useState } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { authService } from '../services/authService';
import { setToken } from '../store/slices/authSlice';
import { AppDispatch } from '../store';
import { FcGoogle } from "react-icons/fc";
import { loginWithGoogle } from '../utils/googleLogin';

// Cast motion to any to avoid property existence errors in JSX
const motion = m as any;

interface LoginPageProps {
  navigate: (to: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const [emailORuId, setemailORuId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailORuId || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login(emailORuId, password);
      if (response.success && response.data.accessToken) {
        dispatch(setToken(response.data.accessToken));
        toast.success('Welcome back to SkillSwap!');
        // Small delay to ensure state is committed before potentially losing context on redirect
        setTimeout(() => {
           window.location.href = '/home';
        }, 100);
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 -z-10" />

      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Home
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-blue-500/10 border border-slate-100 p-8 md:p-12"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
            <div className="w-6 h-6 border-2 border-white rounded-sm rotate-45" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 mt-2 text-center">Login to your SkillSwap account and continue building.</p>
        </div>

        {/* Google Login Button*/}
        <button
          onClick={loginWithGoogle}
          className="w-full py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mb-6 shadow-sm"
        >
          <FcGoogle size={24} />
          <span className="font-bold text-slate-700">Continue with Google</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-grow h-px bg-slate-200" />
          <span className="text-sm text-slate-400 font-medium">or</span>
          <div className="flex-grow h-px bg-slate-200" />
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email or Username</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                type="text"
                value={emailORuId}
                onChange={(e) => setemailORuId(e.target.value)}
                placeholder="aryan@skillswap.com"
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <button type="button" className="text-xs font-bold text-blue-600 hover:underline">Forgot Password?</button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-12 text-slate-900 focus:bg-white focus:border-blue-100 outline-none transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-500/10 ${
              isLoading 
                ? 'bg-blue-400 text-white cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'
            }`}
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'Login'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/register')}
              className="text-blue-600 font-bold hover:underline"
            >
              Join the community
            </button>
          </p>
        </div>
      </motion.div>

      {/* Trust Badge */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-slate-400 text-xs font-medium flex items-center gap-2"
      >
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
        Verified Secure Knowledge Exchange
      </motion.div>
    </div>
  );
};

export default LoginPage;
