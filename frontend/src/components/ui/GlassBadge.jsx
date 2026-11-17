import React from "react";
import { motion } from "framer-motion";

const variantStyles = {
  default: "bg-[var(--glass-bg)] text-[var(--text-primary)] border-[var(--glass-border)]",
  primary: "bg-[#332FD0]/15 text-[#332FD0] border-[#332FD0]/30 dark:bg-[#332FD0]/25 dark:text-[#B4B2FF]",
  indigo: "bg-[#332FD0]/15 text-[#332FD0] border-[#332FD0]/30 dark:bg-[#332FD0]/25 dark:text-[#B4B2FF]",
  purple: "bg-[#3F0071]/15 text-[#3F0071] border-[#3F0071]/30 dark:bg-[#3F0071]/35 dark:text-[#E2C7FF]",
  pink: "bg-[#FB2576]/15 text-[#FB2576] border-[#FB2576]/35 dark:bg-[#FB2576]/22 dark:text-[#FB2576] font-semibold",
  royal: "bg-[#0002A1]/15 text-[#0002A1] border-[#0002A1]/30 dark:bg-[#0002A1]/35 dark:text-[#B5B7FF]",
  success: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
  active: "bg-gradient-to-r from-[#FB2576] to-[#3F0071] text-white border-transparent shadow-md shadow-[#FB2576]/30",
};

export const GlassBadge = ({
  children,
  variant = "default",
  active = false,
  clickable = false,
  size = "md",
  className = "",
  onClick,
  ...props
}) => {
  const Component = clickable ? motion.button : "span";
  const activeStyle = active ? variantStyles.active : variantStyles[variant] || variantStyles.default;

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs rounded-lg gap-1",
    md: "px-3.5 py-1 text-xs rounded-full gap-1.5 font-medium",
    lg: "px-4 py-1.5 text-sm rounded-full gap-2 font-medium",
  };

  const motionProps = clickable
    ? {
        whileHover: { scale: 1.05, transition: { duration: 0.15 } },
        whileTap: { scale: 0.95 },
      }
    : {};

  return (
    <Component
      onClick={onClick}
      className={`
        inline-flex items-center backdrop-blur-md border transition-all duration-200 select-none
        ${activeStyle}
        ${sizeStyles[size] || sizeStyles.md}
        ${clickable ? "cursor-pointer" : ""}
        ${className}
      `}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default GlassBadge;
