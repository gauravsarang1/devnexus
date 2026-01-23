import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { authService } from "../services/authService";

interface VerifyOtpPageProps {
  navigate: (to: string) => void;
}

const VerifyOtpPage: React.FC<VerifyOtpPageProps> = ({ navigate }) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [activeInput, setActiveInput] = useState(0);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Use URL search params instead of localStorage for stateless email flow
  const urlParams = new URLSearchParams(window.location.search);
  const userEmail = urlParams.get("email") || "your email";

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
    setStatus("idle");

    if (value && index < 5) {
      setActiveInput(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveInput(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) return;

    setIsLoading(true);
    try {
      const res = await authService.verifyOtp(userEmail, fullOtp);

      setStatus("success");
      toast.success("Account verified!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 py-8 sm:p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] bg-blue-50/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 -z-10" />

      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/register")}
        className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors"
      >
        <ArrowLeft size={20} /> Back
      </motion.button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="
      w-full max-w-md bg-white
      rounded-3xl sm:rounded-[40px]
      shadow-xl sm:shadow-2xl shadow-blue-500/5
      border border-slate-100
      p-6 sm:p-8 md:p-12
      text-center
    "
      >
        <div className="mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 text-blue-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-inner">
            <Mail size={28} className="sm:hidden" />
            <Mail size={32} className="hidden sm:block" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
            Check your email
          </h1>

          <p className="text-slate-500 text-sm font-medium px-2 sm:px-4">
            We've sent a code to <br />
            <span className="text-slate-900 font-bold break-all">
              {userEmail}
            </span>
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div className="flex justify-between gap-2 max-w-xs sm:max-w-sm mx-auto">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={() => setActiveInput(index)}
                className={`
              w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16
              text-center text-xl sm:text-2xl font-black
              rounded-xl sm:rounded-2xl
              border-2 transition-all outline-none
              ${
                activeInput === index
                  ? "border-blue-500"
                  : status === "error"
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-slate-100 bg-slate-50"
              }
            `}
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={!isOtpComplete || isLoading || status === "success"}
            className={`
          w-full py-3.5 sm:py-4
          rounded-2xl sm:rounded-3xl
          font-black text-base sm:text-lg
          shadow-lg sm:shadow-xl
          transition-all flex items-center justify-center gap-2
          ${
            isLoading
              ? "bg-blue-400"
              : isOtpComplete && status !== "success"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-400"
          }
        `}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              "Verify Email"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtpPage;
