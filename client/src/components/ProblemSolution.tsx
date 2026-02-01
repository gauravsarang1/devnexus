
import React from 'react';
import { motion as m } from 'framer-motion';
import { XCircle, CheckCircle2, DollarSign, Users, Target, Zap } from 'lucide-react';

// Cast motion to any to avoid property existence errors in JSX
const motion = m as any;

const ProblemSolution: React.FC = () => {
  const problems = [
    { icon: <DollarSign className="text-red-400" />, title: "Expensive Courses", desc: "Premium bootcamps cost a fortune, and YouTube is a rabbit hole." },
    { icon: <Users className="text-red-400" />, title: "Zero Collaboration", desc: "Learning solo is slow and boring. No one to build with." },
    { icon: <Target className="text-red-400" />, title: "No Practical Depth", desc: "Certificates look good, but you lack real project experience." }
  ];

  const solutions = [
    { icon: <Zap className="text-blue-500" />, title: "Exchange Directly", desc: "Trade skills 1:1. You teach UI, they teach API dev. Fair & free." },
    { icon: <CheckCircle2 className="text-blue-500" />, title: "Build Together", desc: "DevNexus matches you with peers to ship real-world apps." },
    { icon: <Users className="text-blue-500" />, title: "Verified Partners", desc: "Learn from real developers and designers, not recorded bots." }
  ];

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">Why DevNexus?</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">Traditional learning is broken. We're here to fix it by putting the community at the center.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Problem Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-slate-400 flex items-center gap-2 mb-8">
              <XCircle size={20} /> THE OLD WAY
            </h3>
            {problems.map((p, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 flex gap-4 group hover:shadow-lg transition-all">
                <div className="mt-1">{p.icon}</div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-red-500 transition-colors">{p.title}</h4>
                  <p className="text-slate-500">{p.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Solution Side */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-blue-600 flex items-center gap-2 mb-8">
              <CheckCircle2 size={20} /> THE DevNexus WAY
            </h3>
            {solutions.map((s, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border-2 border-blue-100 flex gap-4 shadow-xl shadow-blue-500/5 group hover:border-blue-300 transition-all">
                <div className="mt-1">{s.icon}</div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{s.title}</h4>
                  <p className="text-slate-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
