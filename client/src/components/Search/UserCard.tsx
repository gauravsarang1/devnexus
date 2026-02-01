import React from "react";
import { CheckCircle2, User as UserIcon } from "lucide-react";
import { User } from "../../types";
import { ProfileUserData } from "@/src/services/userService";

interface UserCardProps {
  user: ProfileUserData;
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
  const isMe = currentUser?.id === user.id;

  return (
    <div className="group bg-white border border-slate-100 rounded-3xl p-4 sm:p-6 flex gap-4 sm:gap-6 hover:shadow-xl transition-all">
      
      {/* Avatar */}
      <div
        onClick={() => onNavigate(`/profile?uId=${user.uId}`)}
        className="flex-shrink-0 cursor-pointer"
      >
        <img
          src={user.avatar || `https://picsum.photos/seed/${user.id}/100/100`}
          alt={user.name}
          className="
            w-14 h-14 sm:w-20 sm:h-20
            rounded-2xl object-cover
            ring-2 ring-slate-50
            group-hover:ring-blue-100 transition
          "
        />
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0 flex flex-col justify-between">
        
        {/* Name + bio */}
        <div
          className="cursor-pointer"
          onClick={() => onNavigate(`/profile?uId=${user.uId}`)}
        >
          <h4 className="font-bold text-slate-900 flex items-center gap-1 text-sm sm:text-base truncate">
            {user.name}
            {user.isEmailVerified && (
              <CheckCircle2 size={14} className="text-blue-500 flex-shrink-0" />
            )}
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 truncate mt-0.5">
            {user.bio || "DevNexus Member"}
          </p>
        </div>

        {/* Skills */}
        {user.skills && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {user.skills
              .filter((s) => s.role === "TEACH" || s.role === "LEARN")
              .slice(0, 2)
              .map((s) => (
                <span
                  key={s.id}
                  className="
                    text-[10px] sm:text-[11px]
                    font-bold px-2 py-0.5
                    rounded-md
                    bg-gradient-to-r from-green-50 to-blue-50
                    text-slate-700
                    border border-slate-100
                  "
                >
                  {s.skill.name}
                </span>
              ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          {isMe ? (
            <span className="flex-grow py-2 text-center text-xs sm:text-sm font-bold rounded-xl bg-slate-100 text-slate-500">
              This is you
            </span>
          ) : user.isConnected ? (
            <span className={`flex-grow py-2 text-center text-xs sm:text-sm font-bold rounded-xl bg-green-50 ${user.status === 'CONNECTED' ? 'text-green-600' : user.status === 'PENDING' ? 'text-yellow-600' : 'text-green-600'}`}>
              {user.status === 'CONNECTED' ? 'Connected' : user.status === 'PENDING' ? 'Request Sent' : 'Connected'}
            </span>
          ) : (
            <button
              onClick={() => onConnect(user.id)}
              className="
                flex-grow py-2
                text-xs sm:text-sm font-bold
                rounded-xl
                bg-blue-600 text-white
                hover:bg-blue-700
                transition
              "
            >
              Connect
            </button>
          )}

          <button
            onClick={() => onNavigate(`/profile?uId=${user.uId}`)}
            className="
              w-9 h-9 sm:w-10 sm:h-10
              flex items-center justify-center
              rounded-xl
              bg-slate-100 text-slate-500
              hover:bg-slate-200 transition
            "
          >
            <UserIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
