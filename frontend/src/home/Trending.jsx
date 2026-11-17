import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import { FiTrendingUp, FiEye, FiHeart, FiArrowRight } from "react-icons/fi";
import "react-multi-carousel/lib/styles.css";
import api from "../services/api";
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

function Trending() {
  const { blogs } = useAuth();
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await api.get("/api/blogs/trending");
        if (data && data.length > 0) {
          setTrendingBlogs(data);
        } else if (blogs && blogs.length > 0) {
          setTrendingBlogs(blogs.slice(0, 8));
        }
      } catch (error) {
        console.error("Trending fetch error:", error);
        if (blogs && blogs.length > 0) {
          setTrendingBlogs(blogs.slice(0, 8));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, [blogs]);

  const displayedBlogs = trendingBlogs.length > 0 ? trendingBlogs : (blogs || []).slice(0, 8);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 4 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FB2576]/10 dark:bg-[#FB2576]/20 text-[#FB2576] border border-[#FB2576]/25 text-xs font-bold uppercase tracking-wider mb-2">
            <FiTrendingUp />
            <span>Community Heatmap</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Trending Discussions
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
            Articles scored by views, likes, and active comments
          </p>
        </div>

        <Link
          to="/blogs"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#332FD0] dark:text-[#B4B2FF] hover:text-[#FB2576] transition-colors px-3 py-1.5 rounded-xl hover:bg-[#332FD0]/10"
        >
          <span>Explore all trending</span>
          <FiArrowRight />
        </Link>
      </div>

      {/* Carousel */}
      {loading && displayedBlogs.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
        </div>
      ) : displayedBlogs.length > 0 ? (
        <div className="-mx-3">
          <Carousel
            responsive={responsive}
            infinite
            autoPlay
            autoPlaySpeed={3500}
            transitionDuration={600}
            containerClass="pb-4"
            itemClass="px-3"
            draggable
            swipeable
          >
            {displayedBlogs.map((element, idx) => (
              <GlassCard
                key={element._id || idx}
                interactive
                radius="panel"
                className="!p-4 h-full flex flex-col group cursor-pointer"
              >
                <Link to={`/blogs/${element._id}`} className="flex flex-col h-full">
                  {/* Thumbnail with Rank Badge */}
                  <div className="relative w-full h-52 rounded-2xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800">
                    <SafeImage
                      src={element.blogImage?.url}
                      alt={element.title}
                      fallbackSrc="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&fit=crop"
                      type="cover"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />

                    {/* Rank Badge */}
                    <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-gradient-to-r from-[#FB2576] to-[#3F0071] text-white flex items-center justify-center font-bold text-xs shadow-md shadow-[#FB2576]/30">
                      #{idx + 1}
                    </div>

                    {/* Category Chip */}
                    <div className="absolute top-3 right-3">
                      <GlassBadge variant={categoryVariantMap[element.category] || "primary"} size="sm">
                        {element.category}
                      </GlassBadge>
                    </div>
                  </div>

                  {/* Title & Preview */}
                  <div className="flex-1 space-y-2">
                    <h3 className="font-bold text-base sm:text-lg text-[var(--text-primary)] group-hover:text-[#FB2576] transition-colors line-clamp-2 leading-snug">
                      {element.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                      {element.about}
                    </p>
                  </div>

                  {/* Author Strip & Engagement */}
                  <div className="pt-4 mt-4 border-t border-[var(--glass-border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <div className="flex items-center gap-2">
                      <SafeImage
                        src={element.adminPhoto}
                        alt={element.adminName || "Author"}
                        type="avatar"
                        className="w-7 h-7 rounded-full object-cover border border-[var(--glass-border)]"
                      />
                      <span className="font-medium text-[var(--text-secondary)] truncate max-w-[90px]">
                        {element.adminName || "Author"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-medium">
                      <span className="flex items-center gap-1">
                        <FiEye className="text-[#332FD0] dark:text-[#B4B2FF]" /> {element.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiHeart className="text-[#FB2576]" /> {element.likes?.length || element.likesCount || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              </GlassCard>
            ))}
          </Carousel>
        </div>
      ) : (
        <GlassCard className="text-center py-12">
          <p className="text-[var(--text-secondary)]">Loading trending stories...</p>
        </GlassCard>
      )}
    </section>
  );
}

export default Trending;
