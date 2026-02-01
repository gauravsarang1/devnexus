import React from "react";
import { motion } from "framer-motion";
import {
  Code,
  Palette,
  Megaphone,
  Music,
  Camera,
  Globe,
  Sparkles,
} from "lucide-react";

interface SkillDiscoveryProps {
  skills?: any[];
  navigate: (to: string) => void;
}

const SkillDiscovery: React.FC<SkillDiscoveryProps> = ({
  skills = [],
  navigate,
}) => {
  const categories = ["All", "Tech", "Design", "Marketing", "Art", "Business"];

  const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("react") || n.includes("node") || n.includes("python"))
      return <Code size={20} />;
    if (n.includes("design") || n.includes("figma"))
      return <Palette size={20} />;
    if (n.includes("market") || n.includes("seo"))
      return <Megaphone size={20} />;
    return <Sparkles size={20} />;
  };

  const getColor = (idx: number) => {
    const colors = [
      { text: "text-blue-600", bg: "bg-blue-50" },
      { text: "text-purple-600", bg: "bg-purple-50" },
      { text: "text-orange-600", bg: "bg-orange-50" },
      { text: "text-red-600", bg: "bg-red-50" },
      { text: "text-green-600", bg: "bg-green-50" },
      { text: "text-cyan-600", bg: "bg-cyan-50" },
    ];
    return colors[idx % colors.length];
  };

  return (
    <section className="py-12 px-4 md:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Explore Skills
            </h2>
            <p className="text-sm text-slate-500">
              What the DevNexus community is learning right now
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                i === 0
                  ? "bg-slate-900 text-white shadow-lg"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide">
          {skills.map((skill, idx) => {
            const { text, bg } = getColor(idx);
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/search?skill=${skill.name}`)}
                className="shrink-0 w-50 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer"
              >
                <div
                  className={`w-12 h-12 ${bg} ${text} rounded-2xl flex items-center justify-center mb-4 shadow-inner`}
                >
                  {getIcon(skill.name)}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Trending
                </p>
                <h4 className="text-lg font-bold text-slate-900">
                  {skill.name}
                </h4>
                <p className="text-[10px] text-slate-400 mt-2">
                  {skill.popularity} Swappers
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillDiscovery;
