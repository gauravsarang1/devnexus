import React from "react";
import { CheckCircle2, User as UserIcon } from "lucide-react";
import { User } from "../../types";

interface UserCardProps {
  user: User;
  onConnect: (id: string) => void;
  onNavigate: (path: string) => void;
  currentUser: User | null;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onConnect,
  onNavigate,
  currentUser,
}) => {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 flex flex-col sm:flex-row gap-6 hover:shadow-xl transition-all group">
      <div
        className="flex-shrink-0 cursor-pointer"
        onClick={() => onNavigate(`/profile?uId=${user.uId}`)}
      >
        <img
          src={user.avatar || `https://picsum.photos/seed/${user.id}/100/100`}
          className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-50"
          alt={user.name}
        />
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start mb-4">
          <div
            className="cursor-pointer"
            onClick={() => onNavigate(`/profile?uId=${user.uId}`)}
          >
            <h4 className="font-bold text-slate-900 flex items-center gap-1">
              {user.name}{" "}
              {user.isEmailVerified && (
                <CheckCircle2 size={14} className="text-blue-500" />
              )}
            </h4>
            <p className="text-xs text-slate-500 truncate">
              {user.bio || "SkillSwap Member"}
            </p>
          </div>
        </div>

        {user.skills && (
          <div className="flex flex-wrap gap-1 mb-4">
            {user.skills
              .filter((s) => s.role === "TEACH" || s.role === "LEARN")
              .slice(0, 2)
              .map((s) => (
                <span
                  key={s.id}
                  className="text-[10px] font-bold px-2 py-0.5 bg-green-50 text-green-600 rounded-md border border-green-100"
                >
                  {s.skill.name}
                </span>
              ))}
          </div>
        )}

        <div className="flex gap-2">
          {currentUser && currentUser.id === user.id ? (
            //show user to it is his own profile
            <div className="flex-grow">
              <span className="px-4 py-2.5 bg-slate-200 text-slate-500 rounded-xl font-bold text-sm shadow-inner select-none w-full block text-center">
                This is you
              </span>
            </div>
          ) : user.isConnected ? (
            <div className="flex-grow">
              <span className="px-4 py-2.5 bg-green-50 text-green-600 rounded-xl font-bold text-sm shadow-inner select-none w-full block text-center">
                Connected
              </span>
            </div>
          ) : (
            <button
              onClick={() => onConnect(user.id)}
              className="flex-grow px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
            >
              Connect
            </button>
          )}
          <button
            onClick={() => onNavigate(`/profile?uId=${user.uId}`)}
            className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200"
          >
            <UserIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
