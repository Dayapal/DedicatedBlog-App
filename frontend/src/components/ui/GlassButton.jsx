import React from "react";
import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-gradient-to-r from-[#747FDD] via-[#6571D8] to-[#454FA8] text-white shadow-lg shadow-[#747FDD]/25 hover:shadow-[#747FDD]/40 border border-white/20",
  secondary:
    "glass-panel text-[var(--text-primary)] hover:bg-[var(--glass-bg-hover)] border-[var(--glass-border)] shadow-sm",
  accent:
    "bg-gradient-to-r from-[#69D8F2] to-[#747FDD] text-[#0E0F19] font-semibold shadow-md shadow-[#69D8F2]/20 hover:shadow-[#69D8F2]/35",
  danger:
    "bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white shadow-md shadow-red-500/20 hover:shadow-red-500/35 border border-white/10",
  ghost:
    "bg-transparent hover:bg-[var(--glass-bg-subtle)] text-[var(--text-primary)] border-transparent",
};

const sizes = {
  sm: "px-3.5 py-1.5 text-xs rounded-xl gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-2xl gap-2",
  lg: "px-7 py-3.5 text-base rounded-2xl gap-2.5 font-medium",
  icon: "p-2.5 rounded-2xl",
};

export const GlassButton = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  icon: Icon,
  iconRight: IconRight,
  onClick,
  type = "button",
  ...props
}) => {
  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`
        inline-flex items-center justify-center font-medium cursor-pointer transition-all duration-200 select-none
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${disabled || loading ? "opacity-60 cursor-not-allowed filter grayscale-[20%]" : ""}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      ) : (
        <>
          {Icon && <Icon className="shrink-0 text-current text-base" />}
          {children}
          {IconRight && <IconRight className="shrink-0 text-current text-base" />}
        </>
      )}
    </motion.button>
  );
};

export default GlassButton;
