import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail,
    ArrowLeft,
    Loader2,
    ShieldCheck,
    Lock,
    Eye,
    EyeOff,
    KeyRound,
} from "lucide-react";
import { toast } from "sonner";
import { authService } from "../services/authService";

interface ForgotPasswordPageProps {
    navigate: (to: string) => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
    navigate,
}) => {
    // Flow State
    const [step, setStep] = useState<1 | 2>(1);
    const [identifier, setIdentifier] = useState(""); // email or uId

    // Form State
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // UI State
    const [activeInput, setActiveInput] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Step 1: Request OTP
    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier) return;

        setIsLoading(true);
        try {
            await authService.requestForgetPasswordOTP(identifier);
            toast.success("Reset code sent to your email!");
            setStep(2);
            setStatus("idle");
        } catch (err: any) {
            toast.error(err.message || "User not found");
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify & Reset
    const handleResetPassword = async () => {
        const fullOtp = otp.join("");
        if (fullOtp.length < 6) return toast.error("Please enter the full OTP");
        if (password !== confirmPassword)
            return toast.error("Passwords do not match");
        if (password.length < 6)
            return toast.error("Password must be at least 6 characters");

        setIsLoading(true);
        try {
            await authService.forgetPasswordWithOTP(identifier, {
                otp: fullOtp,
                password,
            });
            setStatus("success");
            toast.success("Password reset successful!");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err: any) {
            setStatus("error");
            toast.error(err.message || "Invalid OTP or request expired");
        } finally {
            setIsLoading(false);
        }
    };

    // OTP Logic Helpers
    const handleOtpChange = (value: string, index: number) => {
        if (isNaN(Number(value))) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number,
    ) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] bg-blue-50/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 -z-10" />

            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => (step === 1 ? navigate("/login") : setStep(1))}
                className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors"
            >
                <ArrowLeft size={20} /> Back
            </motion.button>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white rounded-3xl sm:rounded-[40px] shadow-xl sm:shadow-2xl shadow-blue-500/5 border border-slate-100 p-6 sm:p-8 md:p-12 text-center"
            >
                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <ShieldCheck size={32} />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
                                Forgot Password?
                            </h1>
                            <p className="text-slate-500 text-sm font-medium mb-8">
                                Enter your Email or Username and we'll send you a reset code.
                            </p>

                            <div className="space-y-4">
                                <div className="relative">
                                    <Mail
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        size={20}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Email or User ID"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                                    />
                                </div>
                                <button
                                    onClick={handleRequestOtp}
                                    disabled={!identifier || isLoading}
                                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-lg hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 transition-all flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <Loader2 className="animate-spin" size={22} />
                                    ) : (
                                        "Send Reset Code"
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                                <KeyRound size={32} />
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 mb-2">
                                Set New Password
                            </h1>
                            <p className="text-slate-500 text-xs mb-6">
                                Code sent to{" "}
                                <span className="font-bold text-slate-700">{identifier}</span>
                            </p>

                            <div className="space-y-6">
                                {/* OTP Inputs */}
                                <div className="flex justify-between gap-2">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(e.target.value, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            onFocus={() => setActiveInput(index)}
                                            className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-black rounded-xl border-2 transition-all outline-none ${activeInput === index
                                                    ? "border-blue-500"
                                                    : status === "error"
                                                        ? "border-red-200 bg-red-50"
                                                        : "border-slate-100 bg-slate-50"
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Password Fields */}
                                <div className="space-y-3">
                                    <div className="relative">
                                        <Lock
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                            size={18}
                                        />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="New Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <Lock
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                            size={18}
                                        />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Confirm New Password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${confirmPassword && password !== confirmPassword
                                                    ? "border-red-200"
                                                    : "border-slate-100 focus:border-blue-500"
                                                }`}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleResetPassword}
                                    disabled={isLoading || status === "success"}
                                    className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${status === "success"
                                            ? "bg-green-500 text-white"
                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                        }`}
                                >
                                    {isLoading ? (
                                        <Loader2 className="animate-spin" size={22} />
                                    ) : status === "success" ? (
                                        "Success!"
                                    ) : (
                                        "Reset Password"
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;
