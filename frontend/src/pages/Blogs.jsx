import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiClock, FiEye, FiHeart, FiCompass, FiSliders } from "react-icons/fi";
import { useAuth } from "../context/AuthProvider";
import { GlassCard } from "../components/ui/GlassCard";
import { GlassBadge } from "../components/ui/GlassBadge";
import { BlogCardSkeleton } from "../components/ui/GlassSkeleton";
import SafeImage from "../components/ui/SafeImage";

const categories = [
  "All",
  "Technology",
  "Devotional",
  "Business",
  "Sports",
  "Health",
  "Tourism",
  "Entertainment",
];

const categoryVariantMap = {
  Technology: "indigo",
  Devotional: "purple",
  Sports: "royal",
  Tourism: "pink",
  Entertainment: "pink",
  Health: "indigo",
  Business: "purple",
};

function Blogs() {
  const { blogs, isLoading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // "newest", "views", "likes"
  const [visibleCount, setVisibleCount] = useState(8);
  const loaderRef = useRef(null);

  // Filtered and sorted blogs
  const filteredBlogs = useMemo(() => {
    let list = blogs || [];

    if (selectedCategory !== "All") {
      list = list.filter((b) => b.category === selectedCategory);
    }

    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.about?.toLowerCase().includes(q) ||
          b.adminName?.toLowerCase().includes(q)
      );
    }

    const sorted = [...list];
    if (sortBy === "newest") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "views") {
      sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === "likes") {
      sorted.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    }

    return sorted;
  }, [blogs, selectedCategory, searchTerm, sortBy]);

  const visibleBlogs = filteredBlogs.slice(0, visibleCount);

  // Infinite Scroll logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + 4);
        }
      },
      { threshold: 0.5 }
    );

    const target = loaderRef.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, []);

  const getReadTime = (content) => {
    if (!content) return "3 min";
    const words = content.trim().split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
  };

  return (
    <div className="min-h-screen pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass-panel border border-[var(--glass-border)] text-xs font-semibold text-[#332FD0] dark:text-[#B4B2FF] uppercase tracking-wider">
          <FiCompass />
          <span>Curated Publication Stream</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Explore All Stories
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-secondary)]">
          Discover insights across multiple categories, updated live with infinite smooth scrolling.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <GlassCard radius="panel" className="!p-4 sm:!p-6 mb-10 space-y-5">
        {/* Top Controls: Search & Sort */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-base pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, topic, or author..."
              className="glass-input w-full py-2.5 pl-10 pr-4 text-xs sm:text-sm font-normal rounded-2xl focus:border-[#332FD0]"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1">
              <FiSliders className="text-sm" /> Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-input py-2 px-3 text-xs font-medium rounded-xl cursor-pointer"
            >
              <option value="newest">Most Recent</option>
              <option value="views">Most Viewed</option>
              <option value="likes">Highest Liked</option>
            </select>
          </div>
        </div>

        {/* Category Pill Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <GlassBadge
              key={cat}
              clickable
              active={selectedCategory === cat}
              size="md"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </GlassBadge>
          ))}
        </div>
      </GlassCard>

      {/* Stories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      ) : visibleBlogs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {visibleBlogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: (index % 8) * 0.04 }}
                  className="h-full"
                >
                  <GlassCard
                    interactive
                    radius="lg"
                    className="!p-4 h-full flex flex-col group cursor-pointer"
                  >
                    <Link to={`/blogs/${blog._id}`} className="flex flex-col h-full">
                      {/* Image */}
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

                        {/* Category badge */}
                        <div className="absolute top-3 left-3">
                          <GlassBadge variant={categoryVariantMap[blog.category] || "primary"} size="sm">
                            {blog.category}
                          </GlassBadge>
                        </div>

                        {/* Read time */}
                        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] text-white flex items-center gap-1">
                          <FiClock /> {getReadTime(blog.about)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-2">
                        <h2 className="font-bold text-base sm:text-lg text-[var(--text-primary)] group-hover:text-[#FB2576] transition-colors line-clamp-2 leading-snug">
                          {blog.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                          {blog.about}
                        </p>
                      </div>

                      {/* Author & Stats Strip */}
                      <div className="pt-4 mt-4 border-t border-[var(--glass-border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                        <div className="flex items-center gap-2">
                          <SafeImage
                            src={blog.adminPhoto}
                            alt={blog.adminName || "Author"}
                            type="avatar"
                            className="w-7 h-7 rounded-full object-cover border border-[var(--glass-border)]"
                          />
                          <span className="font-medium text-[var(--text-secondary)] truncate max-w-[85px]">
                            {blog.adminName || "Author"}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 font-medium">
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
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Infinite Scroll Trigger / Skeleton */}
          {visibleCount < filteredBlogs.length && (
            <div ref={loaderRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          )}
        </>
      ) : (
        <GlassCard className="text-center py-16 space-y-3">
          <p className="text-base text-[var(--text-secondary)]">
            No stories match your search or filter criteria.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchTerm("");
            }}
            className="text-xs font-semibold text-[#332FD0] dark:text-[#B4B2FF] hover:text-[#FB2576] underline cursor-pointer"
          >
            Reset Filters
          </button>
        </GlassCard>
      )}
    </div>
  );
}

export default Blogs;
