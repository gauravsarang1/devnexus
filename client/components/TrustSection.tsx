
import React from 'react';
import { motion as m } from 'framer-motion';
import { CheckCircle, Shield, Heart, Globe } from 'lucide-react';

// Cast motion to any to avoid property existence errors in JSX
const motion = m as any;

const TrustSection: React.FC = () => {
  const points = [
    { icon: <Shield className="text-blue-500" />, title: "No money involved", desc: "Pure knowledge exchange. We value your time, not your wallet." },
    { icon: <CheckCircle className="text-blue-500" />, title: "Learn by doing", desc: "Build real projects with real people. Practice > Theory." },
    { icon: <Heart className="text-blue-500" />, title: "Community-driven", desc: "Vetted by users like you. A supportive ecosystem for growth." },
    { icon: <Globe className="text-blue-500" />, title: "Built for India", desc: "Tailored for the unique needs of Indian students and professionals." }
  ];

  return (
    <section className="py-24 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {points.map((p, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                {p.icon}
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">{p.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
