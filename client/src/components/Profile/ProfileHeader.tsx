
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Loader2, User as UserIcon, Type, Check, X, CheckCircle2, Calendar, Mail, UserPlus, Sparkles, Clock, UserCheck
} from 'lucide-react';
import { UserRoundCheck } from 'lucide-react';
import { matchService } from '../../services/matchService';
import { aiService } from '../../services/aiService';
import { toast } from 'sonner';
import { ProfileUserData } from '@/src/services/userService';

interface ProfileHeaderProps {
  user: ProfileUserData;
  isOwnProfile: boolean;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  editData: { name: string; bio: string };
  setEditData: (data: { name: string; bio: string }) => void;
  handleUpdateProfile: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'bg') => void;
  isUploading: 'avatar' | 'bg' | null;
  isUpdating: boolean;
  bgInputRef: React.RefObject<HTMLInputElement>;
  avatarInputRef: React.RefObject<HTMLInputElement>;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = (props) => {
  const {
    user, isOwnProfile, isEditing, setIsEditing, editData, setEditData,
    handleUpdateProfile, handleFileChange, isUploading, isUpdating,
    bgInputRef, avatarInputRef
  } = props;

  const [isRefiningBio, setIsRefiningBio] = useState(false);

  const handleAIRefineBio = async () => {
    if (!editData.bio.trim() || isRefiningBio) {
      return toast.info("Write a little something first so I can improve it!");
    }

    setIsRefiningBio(true);
    try {
      const res = await aiService.refineBio(editData.name, editData.bio);
      if (res.success) {
        setEditData({ ...editData, bio: res.data.refined });
        toast.success("Bio optimized! ✨");
      }
    } catch (err) {
      toast.error("Could not refine bio at this time.");
    } finally {
      setIsRefiningBio(false);
    }
  };

  const sendMatchRequest = async (targetUserId: string) => {
    try {
      const res = await matchService.sendRequest(targetUserId);
      if (res.id) {
        toast.success("Connection request sent!");
      }
    } catch (err) {
      toast.error("Could not send connection request.");
    }
  };

  const buttonConfig =
    user.status === "ACCEPTED"
      ? {
        text: "Connected",
        classes: "bg-green-50 text-green-500",
        icon: <UserCheck size={18} />,
      }
      : user.status === "PENDING"
        ? {
          text: "Request Sent",
          classes: "bg-yellow-50 text-yellow-500",
          icon: <Clock size={18} />,
        }
        : {
          text: "Connect",
          classes: "bg-blue-500 text-white hover:bg-blue-600",
          icon: <UserPlus size={18} />,
        };
        
        console.log('User status:', user);
  return (
    <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden mb-8">
      {/* Background Banner */}
      <div className="h-40 md:h-52 w-full relative group">
        <img
          src={user.background || 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80'}
          className="w-full h-full object-cover"
          alt="Background"
        />
        {isOwnProfile && (
          <button
            onClick={() => bgInputRef.current?.click()}
            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-bold"
          >
            {isUploading === 'bg' ? <Loader2 className="animate-spin" /> : <><Camera size={20} /> Change Banner</>}
          </button>
        )}
        <input type="file" ref={bgInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'bg')} />
      </div>

      <div className="p-6 md:p-10 pt-0 -mt-12 relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
        {/* Avatar */}
        <div className="relative group flex-shrink-0">
          <img
            src={user.avatar || `https://picsum.photos/seed/${user.uId}/200/200`}
            className="w-32 h-32 md:w-40 md:h-40 rounded-[48px] object-cover ring-8 ring-white shadow-xl"
            alt={user.name}
          />
          {isOwnProfile && (
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="absolute inset-0 bg-black/40 rounded-[48px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
            >
              {isUploading === 'avatar' ? <Loader2 className="animate-spin" size={24} /> : <Camera size={24} />}
            </button>
          )}
          <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
        </div>

        <div className="flex-grow w-full pt-14">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div key="edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bio</label>
                    <div className="relative group/bio">
                      <Type className="absolute left-4 top-3 text-slate-400" size={18} />
                      <textarea
                        value={editData.bio}
                        onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                        placeholder="Tell the community what you're building..."
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl py-3 pl-12 pr-12 text-sm font-medium outline-none transition-all resize-none min-h-[80px]"
                      />
                      <button
                        type="button"
                        onClick={handleAIRefineBio}
                        disabled={isRefiningBio}
                        className={`absolute right-3 bottom-3 p-2 rounded-xl transition-all ${isRefiningBio
                          ? 'bg-blue-100 text-blue-600 animate-pulse'
                          : 'bg-white text-slate-400 hover:text-blue-600 shadow-sm border border-slate-100'
                          }`}
                        title="Optimize Bio with AI"
                      >
                        <Sparkles size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleUpdateProfile} disabled={isUpdating} className="flex-grow bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg">
                    {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <><Check size={18} /> Save Profile</>}
                  </button>
                  <button onClick={() => setIsEditing(false)} className="bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2">
                    <X size={18} /> Cancel
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 flex items-center justify-center md:justify-start gap-2">
                    {user.name} <CheckCircle2 size={24} className="text-blue-500" />
                  </h1>
                  <p className="text-lg font-bold text-blue-600">@{user.uId}</p>
                </div>
                <div className="flex gap-3 justify-center md:justify-end">
                  {!isOwnProfile ? (
                    <button
                      disabled={user.status !== null}
                      onClick={() => sendMatchRequest(user.id)}
                      className={`px-8 py-3 ${buttonConfig.classes} rounded-2xl font-bold text-sm shadow-lg flex items-center gap-2`}
                    >
                      {buttonConfig.icon}
                      {buttonConfig.text}
                    </button>

                  ) : (
                    <button onClick={() => setIsEditing(true)} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-slate-800 transition-all">
                      Edit Profile
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!isEditing && (
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500 mt-2">
              <span className="flex items-center gap-1.5 font-medium"><Calendar size={16} /> Joined 2024</span>
              <span className="flex items-center gap-1.5 font-medium"><Mail size={16} /> {user.email}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;
