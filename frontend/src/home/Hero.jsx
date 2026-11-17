import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiClock, FiArrowRight, FiEye, FiHeart, FiBookOpen, FiCompass } from "react-icons/fi";
import { useAuth } from "../context/AuthProvider";
import { GlassCard } from "../components/ui/GlassCard";
import { GlassBadge } from "../components/ui/GlassBadge";
import { BlogCardSkeleton } from "../components/ui/GlassSkeleton";
import SafeImage from "../components/ui/SafeImage";

const categoryVariantMap = {
  Technology: "indigo",
  Devotional: "purple",
  Sports: "royal",
  Tourism: "pink",
  Entertainment: "pink",
  Health: "indigo",
  Business: "purple",
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
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-[#3F0071]/30 backdrop-blur-xl border border-[#332FD0]/20 dark:border-white/15 text-xs sm:text-sm font-semibold shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#FB2576] shadow-[0_0_8px_#FB2576] animate-pulse" />
          <span className="text-[#3F0071] dark:text-[#E2C7FF]">Android 16 Expressive</span>
          <span className="text-gray-400 dark:text-white/30">•</span>
          <span className="text-[#332FD0] dark:text-[#B4B2FF]">Liquid Glass UI</span>
          <span className="text-gray-400 dark:text-white/30 hidden sm:inline">|</span>
          <span className="text-gray-600 dark:text-gray-300 font-normal hidden sm:inline">Next-Gen Publishing</span>
        </motion.div>

        {/* Hero Headline with Dual Gradient Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.12]"
        >
          Explore Ideas. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#3F0071] via-[#FB2576] to-[#332FD0] bg-clip-text text-transparent">
            Publish with Clarity.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-normal"
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
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#332FD0] via-[#3A1CA2] to-[#3F0071] text-white font-semibold text-sm sm:text-base shadow-xl shadow-[#332FD0]/30 hover:shadow-[#FB2576]/25 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <FiCompass className="text-lg" />
            <span>Start Reading</span>
            <FiArrowRight />
          </Link>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-2xl bg-white/85 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 text-gray-900 dark:text-white font-semibold text-sm sm:text-base border border-gray-300/80 dark:border-white/20 shadow-md hover:shadow-lg hover:border-[#332FD0]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 backdrop-blur-md"
          >
            <FiBookOpen className="text-lg text-[#332FD0] dark:text-[#B4B2FF]" />
            <span>Author Workspace</span>
          </Link>
        </motion.div>

        {/* Metric Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="pt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 shadow-xs">
            <div className="min-w-[34px] px-2 h-7 rounded-xl bg-[#332FD0]/15 text-[#332FD0] dark:text-[#B4B2FF] flex items-center justify-center text-xs font-bold">
              {blogs?.length || 18}
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">Published Articles</span>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 shadow-xs">
            <div className="min-w-[34px] px-2 h-7 rounded-xl bg-[#FB2576]/15 text-[#FB2576] flex items-center justify-center text-xs font-bold">
              7+
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">Curated Topics</span>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 shadow-xs">
            <div className="min-w-[42px] px-2 h-7 rounded-xl bg-[#3F0071]/15 text-[#3F0071] dark:text-[#E2C7FF] flex items-center justify-center text-xs font-bold">
              100%
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">Real-Time Sync</span>
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
            className="text-xs sm:text-sm font-semibold text-[#332FD0] dark:text-[#B4B2FF] hover:text-[#FB2576] flex items-center gap-1 transition-colors"
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
                    <SafeImage
                      src={blog.blogImage?.url}
                      alt={blog.title}
                      fallbackSrc="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&fit=crop"
                      type="cover"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    
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
                    <h3 className="font-bold text-base sm:text-lg text-[var(--text-primary)] group-hover:text-[#FB2576] transition-colors line-clamp-2 leading-snug">
                      {blog.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                      {blog.about}
                    </p>
                  </div>

                  {/* Author Strip & Engagement */}
                  <div className="pt-4 mt-4 border-t border-[var(--glass-border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <div className="flex items-center gap-2">
                      <SafeImage
                        src={blog.adminPhoto}
                        alt={blog.adminName || "Author"}
                        type="avatar"
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
                        <FiHeart className="text-[#FB2576]" /> {blog.likes?.length || 0}
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
