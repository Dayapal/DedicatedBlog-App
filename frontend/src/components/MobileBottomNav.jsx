import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function MobileBottomNav() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const pathname = location.pathname;

  // Don't display on auth pages
  if (["/login", "/register"].includes(pathname)) {
    return null;
  }

  const navItems = [
    {
      to: "/",
      label: "Home",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      active: pathname === "/",
    },
    {
      to: "/blogs",
      label: "Explore",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      active: pathname === "/blogs",
    },
    {
      to: "/creators",
      label: "Authors",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      active: pathname === "/creators",
    },
    {
      to: isAuthenticated ? "/dashboard" : "/login",
      label: isAuthenticated ? "Studio" : "Sign In",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      active: pathname.startsWith("/dashboard"),
    },
  ];

  return (
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm">
      <nav
        aria-label="Mobile Bottom Navigation"
        className="flex items-center justify-around py-2 px-3 rounded-full bg-white/80 dark:bg-[#141524]/85 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-xl shadow-black/10"
      >
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all duration-200 relative ${
              item.active
                ? "text-indigo-600 dark:text-indigo-400 font-bold scale-105"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {item.icon}
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            {item.active && (
              <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-indigo-500" />
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}
