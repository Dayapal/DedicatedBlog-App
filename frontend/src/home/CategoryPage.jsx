import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiLayers, FiArrowRight, FiBookOpen } from "react-icons/fi";
import { useAuth } from "../context/AuthProvider";
import { GlassCard } from "../components/ui/GlassCard";
import { GlassBadge } from "../components/ui/GlassBadge";
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

function CategoryPage() {
  const { blogs } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBlogs = (blogs || [])
    .filter((blog) => (selectedCategory === "All" ? true : blog.category === selectedCategory))
    .filter((blog) =>
      searchTerm.trim() === ""
        ? true
        : blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.about?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FB2576]/10 dark:bg-[#FB2576]/20 text-[#FB2576] border border-[#FB2576]/25 text-xs font-bold uppercase tracking-wider">
          <FiLayers />
          <span>Curated Ecosystem</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Explore by Topic
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Filter and discover in-depth articles written by subject specialists
        </p>
      </div>

      {/* Category Pills & Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Pills */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <GlassBadge
                key={cat}
                clickable
                active={isSelected}
                size="md"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </GlassBadge>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search in topics..."
            className="glass-input w-full py-2 pl-9 pr-4 text-xs sm:text-sm font-normal rounded-full focus:border-[#332FD0]"
          />
        </div>
      </div>

      {/* Grid of Topic Cards */}
      <AnimatePresence mode="popLayout">
        {filteredBlogs.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredBlogs.map((blog) => (
              <motion.div
                key={blog._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <GlassCard
                  interactive
                  radius="lg"
                  className="!p-4 h-full flex flex-col group cursor-pointer"
                >
                  <Link to={`/blogs/${blog._id}`} className="flex flex-col h-full">
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-3 bg-gray-100 dark:bg-gray-800">
                      <SafeImage
                        src={blog.blogImage?.url}
                        alt={blog.title}
                        fallbackSrc="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&fit=crop"
                        type="cover"
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 text-white backdrop-blur-xs">
                          {blog.category}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] group-hover:text-[#FB2576] transition-colors line-clamp-2 leading-snug mb-1.5">
                      {blog.title}
                    </h3>

                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4 flex-1">
                      {blog.about}
                    </p>

                    <div className="pt-3 border-t border-[var(--glass-border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)] mt-auto">
                      <span className="truncate max-w-[120px]">By {blog.adminName || "Author"}</span>
                      <span className="text-[#332FD0] dark:text-[#B4B2FF] group-hover:text-[#FB2576] group-hover:translate-x-1 transition-all flex items-center gap-0.5 font-semibold">
                        Read <FiArrowRight className="text-[10px]" />
                      </span>
                    </div>
                  </Link>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <GlassCard className="text-center py-16 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#332FD0]/15 text-[#332FD0] flex items-center justify-center mx-auto text-xl">
              <FiBookOpen />
            </div>
            <h4 className="font-bold text-lg text-[var(--text-primary)]">
              No matching stories found
            </h4>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
              Try adjusting your category selection or search keywords.
            </p>
          </GlassCard>
        )}
      </AnimatePresence>
    </section>
  );
}

export default CategoryPage;
