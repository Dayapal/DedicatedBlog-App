import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiTrendingUp, FiClock, FiArrowRight, FiEye, FiHeart, FiBookOpen, FiCompass } from "react-icons/fi";
import { useAuth } from "../context/AuthProvider";
import { GlassCard } from "../components/ui/GlassCard";
import { GlassBadge } from "../components/ui/GlassBadge";
import { BlogCardSkeleton } from "../components/ui/GlassSkeleton";

const categoryVariantMap = {
  Technology: "primary",
  Devotional: "purple",
  Sports: "cyan",
  Tourism: "pink",
  Entertainment: "pink",
  Health: "cyan",
  Business: "primary",
};

function Hero() {
  const { blogs, isLoading } = useAuth();
  const sortedBlogs = blogs ? [...blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];

  const getReadTime = (content) => {
    if (!content) return "3 min";
    const words = content.trim().split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
  };

  return (
    <section className="relative pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Hero Banner */}
      <div className="text-center max-w-4xl mx-auto space-y-6 mb-16 sm:mb-20">
        {/* Floating Android 16 Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-[var(--glass-border)] text-xs sm:text-sm font-medium text-[var(--color-primary)] shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#69D8F2] animate-pulse" />
          <span>Android 16 Expressive • Liquid Glass UI</span>
          <span className="text-[var(--text-muted)]">|</span>
          <span className="text-[var(--text-secondary)] font-normal">Next-Gen Publishing</span>
        </motion.div>

        {/* Hero Headline with Dual Gradient Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.12]"
        >
          Explore Ideas. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#747FDD] via-[#A78BFA] to-[#69D8F2] bg-clip-text text-transparent">
            Publish with Clarity.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed"
        >
          Immerse yourself in authentic perspectives on engineering, technology, culture, and lifestyle — wrapped in a fluid, translucent glass interface.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2"
        >
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#747FDD] via-[#6571D8] to-[#454FA8] text-white font-semibold text-sm sm:text-base shadow-xl shadow-[#747FDD]/30 hover:shadow-[#747FDD]/45 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <FiCompass className="text-lg" />
            <span>Start Reading</span>
            <FiArrowRight />
          </Link>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-2xl glass-panel text-[var(--text-primary)] hover:bg-[var(--glass-bg-hover)] font-semibold text-sm sm:text-base border border-[var(--glass-border)] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <FiBookOpen className="text-lg" />
            <span>Author Workspace</span>
          </Link>
        </motion.div>

        {/* Metric Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[var(--text-secondary)]"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#747FDD]/15 text-[#747FDD] flex items-center justify-center text-sm font-bold">
              {blogs?.length || 18}
            </div>
            <span className="text-xs sm:text-sm font-medium">Published Articles</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#69D8F2]/15 text-[#0E7490] dark:text-[#69D8F2] flex items-center justify-center text-sm font-bold">
              7+
            </div>
            <span className="text-xs sm:text-sm font-medium">Curated Topics</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#A78BFA]/15 text-[#6D28D9] dark:text-[#A78BFA] flex items-center justify-center text-sm font-bold">
              100%
            </div>
            <span className="text-xs sm:text-sm font-medium">Real-Time Sync</span>
          </div>
        </motion.div>
      </div>

      {/* Featured Grid Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              Latest Stories
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
              Fresh thoughts published by our community creators
            </p>
          </div>
          <Link
            to="/blogs"
            className="text-xs sm:text-sm font-semibold text-[#747FDD] hover:text-[#454FA8] flex items-center gap-1 transition-colors"
          >
            <span>View all</span>
            <FiArrowRight />
          </Link>
        </div>

        {/* Stories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : sortedBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedBlogs.slice(0, 4).map((blog, idx) => (
              <GlassCard
                key={blog._id || idx}
                interactive
                radius="lg"
                className="flex flex-col h-full group !p-4 cursor-pointer"
              >
                <Link to={`/blogs/${blog._id}`} className="flex flex-col h-full">
                  {/* Thumbnail */}
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800">
                    <img
                      src={blog.blogImage?.url || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&fit=crop"}
                      alt={blog.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Category Chip */}
                    <div className="absolute top-3 left-3">
                      <GlassBadge variant={categoryVariantMap[blog.category] || "primary"} size="sm">
                        {blog.category}
                      </GlassBadge>
                    </div>

                    {/* Reading time */}
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] text-white flex items-center gap-1">
                      <FiClock /> {getReadTime(blog.about)}
                    </div>
                  </div>

                  {/* Title & Excerpt */}
                  <div className="flex-1 space-y-2">
                    <h3 className="font-bold text-base sm:text-lg text-[var(--text-primary)] group-hover:text-[#747FDD] transition-colors line-clamp-2 leading-snug">
                      {blog.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                      {blog.about}
                    </p>
                  </div>

                  {/* Author Strip & Engagement */}
                  <div className="pt-4 mt-4 border-t border-[var(--glass-border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <div className="flex items-center gap-2">
                      <img
                        src={blog.adminPhoto || "/default-avatar.png"}
                        alt={blog.adminName || "Author"}
                        className="w-7 h-7 rounded-full object-cover border border-[var(--glass-border)]"
                      />
                      <span className="font-medium text-[var(--text-secondary)] truncate max-w-[80px]">
                        {blog.adminName || "Author"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="flex items-center gap-1">
                        <FiEye /> {blog.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiHeart className="text-rose-400" /> {blog.likes?.length || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              </GlassCard>
            ))}
          </div>
        ) : (
          <GlassCard className="text-center py-12">
            <p className="text-[var(--text-secondary)]">No stories published yet.</p>
          </GlassCard>
        )}
      </div>
    </section>
  );
}

export default Hero;
