import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiCompass } from "react-icons/fi";
import { GlassCard } from "../components/ui/GlassCard";
import { GlassButton } from "../components/ui/GlassButton";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <GlassCard radius="hero" className="!p-8 sm:!p-12 text-center max-w-lg shadow-2xl space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-7xl sm:text-9xl font-black bg-gradient-to-r from-[#747FDD] via-[#A78BFA] to-[#69D8F2] bg-clip-text text-transparent"
        >
          404
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Story Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
            The page or article you are looking for doesn't exist, has been archived, or moved to another URL.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/">
            <GlassButton variant="primary" size="md" icon={FiHome}>
              Back to Home
            </GlassButton>
          </Link>
          <Link to="/blogs">
            <GlassButton variant="secondary" size="md" icon={FiCompass}>
              Explore Stories
            </GlassButton>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};

export default NotFound;
