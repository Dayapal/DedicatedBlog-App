import React from "react";
import { motion } from "framer-motion";

const variantStyles = {
  default: "bg-[var(--glass-bg)] text-[var(--text-primary)] border-[var(--glass-border)]",
  primary: "bg-[#747FDD]/15 text-[#747FDD] border-[#747FDD]/30 dark:bg-[#747FDD]/25 dark:text-[#A8B0FF]",
  cyan: "bg-[#69D8F2]/15 text-[#0E7490] border-[#69D8F2]/30 dark:bg-[#69D8F2]/20 dark:text-[#69D8F2]",
  purple: "bg-[#A78BFA]/15 text-[#6D28D9] border-[#A78BFA]/30 dark:bg-[#A78BFA]/20 dark:text-[#C4B5FD]",
  pink: "bg-[#F0A6D8]/18 text-[#BE185D] border-[#F0A6D8]/35 dark:bg-[#F0A6D8]/20 dark:text-[#F472B6]",
  success: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
  active: "bg-gradient-to-r from-[#747FDD] to-[#454FA8] text-white border-transparent shadow-md shadow-[#747FDD]/30",
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
