import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Clock, ArrowRight } from "lucide-react";
import { User } from "../types";

/* ---------- Types ---------- */

interface ChatParticipant {
  name: string;
  avatar?: string | null;
  id: string
}

interface ChatMessage {
  text?: string | null;
}

interface RecentChat {
  id: string;
  participants: ChatParticipant[];
  messages: ChatMessage[];
}

interface ActivityData {
  recentChats?: RecentChat[];
  pendingRequests?: number;
}

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  sub: string;
  icon: React.ReactNode;
  avatar?: string | null;
  color: string;
  link: string;
}

interface ResumeActivityProps {
  activity?: ActivityData;
  user?: User;
  navigate: (to: string) => void;
}

/* ---------- Component ---------- */

const ResumeActivity: React.FC<ResumeActivityProps> = ({
  activity,
  user,
  navigate,
}) => {
  const currentUserName = user?.name ?? "User";

  const chatActivities: ActivityItem[] =
    activity?.recentChats?.map((chat) => {
      const partner = chat.participants.find(
        (p) => p.name !== currentUserName
      );

      return {
        id: chat.id,
        type: "chat",
        title: `Chat with ${partner?.name ?? "Partner"}`,
        sub: chat.messages?.[0]?.text ?? "Start collaborating!",
        icon: <MessageCircle size={18} />,
        avatar: partner?.avatar ?? null,
        color: "bg-blue-100 text-blue-600",
        link: "/chat",
      };
    }) ?? [];

  const activities: ActivityItem[] = [
    ...chatActivities,
    {
      id: "pending",
      type: "match",
      title: `${activity?.pendingRequests ?? 0} Pending Requests`,
      sub: "Review incoming swaps",
      icon: <Clock size={18} />,
      color: "bg-orange-100 text-orange-600",
      link: "/matches",
    },
  ].slice(0, 3);

  return (
    <section className="py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-bold text-slate-900 mb-8">
          Continue Your Journey
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((act) => (
            <motion.div
              key={act.id}
              whileHover={{ x: 5 }}
              onClick={() => navigate(act.link)}
              className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4 min-w-0">
                {act.avatar ? (
                  <img
                    src={act.avatar}
                    alt="avatar"
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                ) : (
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${act.color}`}
                  >
                    {act.icon}
                  </div>
                )}

                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    {act.sub}
                  </p>
                </div>
              </div>

              <ArrowRight
                size={16}
                className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all flex-shrink-0"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResumeActivity;
