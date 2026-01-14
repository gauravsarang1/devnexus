import React from "react";
import { motion as m } from "framer-motion";
import { CheckCircle2, MessageSquare, Plus } from "lucide-react";
import { matchService } from "../services/matchService";
import { toast } from "sonner";

const motion = m as any;

interface SuggestedMatchesProps {
  suggestions?: any[];
  navigate: (to: string) => void;
}

const SuggestedMatches: React.FC<SuggestedMatchesProps> = ({
  suggestions = [],
  navigate,
}) => {
  const handleConnect = async (userId: string) => {
    try {
      await matchService.sendRequest(userId);
      toast.success("Swap request sent!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send request");
    }
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 md:px-6 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Suggested for You
            </h2>
            <p className="text-sm text-slate-500">
              Peers who match your current learning goals
            </p>
          </div>
          <button
            onClick={() => navigate("/search?type=suggestions")}
            className="text-sm font-bold text-blue-600 hover:underline"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map((user) => (
            <motion.div
              key={user.id}
              whileHover={{ y: -8 }}
              className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transition-all group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="relative flex-shrink-0 cursor-pointer"
                  onClick={() => navigate(`/profile?uId=${user.uId}`)}
                >
                  <img
                    src={
                      user.avatar ||
                      `https://picsum.photos/seed/${user.id}/200/200`
                    }
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-50"
                    alt={user.name}
                  />
                </div>
                <div>
                  <h4
                    className="font-bold text-slate-900 flex items-center gap-1 cursor-pointer"
                    onClick={() => navigate(`/profile?uId=${user.uId}`)}
                  >
                    {user.name}{" "}
                    <CheckCircle2 size={14} className="text-blue-500" />
                  </h4>
                  <p className="text-xs text-slate-500 truncate max-w-[150px]">
                    {user.bio || "SkillSwap Member"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    OFFERING
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {user.skills
                      ?.filter((s: any) => s.role === "TEACH")
                      .slice(0, 2)
                      .map((s: any) => (
                        <span
                          key={s.id}
                          className="px-3 py-1 bg-green-50 text-green-600 text-[11px] font-bold rounded-lg border border-green-100"
                        >
                          {s.skill.name}
                        </span>
                      ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    WANTS TO LEARN
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {user.skills
                      ?.filter((s: any) => s.role === "LEARN")
                      .slice(0, 2)
                      .map((s: any) => (
                        <span
                          key={s.id}
                          className="px-3 py-1 bg-blue-50 text-blue-600 text-[11px] font-bold rounded-lg border border-blue-100"
                        >
                          {s.skill.name}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleConnect(user.id)}
                  className="flex-grow flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} /> Connect
                </button>
                <button
                  onClick={() => navigate(`/profile?uId=${user.uId}`)}
                  className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  <MessageSquare size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuggestedMatches;
