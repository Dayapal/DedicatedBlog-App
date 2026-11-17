import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShareAlt,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaLink,
  FaTrash,
  FaEye,
  FaClock,
  FaArrowLeft,
  FaPaperPlane,
  FaCalendarAlt,
  FaUserCircle,
} from "react-icons/fa";
import api from "../services/api";
import { useAuth } from "../context/AuthProvider";
import { GlassCard } from "../components/ui/GlassCard";
import { GlassBadge } from "../components/ui/GlassBadge";
import { GlassButton } from "../components/ui/GlassButton";

function Detail() {
  const { id } = useParams();
  const { profile, isAuthenticated } = useAuth();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reader Engagement States
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  // Comment States
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // Reading progress state
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track Reading Scroll Progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch Blog Details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await api.get(`/api/blogs/single-blog/${id}`);
        setBlog(data);
        setLikesCount(data.likes?.length || 0);

        if (profile?._id && data.likes) {
          setIsLiked(
            data.likes.some(
              (userId) =>
                userId.toString() === profile._id.toString() ||
                userId === profile._id
            )
          );
        }
      } catch (error) {
        toast.error("Failed to load blog details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, profile?._id]);

  // Handle Like / Unlike with optimistic UI
  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to like this story!");
      return;
    }

    if (likeLoading) return;
    setLikeLoading(true);

    const previousIsLiked = isLiked;
    const previousCount = likesCount;

    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    try {
      const { data } = await api.put(`/api/blogs/like/${id}`);
      setIsLiked(data.isLiked);
      setLikesCount(data.likesCount);
      if (data.isLiked) {
        toast.success("Added to liked stories! ❤️");
      }
    } catch {
      setIsLiked(previousIsLiked);
      setLikesCount(previousCount);
      toast.error("Failed to update like status.");
    } finally {
      setLikeLoading(false);
    }
  };

  // Handle Add Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to join the conversation!");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }

    setCommentLoading(true);
    try {
      const { data } = await api.post(`/api/blogs/comment/${id}`, {
        comment: commentText.trim(),
      });

      setBlog((prev) => ({
        ...prev,
        comments: data.comments,
      }));
      setCommentText("");
      toast.success("Comment posted successfully! 💬");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post comment.");
    } finally {
      setCommentLoading(false);
    }
  };

  // Handle Delete Comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const { data } = await api.delete(`/api/blogs/comment/${id}/${commentId}`);
      setBlog((prev) => ({
        ...prev,
        comments: data.comments,
      }));
      toast.success("Comment removed.");
    } catch {
      toast.error("Failed to delete comment.");
    }
  };

  // Social Sharing Functions
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = blog?.title || "Check out this inspiring story!";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success("Story link copied to clipboard! 📋");
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareTitle
      )}&url=${encodeURIComponent(currentUrl)}`,
      "_blank"
    );
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        currentUrl
      )}`,
      "_blank"
    );
  };

  const shareOnWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(
        shareTitle + " " + currentUrl
      )}`,
      "_blank"
    );
  };

  // Format Blog Content
  const formatBlogContent = (content) => {
    if (!content) return "";
    return content.split("\n").map((paragraph, index) => {
      if (paragraph.trim() === "") {
        return <div key={index} className="h-4" />;
      }
      return (
        <p key={index} className="mb-4 leading-relaxed text-[var(--text-secondary)] text-base sm:text-lg">
          {paragraph}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-[var(--text-secondary)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#747FDD] mb-4" />
        <p className="text-base font-medium animate-pulse">
          Crafting story view...
        </p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-[var(--text-secondary)] px-4">
        <GlassCard className="text-center p-8 max-w-md">
          <p className="text-2xl font-bold text-[var(--text-primary)] mb-3">Blog not found 😢</p>
          <p className="text-sm text-[var(--text-muted)] mb-6">The article you requested might have been moved or archived.</p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#747FDD] hover:underline"
          >
            <FaArrowLeft /> Back to all stories
          </Link>
        </GlassCard>
      </div>
    );
  }

  const wordCount = blog?.about?.split(/\s+/).filter(Boolean).length || 0;
  const readTime = Math.ceil(wordCount / 200) || 1;

  return (
    <div className="relative min-h-screen pt-24 sm:pt-32 pb-20">
      {/* 🚀 Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-[#747FDD] via-[#A78BFA] to-[#69D8F2] z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--text-secondary)] hover:text-[#747FDD] transition-colors"
          >
            <FaArrowLeft className="text-xs" />
            <span>Back to Stories</span>
          </Link>
        </div>

        {/* Main Article Glass Card */}
        <GlassCard radius="hero" className="!p-6 sm:!p-10 mb-12 shadow-2xl">
          {/* Category & Meta */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <GlassBadge variant="primary" size="lg">
              {blog?.category}
            </GlassBadge>

            {/* Engagement Badges */}
            <div className="flex items-center gap-4 text-xs font-medium text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <FaEye className="text-[#69D8F2]" />
                {blog?.views || 1} views
              </span>
              <span className="flex items-center gap-1.5">
                <FaClock className="text-[#A78BFA]" />
                {readTime} min read
              </span>
              <span className="flex items-center gap-1.5">
                <FaCalendarAlt className="text-[#747FDD]" />
                {new Date(blog?.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight mb-8">
            {blog?.title}
          </h1>

          {/* Author Strip & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-y border-[var(--glass-border-subtle)] mb-8">
            {/* Author */}
            <div className="flex items-center gap-3">
              {blog?.adminPhoto ? (
                <img
                  src={blog.adminPhoto}
                  alt={blog.adminName}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-[var(--glass-border)] shadow-sm"
                />
              ) : (
                <FaUserCircle className="w-12 h-12 text-[var(--text-muted)]" />
              )}
              <div>
                <h4 className="font-bold text-[var(--text-primary)] text-sm sm:text-base leading-tight">
                  {blog?.adminName || "Editorial Team"}
                </h4>
                <p className="text-xs text-[#747FDD] font-semibold">Author & Contributor</p>
              </div>
            </div>

            {/* Like & Social Sharing */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Like Button */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleLike}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold text-xs sm:text-sm transition-all shadow-sm cursor-pointer border
                  ${
                    isLiked
                      ? "bg-rose-500/15 text-rose-500 border-rose-500/30"
                      : "glass-panel text-[var(--text-secondary)] hover:text-rose-500"
                  }
                `}
                title={isLiked ? "Unlike" : "Like this story"}
              >
                {isLiked ? (
                  <FaHeart className="text-rose-500 text-sm animate-pulse" />
                ) : (
                  <FaRegHeart className="text-sm" />
                )}
                <span>{likesCount}</span>
              </motion.button>

              {/* Share Buttons */}
              <div className="flex items-center gap-1 glass-pill p-1">
                <button
                  onClick={shareOnTwitter}
                  className="p-2 text-[var(--text-muted)] hover:text-sky-500 transition-colors cursor-pointer"
                  title="Share on X"
                >
                  <FaTwitter className="text-xs sm:text-sm" />
                </button>
                <button
                  onClick={shareOnLinkedIn}
                  className="p-2 text-[var(--text-muted)] hover:text-blue-600 transition-colors cursor-pointer"
                  title="Share on LinkedIn"
                >
                  <FaLinkedIn className="text-xs sm:text-sm" />
                </button>
                <button
                  onClick={shareOnWhatsApp}
                  className="p-2 text-[var(--text-muted)] hover:text-emerald-500 transition-colors cursor-pointer"
                  title="Share on WhatsApp"
                >
                  <FaWhatsapp className="text-xs sm:text-sm" />
                </button>
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-[var(--text-muted)] hover:text-[#747FDD] transition-colors cursor-pointer"
                  title="Copy link"
                >
                  <FaLink className="text-xs sm:text-sm" />
                </button>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {blog?.blogImage?.url && (
            <div className="w-full mb-8 rounded-[24px] overflow-hidden border border-[var(--glass-border)] shadow-md bg-gray-100 dark:bg-gray-800">
              <img
                src={blog.blogImage.url}
                alt={blog.title}
                className="w-full max-h-[480px] object-cover"
              />
            </div>
          )}

          {/* Article Body */}
          <div className="prose prose-lg max-w-none space-y-4">
            {formatBlogContent(blog?.about)}
          </div>

          {/* Bottom Engagement Bar */}
          <div className="mt-12 pt-6 border-t border-[var(--glass-border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[var(--text-muted)]">
            <div className="flex items-center gap-3">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{readTime} min read</span>
              <span>•</span>
              <span>{blog?.comments?.length || 0} comments</span>
            </div>

            <div className="flex items-center gap-3">
              <GlassButton
                variant={isLiked ? "danger" : "secondary"}
                size="sm"
                onClick={handleLike}
                icon={FaHeart}
              >
                {isLiked ? "Liked" : "Like this story"} ({likesCount})
              </GlassButton>

              <GlassButton
                variant="secondary"
                size="sm"
                onClick={copyToClipboard}
                icon={FaShareAlt}
              >
                Share
              </GlassButton>
            </div>
          </div>
        </GlassCard>

        {/* 💬 Comments Section */}
        <GlassCard radius="panel" className="!p-6 sm:!p-10 shadow-xl">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--glass-border-subtle)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#747FDD]/15 text-[#747FDD] flex items-center justify-center font-bold">
                <FaComment />
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                Discussion ({blog?.comments?.length || 0})
              </h2>
            </div>
            <span className="text-xs text-[var(--text-muted)]">Community guidelines apply</span>
          </div>

          {/* Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleAddComment} className="mb-10">
              <div className="flex items-start gap-3 sm:gap-4">
                <img
                  src={profile?.photo?.url || "/default-avatar.png"}
                  alt={profile?.name || "You"}
                  className="w-10 h-10 rounded-2xl object-cover border border-[var(--glass-border)] shrink-0"
                />
                <div className="flex-1 space-y-3">
                  <textarea
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts, feedback, or ideas on this story..."
                    className="glass-input w-full p-4 text-sm font-normal resize-none rounded-2xl"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[var(--text-muted)]">
                      {commentText.length}/500 characters
                    </span>
                    <GlassButton
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={commentLoading || !commentText.trim()}
                      loading={commentLoading}
                      icon={FaPaperPlane}
                    >
                      Post Comment
                    </GlassButton>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-8 p-6 glass-panel rounded-2xl text-center space-y-3 border border-[var(--glass-border)]">
              <p className="text-sm text-[var(--text-secondary)] font-medium">
                Join the conversation! Log in to share your thoughts with the community.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-2xl bg-gradient-to-r from-[#747FDD] to-[#454FA8] text-white text-xs font-semibold shadow-md"
              >
                Log In to Comment
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            <AnimatePresence>
              {blog?.comments && blog.comments.length > 0 ? (
                blog.comments.map((comm) => {
                  const isAuthor =
                    profile?._id &&
                    (comm.user?.toString() === profile._id.toString() ||
                      comm.user === profile._id);
                  const isBlogOwner =
                    profile?._id &&
                    (blog.createdBy?.toString() === profile._id.toString() ||
                      blog.createdBy === profile._id);
                  const canDelete = isAuthor || isBlogOwner || profile?.role === "admin";

                  return (
                    <motion.div
                      key={comm._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="glass-panel !p-4 rounded-2xl border border-[var(--glass-border-subtle)] flex items-start gap-3.5"
                    >
                      <img
                        src={comm.userPhoto || "/default-avatar.png"}
                        alt={comm.userName}
                        className="w-9 h-9 rounded-xl object-cover border border-[var(--glass-border)] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="font-bold text-xs sm:text-sm text-[var(--text-primary)] truncate">
                            {comm.userName}
                          </h4>
                          <span className="text-[10px] text-[var(--text-muted)] shrink-0">
                            {new Date(comm.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed break-words">
                          {comm.comment}
                        </p>
                      </div>

                      {canDelete && (
                        <button
                          onClick={() => handleDeleteComment(comm._id)}
                          className="p-1.5 text-[var(--text-muted)] hover:text-red-500 transition-colors cursor-pointer"
                          title="Delete comment"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      )}
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-[var(--text-muted)] text-sm">
                  No comments yet. Be the first to start the discussion!
                </div>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default Detail;
