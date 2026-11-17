import React from "react";
import { motion } from "framer-motion";

export const GlassTabs = ({ tabs, activeTab, onChange, className = "" }) => {
  return (
    <div
      className={`glass-pill p-1.5 inline-flex items-center gap-1.5 flex-wrap max-w-full overflow-x-auto ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id || activeTab === tab;
        const tabId = tab.id || tab;
        const tabLabel = tab.label || tab;

        return (
          <button
            key={tabId}
            onClick={() => onChange(tabId)}
            className={`
              relative px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-colors duration-200 cursor-pointer select-none whitespace-nowrap
              ${
                isActive
                  ? "text-white"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }
            `}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-gradient-to-r from-[#FB2576] to-[#3F0071] rounded-full shadow-md shadow-[#FB2576]/35 -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon && <tab.icon className="text-base" />}
              {tabLabel}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default GlassTabs;
