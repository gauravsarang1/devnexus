import React from "react";

const AppLoader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#FFFFFF] z-50 overflow-hidden">
            {/* BACKGROUND LAYER: Subtle Developer Grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(#2563EB 1px, transparent 1px), linear-gradient(90deg, #2563EB 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                }}
            ></div>

            <div className="relative flex flex-col items-center">
                {/* VISUAL STACK */}
                <div className="relative flex items-center justify-center w-32 h-32 mb-8">
                    {/* Ambient Glow: Adds depth and premium feel */}
                    <div className="absolute w-24 h-24 bg-[#2563EB] rounded-full blur-[40px] opacity-10 animate-pulse"></div>

                    {/* Outer Ring: Slow, elegant rotation with a "gap" for sophistication */}
                    <svg
                        className="absolute inset-0 w-full h-full animate-spin-slow"
                        viewBox="0 0 100 100"
                    >
                        <circle
                            cx="50"
                            cy="50"
                            r="48"
                            fill="none"
                            stroke="#DBEAFE"
                            strokeWidth="1.5"
                            strokeDasharray="180 100"
                        />
                    </svg>

                    {/* Inner Ring: Counter-rotating and pulsing */}
                    <div className="absolute w-[75%] h-[75%] border border-[#3B82F6]/30 rounded-full animate-reverse-spin-slow">
                        <div className="absolute -top-1 left-1/2 w-1.5 h-1.5 bg-[#3B82F6] rounded-full shadow-[0_0_8px_#3B82F6]"></div>
                    </div>

                    {/* The Logo: Sharp, geometric, and stable */}
                    <div className="relative z-10 w-14 h-14 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-[0_8px_30px_rgb(37,99,235,0.2)] border border-white/10 animate-logo-entrance">
                        {/* The rotated inner square */}
                        <div className="w-5 h-5 bg-white rotate-45 rounded-sm shadow-inner"></div>
                    </div>
                </div>

                {/* TEXT STACK */}
                <div className="hidden sm:flex flex-col items-center text-center">
                    <h1 className="text-[#0F172A] text-3xl font-black tracking-tighter mb-1 animate-text-reveal">
                        DevNexus
                    </h1>
                    <div className="h-[1px] w-8 bg-[#CBD5E1] mb-3 animate-line-grow"></div>
                    <p className="text-[#64748B] text-xs font-semibold uppercase tracking-[0.2em] animate-fade-in-up">
                        Connect. Learn. Build.
                    </p>
                </div>
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes logo-entrance {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes text-reveal {
          0% { transform: translateY(10px); opacity: 0; filter: blur(5px); }
          100% { transform: translateY(0); opacity: 1; filter: blur(0); }
        }
        @keyframes line-grow {
          0% { width: 0; opacity: 0; }
          100% { width: 32px; opacity: 1; }
        }
        @keyframes fade-in-up {
          0% { transform: translateY(5px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        .animate-spin-slow {
          animation: spin-slow 6s linear infinite;
        }
        .animate-reverse-spin-slow {
          animation: reverse-spin 10s linear infinite;
        }
        .animate-logo-entrance {
          animation: logo-entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-text-reveal {
          animation: text-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
        }
        .animate-line-grow {
          animation: line-grow 1s ease-out 0.8s both;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out 1s both;
        }
      `,
                }}
            />
        </div>
    );
};

export default AppLoader;
