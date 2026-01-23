import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { User as UserIcon, Lock, Bell, Shield, Loader2 } from "lucide-react";
import MobileNav from "../components/MobileNav";
import SettingsSidebar from "../components/Settings/SettingsSidebar";
import AccountPane from "../components/Settings/AccountPane";
import SecurityPane from "../components/Settings/SecurityPane";
import NotificationsPane from "../components/Settings/NotificationsPane";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import SettingSkeleton from "../components/skeleton/SettingSkeleton";

const SettingsPage: React.FC<{ navigate: (to: string) => void }> = ({
  navigate,
}) => {
  const [activeTab, setActiveTab] = useState<
    "Account" | "Security" | "Notifications" | "Privacy"
  >("Account");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [accountData, setAccountData] = useState({
    name: "",
    uId: "",
    email: "",
  });
  const { user, isLoading: authLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  const [notifs, setNotifs] = useState({
    email: true,
    push: Notification.permission === "granted",
    matches: true,
  });

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        // Load account data
        if (user) {
          setAccountData({
            name: user.name,
            uId: user.uId,
            email: user.email,
          });
        }

        setNotifs((prev) => ({
          ...prev,
          push: Notification.permission === "granted",
        }));
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      loadSettings();
    }
  }, []);

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await userService.updateProfile(accountData);
      toast.success("Updated!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (current: string, next: string) => {
    setIsSaving(true);
    try {
      await userService.changePassword(current, next);
      toast.success("Password changed!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    let isSure = confirm("Are you sure you want to delete account?");
    if (!isSure) return;
    const response = await authService.delete();

    toast.success("Account deleted successfully");
    navigate("/");
  };

  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
  }

  const handlePushToggle = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        toast.error("Push not supported");
        return;
      }

      // ⛑ Ensure SW exists
      const reg =
        (await navigator.serviceWorker.getRegistration()) ??
        (await navigator.serviceWorker.register("/sw.js"));

      console.log("SW state:", reg.active?.state);

      const existingSub = await reg.pushManager.getSubscription();

      // 🔕 OFF
      if (existingSub) {
        await existingSub.unsubscribe();
        await userService.removePushSubscription();
        setNotifs((p) => ({ ...p, push: false }));
        toast.success("Push disabled");
        return;
      }

      // 🔔 ON
      const perm =
        Notification.permission === "default"
          ? await Notification.requestPermission()
          : Notification.permission;

      if (perm !== "granted") {
        toast.error("Permission denied");
        return;
      }

      const vapidKey = import.meta.env.VITE_PUBLIC_VAPID_KEY;
      if (!vapidKey) throw new Error("Missing VAPID key");

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      await userService.savePushSubscription(sub);
      setNotifs((p) => ({ ...p, push: true }));
      toast.success("Push enabled");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <SettingSkeleton />;
  }

  const tabs = [
    { id: "Account", icon: <UserIcon size={18} />, desc: "Personal info" },
    { id: "Security", icon: <Lock size={18} />, desc: "Authentication" },
    { id: "Notifications", icon: <Bell size={18} />, desc: "Alerts" },
    { id: "Privacy", icon: <Shield size={18} />, desc: "Visibility" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow pt-[100px] md:pt-[120px] pb-24 max-w-6xl mx-auto w-full px-4 md:px-6">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Settings
          </h1>
        </header>
        <div className="flex flex-col lg:flex-row gap-12">
          <SettingsSidebar
            tabs={tabs}
            activeTab={activeTab}
            onSelect={setActiveTab}
          />
          <section className="flex-grow bg-slate-50/50 rounded-[48px] p-8 md:p-12 border border-slate-100 min-h-[600px]">
            <AnimatePresence mode="wait">
              {activeTab === "Account" && (
                <AccountPane
                  key="account"
                  data={accountData}
                  setData={setAccountData}
                  onSave={handleUpdateAccount}
                  isSaving={isSaving}
                />
              )}
              {activeTab === "Security" && (
                <SecurityPane
                  key="security"
                  onSave={handleChangePassword}
                  onDelete={handleDeleteAccount}
                  isSaving={isSaving}
                />
              )}
              {activeTab === "Notifications" && (
                <NotificationsPane
                  key="notifs"
                  prefs={notifs}
                  onToggle={(k) =>
                    setNotifs({
                      ...notifs,
                      [k]: !notifs[k as keyof typeof notifs],
                    })
                  }
                  onPushActivate={handlePushToggle}
                  onPushTest={() => {}}
                  isSaving={isSaving}
                />
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>
      <MobileNav navigate={navigate} />
    </div>
  );
};

export default SettingsPage;
