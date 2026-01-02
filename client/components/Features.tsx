
import React from 'react';
import { motion as m } from 'framer-motion';
import { ShieldCheck, Zap, MessageCircle, Star, Users, BrainCircuit } from 'lucide-react';

// Cast motion to any to avoid property existence errors in JSX
const motion = m as any;

const Features: React.FC = () => {
  const features = [
    { 
      icon: <BrainCircuit />, 
      title: "Smart Matching", 
      desc: "Algorithms that find your perfect learning partner based on level and interest." 
    },
    { 
      icon: <MessageCircle />, 
      title: "Live Collab Space", 
      desc: "Integrated chat, file-sharing, and interactive whiteboards for smooth swapping." 
    },
    { 
      icon: <Star />, 
      title: "Skill Verification", 
      desc: "Earn badges and endorsements from peers you've actually helped." 
    },
    { 
      icon: <ShieldCheck />, 
      title: "Safe Environment", 
      desc: "Vetted profiles and report systems ensure a respectful community." 
    },
    { 
      icon: <Users />, 
      title: "Local Chapters", 
      desc: "Connect with students from your own university or city in India." 
    },
    { 
      icon: <Zap />, 
      title: "Matching streaks", 
      desc: "Stay consistent and unlock premium mentorship features by swapping daily." 
    }
  ];

  return (
    <section id="features" className="py-24 bg-slate-900 text-white overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-20">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for the next generation of builders.</h2>
            <p className="text-slate-400 text-lg">We've combined the best of social networks and learning platforms into one seamless experience.</p>
          </div>
          <button className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors">
            View All Features
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h4 className="text-xl font-bold mb-4">{f.title}</h4>
              <p className="text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
