import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { Sparkles, CheckCircle2, BookOpen, Zap, Loader2 } from "lucide-react";
import MobileNav from "../components/MobileNav";
import ProfileHeader from "../components/Profile/ProfileHeader";
import SkillBadge from "../components/Profile/SkillBadge";
import AddSkillModal from "../components/Profile/AddSkillModal";
import ProfileStats from "../components/Profile/ProfileStats";
import { userService } from "../services/userService";
import { matchService } from "../services/matchService";
import { skillService } from "../services/skillService";
import { mediaService } from "../services/mediaService";
import { fetchCurrentUser } from "../store/slices/authSlice";
import { AppDispatch } from "../store";
import { toast } from "sonner";
import { User, SkillLevel, SkillRole, Skill } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import ProfileSkeleton from "../components/skeleton/ProfileSkeleton";

const ProfilePage: React.FC<{ navigate: (to: string) => void }> = ({
  navigate,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState<"avatar" | "bg" | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [mutualSkills, setMutualSkills] = useState<any[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [isAddingSkill, setIsAddingSkill] = useState<SkillRole | null>(null);
  const [editData, setEditData] = useState({ name: "", bio: "" });

  const currentUser: User | null = useSelector(
    (state: RootState) => state.auth.user
  );

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const urlParams = new URLSearchParams(window.location.search);
  const profileUid = urlParams.get("uId");
  const isOwnProfile = !profileUid;

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        if (profileUid && profileUid !== currentUser?.uId) {
          const data = await userService.getProfile(profileUid);
          setUser(data);
          const mutual = await matchService.getMutualSkills(data.id);
          setMutualSkills(mutual);
        } else {
          if (currentUser) {
            setUser(currentUser);
            setEditData({ name: currentUser.name, bio: currentUser.bio || "" });
            navigate("/profile");
          }
        }
        const skillsData = await skillService.getAllSkills();
        setAllSkills(skillsData.skills);
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [profileUid]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsUpdating(true);
    try {
      const updatedUser = await userService.updateProfile(editData);
      setUser((prev) => (prev ? { ...prev, ...updatedUser } : updatedUser));
      setIsEditing(false);
      if (isOwnProfile) dispatch(fetchCurrentUser());
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "bg"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(type);
    try {
      const imageUrl = await mediaService.uploadImage(file);
      const updateData =
        type === "avatar" ? { avatar: imageUrl } : { background: imageUrl };
      await userService.updateProfile(updateData);
      setUser((prev) => (prev ? { ...prev, ...updateData } : null));
      if (isOwnProfile) dispatch(fetchCurrentUser());
      toast.success(`${type === "avatar" ? "Photo" : "Banner"} updated!`);
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(null);
    }
  };

  const handleSkillAction = async (
    id: string,
    action: "remove" | "update",
    level?: SkillLevel
  ) => {
    try {
      if (action === "remove") await skillService.removeUserSkill(id);
      else if (level) await skillService.updateUserSkill(id, level);
      dispatch(fetchCurrentUser());
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const handleAddSkill = async (
    skill: Skill | { name: string; isNew: boolean },
    level: SkillLevel
  ) => {
    if (!isAddingSkill) return;
    try {
      const isNew = "isNew" in skill;
      await skillService.addUserSkill({
        skillId: isNew ? undefined : (skill as Skill).id,
        skillName: isNew ? (skill as any).name : undefined,
        role: isAddingSkill,
        level,
      });
      setIsAddingSkill(null);
      dispatch(fetchCurrentUser());
      toast.success("Skill added!");
    } catch (err) {
      toast.error("Failed to add skill");
    }
  };

  if (isLoading || !user) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow pt-[100px] md:pt-[120px] pb-24 md:pb-12 px-4 md:px-6 max-w-4xl mx-auto w-full">
        <ProfileHeader
          user={user}
          isOwnProfile={isOwnProfile}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editData={editData}
          setEditData={setEditData}
          handleUpdateProfile={handleUpdateProfile}
          handleFileChange={handleFileChange}
          isUploading={isUploading}
          isUpdating={isUpdating}
          bgInputRef={bgInputRef}
          avatarInputRef={avatarInputRef}
        />

        {profileUid && mutualSkills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[32px] p-8 mb-12 text-white shadow-xl relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-[24px] flex items-center justify-center flex-shrink-0 border border-white/30 shadow-lg">
                <Sparkles size={32} />
              </div>
              <div className="text-center sm:text-left flex-grow">
                <h4 className="text-xl font-black mb-2 tracking-tight">
                  Collaboration Potential! ✨
                </h4>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {mutualSkills.map((ms, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-xl text-xs font-bold"
                    >
                      {ms.learningFromThem ? "Learn" : "Teach"} {ms.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Sparkles size={16} />
                </span>{" "}
                About
              </h3>
              <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
                <p className="text-slate-600 leading-relaxed font-medium">
                  {user.bio || "No bio added yet."}
                </p>
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                    <CheckCircle2 size={16} />
                  </span>{" "}
                  Expertise
                </h3>
                {isOwnProfile && (
                  <button
                    onClick={() => setIsAddingSkill("TEACH")}
                    className="p-2 px-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold"
                  >
                    + Add Skill
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {user.skills
                  ?.filter((s) => s.role === "TEACH")
                  .map((s) => (
                    <SkillBadge
                      key={s.id}
                      skill={s}
                      isOwnProfile={isOwnProfile}
                      onUpdateLevel={(id, lvl) =>
                        handleSkillAction(id, "update", lvl)
                      }
                      onRemove={(id) => handleSkillAction(id, "remove")}
                    />
                  ))}
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <BookOpen size={16} />
                  </span>{" "}
                  Learning Goals
                </h3>
                {isOwnProfile && (
                  <button
                    onClick={() => setIsAddingSkill("LEARN")}
                    className="p-2 px-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold"
                  >
                    + Add Goal
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {user.skills
                  ?.filter((s) => s.role === "LEARN")
                  .map((s) => (
                    <SkillBadge
                      key={s.id}
                      skill={s}
                      isOwnProfile={isOwnProfile}
                      onUpdateLevel={(id, lvl) =>
                        handleSkillAction(id, "update", lvl)
                      }
                      onRemove={(id) => handleSkillAction(id, "remove")}
                    />
                  ))}
              </div>
            </section>
          </div>
          <div className="space-y-8">
            <ProfileStats />
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isAddingSkill && (
          <AddSkillModal
            role={isAddingSkill}
            allSkills={allSkills}
            onAdd={handleAddSkill}
            onClose={() => setIsAddingSkill(null)}
          />
        )}
      </AnimatePresence>
      <MobileNav navigate={navigate} />
    </div>
  );
};

export default ProfilePage;
