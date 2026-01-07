import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, CheckCircle2, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '../services/authService';

interface VerifyOtpPageProps {
  navigate: (to: string) => void;
}

const VerifyOtpPage: React.FC<VerifyOtpPageProps> = ({ navigate }) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [activeInput, setActiveInput] = useState(0);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Use URL search params instead of localStorage for stateless email flow
  const urlParams = new URLSearchParams(window.location.search);
  const userEmail = urlParams.get('email') || 'your email';

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setStatus('idle');

    if (value && index < 5) {
      setActiveInput(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      setActiveInput(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) return;

    setIsLoading(true);
    try {
      const res = await authService.verifyOtp(userEmail, fullOtp);
      if (res.success) {
        setStatus('success');
        toast.success('Account verified!');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setStatus('error');
        toast.error(res.message);
      }
    } catch (err: any) {
      setStatus('error');
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 -z-10" />
      
      <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onClick={() => navigate('/register')} className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
        <ArrowLeft size={20} /> Back
      </motion.button>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-blue-500/5 border border-slate-100 p-8 md:p-12 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Mail size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Check your email</h1>
          <p className="text-slate-500 text-sm font-medium px-4">
            We've sent a code to <br />
            <span className="text-slate-900 font-bold">{userEmail}</span>
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex justify-between gap-2 max-w-sm mx-auto">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={() => setActiveInput(index)}
                className={`w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-black rounded-2xl border-2 transition-all outline-none ${
                  activeInput === index ? 'border-blue-500' : status === 'error' ? 'border-red-200 bg-red-50 text-red-600' : 'border-slate-100 bg-slate-50'
                }`}
              />
            ))}
          </div>

          <button onClick={handleVerify} disabled={!isOtpComplete || isLoading || status === 'success'} className={`w-full py-4 rounded-3xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-2 ${isLoading ? 'bg-blue-400' : isOtpComplete && status !== 'success' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'Verify Email'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtpPage;