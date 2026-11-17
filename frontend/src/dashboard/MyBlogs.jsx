import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit2, FiTrash2, FiEye, FiHeart, FiMessageSquare, FiPlus, FiCalendar, FiBookOpen } from "react-icons/fi";
import { GlassCard } from "../components/ui/GlassCard";
import { GlassBadge } from "../components/ui/GlassBadge";
import { GlassButton } from "../components/ui/GlassButton";

const categoryVariantMap = {
  Technology: "primary",
  Devotional: "purple",
  Sports: "cyan",
  Tourism: "pink",
  Entertainment: "pink",
  Health: "cyan",
  Business: "primary",
};

function MyBlogs({ onNavigateCreate, onEditBlog }) {
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const { data } = await axios.get("/api/blogs/my-blog", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setMyBlogs(data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load your blogs.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this story? This action cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.delete(`/api/blogs/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      toast.success(res.data.message || "Story deleted successfully");
      setMyBlogs((prev) => prev.filter((blog) => blog._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete blog");
    } finally {
      setDeletingId(null);
    }
  };

  // Compute real metrics from the author's stories
  const stats = useMemo(() => {
    const totalStories = myBlogs.length;
    const totalViews = myBlogs.reduce((acc, b) => acc + (b.views || 0), 0);
    const totalLikes = myBlogs.reduce((acc, b) => acc + (b.likes?.length || 0), 0);
    const totalComments = myBlogs.reduce((acc, b) => acc + (b.comments?.length || 0), 0);
    return { totalStories, totalViews, totalLikes, totalComments };
  }, [myBlogs]);

  return (
    <div className="space-y-8">
      {/* Real Analytics Metric Cards (Android 16 Rounded Glass Panels) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <GlassCard radius="lg" className="!p-5 text-left space-y-1">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider">
            <span>Stories</span>
            <FiBookOpen className="text-base text-[#747FDD]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            {stats.totalStories}
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">Active publications</p>
        </GlassCard>

        <GlassCard radius="lg" className="!p-5 text-left space-y-1">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider">
            <span>Total Reads</span>
            <FiEye className="text-base text-[#69D8F2]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            {stats.totalViews}
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">Real reader impressions</p>
        </GlassCard>

        <GlassCard radius="lg" className="!p-5 text-left space-y-1">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider">
            <span>Appreciation</span>
            <FiHeart className="text-base text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            {stats.totalLikes}
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">Story favorites</p>
        </GlassCard>

        <GlassCard radius="lg" className="!p-5 text-left space-y-1">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider">
            <span>Feedback</span>
            <FiMessageSquare className="text-base text-[#A78BFA]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            {stats.totalComments}
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">Community comments</p>
        </GlassCard>
      </div>

      {/* Stories Content Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
          Manage Stories ({myBlogs.length})
        </h2>

        {onNavigateCreate && (
          <GlassButton
            variant="primary"
            size="sm"
            onClick={onNavigateCreate}
            icon={FiPlus}
          >
            New Story
          </GlassButton>
        )}
      </div>

      {/* Stories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <GlassCard key={i} className="h-64 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : myBlogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myBlogs.map((blog) => (
            <GlassCard
              key={blog._id}
              radius="panel"
              className="!p-4 flex flex-col justify-between group h-full"
            >
              <div>
                {/* Image */}
                <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800">
                  <img
                    src={blog.blogImage?.url || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&fit=crop"}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <GlassBadge variant={categoryVariantMap[blog.category] || "primary"} size="sm">
                      {blog.category}
                    </GlassBadge>
                  </div>
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 text-[10px] text-white flex items-center gap-1 backdrop-blur-xs">
                    <FiCalendar size={11} />
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Title & Excerpt */}
                <h3 className="font-bold text-base text-[var(--text-primary)] line-clamp-2 leading-snug mb-1.5">
                  {blog.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4">
                  {blog.about}
                </p>
              </div>

              {/* Bottom Actions */}
              <div>
                {/* Stats */}
                <div className="py-2.5 border-t border-[var(--glass-border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)] mb-3">
                  <span className="flex items-center gap-1">
                    <FiEye /> {blog.views || 0} reads
                  </span>
                  <span className="flex items-center gap-1">
                    <FiHeart className="text-rose-400" /> {blog.likes?.length || 0} likes
                  </span>
                  <span className="flex items-center gap-1">
                    <FiMessageSquare className="text-blue-400" /> {blog.comments?.length || 0}
                  </span>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex gap-2">
                  {onEditBlog ? (
                    <button
                      onClick={() => onEditBlog(blog._id)}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold bg-[#747FDD]/15 text-[#747FDD] hover:bg-[#747FDD]/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FiEdit2 size={13} />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <Link
                      to={`/blog/update/${blog._id}`}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold bg-[#747FDD]/15 text-[#747FDD] hover:bg-[#747FDD]/25 transition-all flex items-center justify-center gap-1.5"
                    >
                      <FiEdit2 size={13} />
                      <span>Edit</span>
                    </Link>
                  )}

                  <button
                    onClick={() => handleDelete(blog._id)}
                    disabled={deletingId === blog._id}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/15 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <FiTrash2 size={13} />
                    <span>{deletingId === blog._id ? "Deleting..." : "Delete"}</span>
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard radius="panel" className="text-center py-16 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#747FDD]/15 text-[#747FDD] flex items-center justify-center mx-auto text-2xl">
            <FiBookOpen />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-[var(--text-primary)]">
              No Published Stories Yet
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
              Ready to inspire readers? Create your first article and publish it to the platform.
            </p>
          </div>
          {onNavigateCreate && (
            <GlassButton
              variant="primary"
              size="md"
              onClick={onNavigateCreate}
              icon={FiPlus}
            >
              Create Your First Story
            </GlassButton>
          )}
        </GlassCard>
      )}
    </div>
  );
}

export default MyBlogs;
