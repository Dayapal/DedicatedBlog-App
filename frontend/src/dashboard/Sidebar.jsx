import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiBookOpen,
  FiPenTool,
  FiUser,
  FiHome,
  FiLogOut,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiFeather,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import SafeImage from "../components/ui/SafeImage";

function Sidebar({ setComponent, currentComponent }) {
  const { profile, setIsAuthenticated, setProfile } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigateTo = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "My Blogs", id: "My Blogs", icon: FiBookOpen },
    { label: "Create Blog", id: "Create Blog", icon: FiPenTool },
    { label: "My Profile", id: "My Profile", icon: FiUser },
  ];

  const handleLogout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout", { withCredentials: true });
      toast.success(data.message || "Logged out successfully");
      localStorage.removeItem("jwt");
      setIsAuthenticated(false);
      setProfile(null);
      navigateTo("/login");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between p-6">
      {/* Top: Brand & User Identity */}
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--glass-border-subtle)]">
          <button
            onClick={() => navigateTo("/")}
            className="flex items-center gap-2 group cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3F0071] via-[#332FD0] to-[#FB2576] flex items-center justify-center text-white shadow-md shadow-[#332FD0]/30">
              <FiFeather size={16} />
            </div>
            <span className="font-extrabold text-base tracking-tight text-[var(--text-primary)]">
              Dedicated<span className="text-[#FB2576]">Blog</span>
            </span>
          </button>

          {/* Theme Switcher inside sidebar */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-xl flex items-center justify-center glass-panel text-[var(--text-secondary)] hover:text-[#FB2576] transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? <FiSun className="text-amber-400" size={15} /> : <FiMoon size={15} />}
          </button>
        </div>

        {/* User Card */}
        <div className="p-3.5 rounded-2xl glass-panel border border-[var(--glass-border-subtle)] flex items-center gap-3">
          <SafeImage
            src={profile?.photo?.url}
            alt={profile?.name || "Author"}
            type="avatar"
            className="w-11 h-11 rounded-2xl object-cover border border-[var(--glass-border)] shadow-sm shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-xs sm:text-sm text-[var(--text-primary)] truncate">
              {profile?.name || "Author"}
            </h3>
            <p className="text-[11px] text-[var(--text-muted)] truncate">
              {profile?.email || "author@dedicatedblog.com"}
            </p>
            <span className="inline-block mt-1 px-2 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#332FD0]/15 text-[#332FD0] dark:text-[#B4B2FF]">
              {profile?.role || "Author"}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="space-y-1.5 pt-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] px-3 mb-2">
            Workspace
          </p>
          {navItems.map((item) => {
            const isActive = currentComponent === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setComponent(item.id);
                  setMobileOpen(false);
                }}
                className={`
                  w-full relative px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-3 transition-all duration-200 cursor-pointer select-none text-left
                  ${
                    isActive
                      ? "text-white shadow-lg shadow-[#FB2576]/25"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg-subtle)]"
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActivePill"
                    className="absolute inset-0 bg-gradient-to-r from-[#FB2576] to-[#3F0071] rounded-2xl -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <item.icon className="text-base shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom: External Home & Logout */}
      <div className="pt-6 border-t border-[var(--glass-border-subtle)] space-y-1.5">
        <button
          onClick={() => navigateTo("/")}
          className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg-subtle)] flex items-center gap-3 transition-colors cursor-pointer"
        >
          <FiHome className="text-base" />
          <span>Public Home</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 flex items-center gap-3 transition-colors cursor-pointer"
        >
          <FiLogOut className="text-base" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Floating Trigger Pill */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 rounded-2xl glass-panel glass-specular flex items-center justify-center text-[var(--text-primary)] shadow-lg border border-[var(--glass-border)] cursor-pointer"
          aria-label="Open sidebar"
        >
          {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Desktop Persistent Floating Sidebar */}
      <aside className="hidden md:block w-72 h-[calc(100vh-2rem)] fixed top-4 left-4 z-40 glass-panel glass-specular rounded-[32px] border border-[var(--glass-border)] shadow-xl overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="relative w-72 max-w-[80vw] h-full glass-panel border-r border-[var(--glass-border)] shadow-2xl z-10"
            >
              <SidebarContent />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
