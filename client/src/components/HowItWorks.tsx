
import React from 'react';
import { motion as m } from 'framer-motion';
import { UserPlus, Search, MessageSquare, TrendingUp } from 'lucide-react';

// Cast motion to any to avoid property existence errors in JSX
const motion = m as any;

const HowItWorks: React.FC = () => {
  const steps = [
    { 
      icon: <UserPlus className="text-blue-600" />, 
      title: "Create Profile", 
      desc: "List the skills you have and what you crave to learn next." 
    },
    { 
      icon: <Search className="text-blue-600" />, 
      title: "Get Matched", 
      desc: "Our AI matches you with peers whose needs align with your skills." 
    },
    { 
      icon: <MessageSquare className="text-blue-600" />, 
      title: "Chat & Swap", 
      desc: "Jump into our secure workspace. Screen-share, chat, and build." 
    },
    { 
      icon: <TrendingUp className="text-blue-600" />, 
      title: "Grow Together", 
      desc: "Validate each other's skills and climb the community leaderboard." 
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">Simple. Fast. Fun.</h2>
          <p className="text-slate-600 text-lg">Four steps to start your peer-to-peer learning journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative p-8 bg-slate-50 rounded-3xl group border border-transparent hover:border-blue-100 transition-all"
            >
              <div className="absolute top-6 right-8 text-4xl font-black text-slate-100 group-hover:text-blue-100 transition-colors">
                0{idx + 1}
              </div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md mb-6 relative z-10">
                {step.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
