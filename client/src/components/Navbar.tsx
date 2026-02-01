import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Settings,
  Loader2,
  Search,
} from "lucide-react";
import NotificationDrawer, { NotificationItem } from "./NotificationDrawer";
import socket from "../sockets/socket";
import { authService } from "../services/authService";
import { notificationService } from "../services/notificationService";
import { showToast } from "../utils/toastDispatcher";
import showBrowserNotification from "../utils/showBrowserNotification";
import {
  User,
  SocketNotificationPayload,
  SocketPresencePayload,
} from "../types";
import { logout } from "../store/slices/authSlice";
import { AppDispatch, RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

interface NavbarProps {
  navigate?: (to: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ navigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const dispatch = useDispatch<AppDispatch>();
  const currentUser: User | null = useSelector(
    (state: RootState) => state.auth.user
  );
  // ---------- INITIAL DATA ----------
  useEffect(() => {
    const init = async () => {
      const [notifsRes, unread] = await Promise.all([
        notificationService.getNotifications(1, 15),
        notificationService.getUnreadCount(),
      ]);

      setNotifications(notifsRes.notifications);
      setUnreadCount(unread);
    };
    init();
  }, []);

  // ---------- SOCKET LISTENERS ----------
  useEffect(() => {
    if (!currentUser) return;

    const onNotification = (data: SocketNotificationPayload) => {
      const notif: NotificationItem = {
        id: crypto.randomUUID(),
        type: data.type,
        title: data.title,
        message: data.message,
        createdAt: new Date().toISOString(),
        isRead: false,
        link: data.link,
      };

      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((c) => c + 1);

      showToast(data.type, data.title, data.message);
      showBrowserNotification(data.title, data.message, data.link);
    };

    const onUserJoined = (data: SocketPresencePayload) => {
      if (data.userId !== currentUser.id) {
        showToast("INFO", "New Builder Joined", "Someone just came online 👋");
      }
    };

    socket.on("notification", onNotification);
    socket.on("userJoined", onUserJoined);

    return () => {
      socket.off("notification", onNotification);
      socket.off("userJoined", onUserJoined);
    };
  }, [currentUser]);

  // ---------- SCROLL EFFECT ----------
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ---------- LOGOUT ----------
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      dispatch(logout());
      navigate("/");
    } finally {
      setIsLoggingOut(false);
      setIsDropdownOpen(false);
    }
  };

  // ---------- UI ----------
  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "py-3 glass shadow-sm border-b border-slate-100"
          : "py-5 bg-white"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center gap-4">
          {/* Logo */}
          <div
            className="flex items-center gap-2 flex-shrink-0 cursor-pointer"
            onClick={() => navigate("/home")}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45" />
            </div>

            <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
              DevNexus
            </span>
          </div>


          {/* Desktop Nav Links */}
          <div className="hidden md:flex flex-grow justify-center">
            <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
              {[
                { to: "/home", label: "Home" },
                { to: "/search", label: "Search" },
                { to: "/chat", label: "Chat" },
                { to: "/matches", label: "Matches" },
              ].map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `
          relative px-4 py-1.5 text-sm font-medium rounded-full transition-all
          ${isActive
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                    }
        `
                  }
                >
                  {label}

                  {/* Active underline */}
                  <span
                    className={`
            absolute left-1/2 -bottom-1 h-[2px] w-4 -translate-x-1/2 rounded-full
            transition-all
            ${window.location.pathname === to
                        ? "bg-blue-600 opacity-100"
                        : "opacity-0"
                      }
          `}
                  />
                </NavLink>
              ))}
            </div>
          </div>


          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Notifications */}
            <button
              onClick={() => setIsNotifDrawerOpen(true)}
              className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors group"
            >
              <Bell
                size={22}
                className="group-active:scale-90 transition-transform"
              />

              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white text-[8px] font-black text-white flex items-center justify-center animate-in fade-in zoom-in">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-1 pr-2 hover:bg-slate-100 rounded-full transition-all border border-transparent hover:border-slate-200"
              >
                <img
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover"
                  src={
                    currentUser?.avatar ||
                    `https://picsum.photos/seed/${currentUser?.uId || "user"
                    }/100/100`
                  }
                />

                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-50 mb-1">
                    <p className="text-sm font-bold text-slate-900">
                      {currentUser?.name || "User"}
                    </p>
                    <p className="text-xs text-slate-500">
                      @{currentUser?.uId || "username"}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      navigate?.("/profile");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors text-left"
                  >
                    <UserIcon size={16} />
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      navigate?.("/settings");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors text-left"
                  >
                    <Settings size={16} />
                    Settings
                  </button>

                  <button
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left disabled:opacity-50"
                  >
                    {isLoggingOut ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <LogOut size={16} />
                    )}
                    Sign out
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        notifications={notifications}
        setNotifications={setNotifications}
        setUnreadCount={setUnreadCount}
        navigate={navigate || (() => { })}
      />
    </>
  );
};

export default Navbar;
