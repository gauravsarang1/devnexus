
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { User as UserIcon, Lock, Bell, Shield, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import Footer from '../components/Footer';
import SettingsSidebar from '../components/Settings/SettingsSidebar';
import AccountPane from '../components/Settings/AccountPane';
import SecurityPane from '../components/Settings/SecurityPane';
import NotificationsPane from '../components/Settings/NotificationsPane';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { toast } from 'sonner';

const SettingsPage: React.FC<{ navigate: (to: string) => void }> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState<'Account' | 'Security' | 'Notifications' | 'Privacy'>('Account');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [accountData, setAccountData] = useState({ name: '', uId: '', email: '' });
  const [notifs, setNotifs] = useState({ email: true, push: Notification.permission === 'granted', matches: true });

  useEffect(() => {
    authService.me().then(res => {
      if (res.success && res.data) {
        setAccountData({ name: res.data.name, uId: res.data.uId, email: res.data.email });
        setNotifs(prev => ({ ...prev, push: Notification.permission === 'granted' }));
      }
      setIsLoading(false);
    });
  }, []);

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try { await userService.updateProfile(accountData); toast.success("Updated!"); } 
    catch (err) { toast.error("Failed"); } finally { setIsSaving(false); }
  };

  const handleChangePassword = async (current: string, next: string) => {
    setIsSaving(true);
    try { await userService.changePassword(current, next); toast.success("Password changed!"); } 
    catch (err: any) { toast.error(err.response?.data?.errors?.message || "Failed"); } 
    finally { setIsSaving(false); }
  };

  const handlePushActivate = async () => {
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: new Uint8Array([]) }); // Simplified for demo
      await userService.savePushSubscription(sub);
      setNotifs(prev => ({ ...prev, push: true }));
      toast.success("Push active!");
    }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  const tabs = [
    { id: 'Account', icon: <UserIcon size={18} />, desc: 'Personal info' },
    { id: 'Security', icon: <Lock size={18} />, desc: 'Authentication' },
    { id: 'Notifications', icon: <Bell size={18} />, desc: 'Alerts' },
    { id: 'Privacy', icon: <Shield size={18} />, desc: 'Visibility' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar navigate={navigate} />
      <main className="flex-grow pt-[100px] md:pt-[120px] pb-24 max-w-6xl mx-auto w-full px-4 md:px-6">
        <header className="mb-10"><h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Settings</h1></header>
        <div className="flex flex-col lg:flex-row gap-12">
          <SettingsSidebar tabs={tabs} activeTab={activeTab} onSelect={setActiveTab} />
          <section className="flex-grow bg-slate-50/50 rounded-[48px] p-8 md:p-12 border border-slate-100 min-h-[600px]">
            <AnimatePresence mode="wait">
              {activeTab === 'Account' && <AccountPane key="account" data={accountData} setData={setAccountData} onSave={handleUpdateAccount} isSaving={isSaving} />}
              {activeTab === 'Security' && <SecurityPane key="security" onSave={handleChangePassword} onDelete={() => {}} isSaving={isSaving} />}
              {activeTab === 'Notifications' && <NotificationsPane key="notifs" prefs={notifs} onToggle={(k) => setNotifs({...notifs, [k]: !notifs[k as keyof typeof notifs]})} onPushActivate={handlePushActivate} onPushTest={() => {}} isSaving={isSaving} />}
            </AnimatePresence>
          </section>
        </div>
      </main>
      <MobileNav navigate={navigate} />
    </div>
  );
};

export default SettingsPage;
