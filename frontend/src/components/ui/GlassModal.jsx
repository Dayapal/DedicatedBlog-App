import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseSharp } from "react-icons/io5";

export const GlassModal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-2xl",
  showClose = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-md"
          />

          {/* Modal Surface */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`
              relative w-full ${maxWidth} glass-panel glass-specular rounded-[28px] p-6 sm:p-8
              border border-[var(--glass-border)] shadow-2xl z-10 my-auto
            `}
          >
            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--glass-border-subtle)]">
                {title && (
                  <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                    {title}
                  </h3>
                )}
                {showClose && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg-subtle)] transition-colors ml-auto cursor-pointer"
                    aria-label="Close dialog"
                  >
                    <IoCloseSharp size={22} />
                  </button>
                )}
              </div>
            )}

            {/* Modal Body */}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GlassModal;
