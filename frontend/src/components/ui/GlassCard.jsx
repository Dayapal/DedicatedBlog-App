import React from "react";
import { motion } from "framer-motion";

const radiusClasses = {
  sm: "rounded-xl",       // 12px
  md: "rounded-2xl",      // 16px
  lg: "rounded-3xl",      // 24px
  panel: "rounded-[28px]",// 28px
  hero: "rounded-[32px]", // 32px
};

export const GlassCard = ({
  children,
  className = "",
  radius = "lg",
  interactive = false,
  specular = true,
  onClick,
  ...props
}) => {
  const Component = interactive ? motion.div : "div";
  const radiusClass = radiusClasses[radius] || radiusClasses.lg;

  const motionProps = interactive
    ? {
        whileHover: { y: -4, transition: { duration: 0.25, ease: "easeOut" } },
        whileTap: { scale: 0.99 },
      }
    : {};

  return (
    <Component
      onClick={onClick}
      className={`
        ${interactive ? "glass-panel-interactive" : "glass-panel"}
        ${specular ? "glass-specular" : ""}
        ${radiusClass}
        p-6
        ${className}
      `}
      {...motionProps}
      {...props}
    >
      {specular && <div className="glass-reflection" />}
      {children}
    </Component>
  );
};

export default GlassCard;
