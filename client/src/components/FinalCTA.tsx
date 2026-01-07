
import React from 'react';
import { motion as m } from 'framer-motion';

// Cast motion to any to avoid property existence errors in JSX
const motion = m as any;

interface FinalCTAProps {
  navigate: (to: string) => void;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ navigate }) => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-600 to-blue-500 rounded-[40px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-blue-500/20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Ready to start swapping?
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto font-medium">
            Join the fastest growing community of learners in India. Your next big skill is just one match away.
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <motion.button 
              onClick={() => navigate('/home')}
              animate={{ 
                boxShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 20px rgba(255,255,255,0.4)", "0 0 0px rgba(255,255,255,0)"]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-12 py-5 bg-white text-blue-600 rounded-full text-xl font-bold shadow-2xl"
            >
              Join SkillSwap
            </motion.button>
            <p className="text-blue-100/60 text-sm font-medium">Free forever. No credit card required.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
