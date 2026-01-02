
import React from 'react';
import { motion as m } from 'framer-motion';

// Cast motion to any to avoid property existence errors in JSX
const motion = m as any;

const Audience: React.FC = () => {
  const personas = [
    { role: "The Developer", benefit: "Teach Backend, learn UI/UX for your side projects.", color: "bg-blue-50", emoji: "👨‍💻" },
    { role: "The Student", benefit: "Swap English tutoring for Python coding help.", color: "bg-green-50", emoji: "🎓" },
    { role: "The Creator", benefit: "Trade video editing tips for growth marketing secrets.", color: "bg-purple-50", emoji: "📸" },
    { role: "The Designer", benefit: "Master Figma prototyping while teaching branding.", color: "bg-orange-50", emoji: "🎨" },
    { role: "The Freelancer", benefit: "Learn client negotiation while sharing SEO hacks.", color: "bg-red-50", emoji: "💼" }
  ];

  return (
    <section id="audience" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">Is this for you?</h2>
          <p className="text-slate-600 text-lg">SkillSwap is built for everyone who believes in the power of peer-learning.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {personas.map((p, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`${p.color} p-8 rounded-3xl border border-slate-100 w-full sm:w-[300px] flex flex-col items-center text-center`}
            >
              <div className="text-5xl mb-6">{p.emoji}</div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">{p.role}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{p.benefit}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Audience;
