import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineMenu } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
import { FiSun, FiMoon, FiLogOut, FiLayout, FiLogIn, FiFeather } from "react-icons/fi";
import { useAuth } from "../context/AuthProvider";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import toast from "react-hot-toast";

function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { isAuthenticated, setIsAuthenticated, setProfile } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Explore", path: "/blogs" },
    { label: "Creators", path: "/creators" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const handleLogout = async (e) => {
    e?.preventDefault();
    try {
      const { data } = await axios.get("/api/user/logout", {
        withCredentials: true,
      });
      toast.success(data.message || "Logged out successfully");
      localStorage.removeItem("jwt");
      setIsAuthenticated(false);
      setProfile(null);
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Failed to logout");
    }
  };

  return (
    <>
      <header className="fixed top-3 sm:top-5 inset-x-0 z-50 px-3 sm:px-6 max-w-6xl mx-auto">
        <nav className="glass-panel glass-specular rounded-full px-4 sm:px-6 py-2.5 sm:py-3 shadow-lg flex items-center justify-between border border-[var(--glass-border)] transition-all duration-300">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group cursor-pointer select-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-[#3F0071] via-[#332FD0] to-[#FB2576] flex items-center justify-center text-white shadow-md shadow-[#332FD0]/30 group-hover:scale-105 transition-transform duration-300">
              <FiFeather className="text-lg sm:text-xl" />
            </div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Dedicated<span className="bg-gradient-to-r from-[#FB2576] to-[#332FD0] bg-clip-text text-transparent">Blog</span>
            </span>
          </Link>

          {/* Desktop Navigation Links (Pill Style) */}
          <div className="hidden md:flex items-center gap-1 bg-[var(--glass-bg-subtle)] p-1.5 rounded-full border border-[var(--glass-border-subtle)]">
            {menuItems.map((item) => {
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`
                    relative px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors duration-200
                    ${
                      isActive
                        ? "text-white"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navActiveIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-[#FB2576] to-[#3F0071] rounded-full shadow-md shadow-[#FB2576]/35 -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Actions: Theme Toggle, Dashboard / Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark / Light Toggle */}
            <motion.button
              whileTap={{ scale: 0.9, rotate: 15 }}
              onClick={toggleTheme}
              aria-label="Toggle theme mode"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg-subtle)] border border-[var(--glass-border-subtle)] transition-colors cursor-pointer"
            >
              {isDark ? (
                <FiSun className="text-amber-400 text-lg" />
              ) : (
                <FiMoon className="text-[#332FD0] text-lg" />
              )}
            </motion.button>

            {/* Dashboard Link for Admin/Author or Logged in User */}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider bg-[#332FD0]/10 dark:bg-[#332FD0]/25 text-[#332FD0] dark:text-[#B4B2FF] hover:bg-[#332FD0]/20 border border-[#332FD0]/30 transition-all duration-200 active:scale-95"
              >
                <FiLayout className="text-sm" />
                <span>Dashboard</span>
              </Link>
            )}

            {/* Auth Buttons */}
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#332FD0] to-[#3F0071] text-white shadow-md shadow-[#332FD0]/30 hover:shadow-lg hover:shadow-[#FB2576]/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <FiLogIn className="text-sm" />
                <span>Login</span>
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider bg-[#FB2576]/10 dark:bg-[#FB2576]/20 text-[#FB2576] hover:bg-[#FB2576]/20 border border-[#FB2576]/30 transition-all duration-200 cursor-pointer active:scale-95"
              >
                <FiLogOut className="text-sm" />
                <span>Logout</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle navigation menu"
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--glass-bg-subtle)] border border-[var(--glass-border-subtle)] transition-colors cursor-pointer"
            >
              {showMobileMenu ? <IoCloseSharp size={22} /> : <AiOutlineMenu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Glass Navigation Drawer */}
      {showMobileMenu && (
        <div
          className="fixed top-20 inset-x-4 z-40 md:hidden glass-panel glass-specular rounded-3xl p-6 border border-[var(--glass-border)] shadow-2xl space-y-4 animate-fade-in"
        >
          <nav className="flex flex-col space-y-2">
            {menuItems.map((item) => {
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={`
                    px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 flex items-center justify-between
                    ${
                      isActive
                        ? "bg-gradient-to-r from-[#FB2576] to-[#3F0071] text-white shadow-md shadow-[#FB2576]/25"
                        : "text-[var(--text-primary)] hover:bg-[var(--glass-bg-subtle)]"
                    }
                  `}
                >
                  <span>{item.label}</span>
                  <span className="text-xs opacity-60">→</span>
                </Link>
              );
            })}

            {isAuthenticated && (
              <Link
                to="/dashboard"
                onClick={() => setShowMobileMenu(false)}
                className="px-4 py-3 rounded-2xl text-sm font-semibold bg-[#332FD0]/15 text-[#332FD0] dark:text-[#B4B2FF] border border-[#332FD0]/30 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <FiLayout /> Dashboard
                </span>
                <span className="text-xs">→</span>
              </Link>
            )}

            {isAuthenticated && (
              <button
                onClick={(e) => {
                  handleLogout(e);
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold text-rose-500 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer"
              >
                <FiLogOut /> Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </>
  );
}

export default Navbar;
