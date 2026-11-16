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

  // Handle Like / Unlike
  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to like this story!");
      return;
    }

    if (likeLoading) return;
    setLikeLoading(true);

    // Optimistic UI update
    const previousIsLiked = isLiked;
    const previousCount = likesCount;

    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    try {
      const { data } = await api.put(`/api/blogs/like/${id}`);
      setIsLiked(data.isLiked);
      setLikesCount(data.likesCount);
      if (data.isLiked) {
        toast.success("Added to your liked stories! ❤️");
      }
    } catch (error) {
      // Rollback on failure
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
      const { data } = await api.delete(
        `/api/blogs/comment/${id}/${commentId}`
      );
      setBlog((prev) => ({
        ...prev,
        comments: data.comments,
      }));
      toast.success("Comment removed.");
    } catch (error) {
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
        <p key={index} className="mb-4 leading-relaxed text-gray-700">
          {paragraph}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600 bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-lg font-medium text-gray-700 animate-pulse">
          Loading story...
        </p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600 bg-gray-50">
        <p className="text-2xl font-bold text-gray-800 mb-3">Blog not found 😢</p>
        <Link
          to="/blogs"
          className="text-blue-600 hover:underline flex items-center gap-2 font-medium"
        >
          <FaArrowLeft /> Back to all blogs
        </Link>
      </div>
    );
  }

  const wordCount = blog?.about?.split(/\s+/).filter(Boolean).length || 0;
  const readTime = Math.ceil(wordCount / 200) || 1;

  return (
    <div className="relative min-h-screen bg-linear-to-b from-blue-50/50 via-white to-gray-50 pt-20 pb-16">
      {/* 🚀 Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1.5 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors"
          >
            <FaArrowLeft className="text-xs" />
            Back to Stories
          </Link>
        </div>

        {/* Main Article Container */}
        <motion.article
          className="bg-white rounded-3xl shadow-xl shadow-blue-500/5 border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Article Header */}
          <div className="p-6 sm:p-10 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                {blog?.category}
              </span>

              {/* Engagement Badges */}
              <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                <span className="flex items-center gap-1.5">
                  <FaEye className="text-blue-500 text-sm" />
                  {blog?.views || 1} views
                </span>
                <span className="flex items-center gap-1.5">
                  <FaClock className="text-indigo-500 text-sm" />
                  {readTime} min read
                </span>
                <span className="flex items-center gap-1.5">
                  <FaCalendarAlt className="text-purple-500 text-sm" />
                  {new Date(blog?.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
              {blog?.title}
            </h1>

            {/* Author Strip & Social Share Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-y border-gray-100 mb-8">
              {/* Author */}
              <div className="flex items-center gap-3">
                {blog?.adminPhoto ? (
                  <img
                    src={blog.adminPhoto}
                    alt={blog.adminName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 shadow-sm"
                  />
                ) : (
                  <FaUserCircle className="w-12 h-12 text-gray-300" />
                )}
                <div>
                  <h4 className="font-bold text-gray-900 leading-tight">
                    {blog?.adminName || "Editorial Team"}
                  </h4>
                  <p className="text-xs text-blue-600 font-medium">Author</p>
                </div>
              </div>

              {/* Action Buttons: Like + Share */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Like Button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all shadow-sm ${
                    isLiked
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                  title={isLiked ? "Unlike" : "Like this story"}
                >
                  {isLiked ? (
                    <FaHeart className="text-red-500 text-base animate-bounce" />
                  ) : (
                    <FaRegHeart className="text-gray-500 text-base" />
                  )}
                  <span>{likesCount}</span>
                </motion.button>

                {/* Share Dropdown / Buttons */}
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-2 py-1">
                  <button
                    onClick={shareOnTwitter}
                    className="p-2 text-gray-500 hover:text-sky-500 transition-colors"
                    title="Share on X (Twitter)"
                  >
                    <FaTwitter className="text-sm" />
                  </button>
                  <button
                    onClick={shareOnLinkedIn}
                    className="p-2 text-gray-500 hover:text-blue-700 transition-colors"
                    title="Share on LinkedIn"
                  >
                    <FaLinkedin className="text-sm" />
                  </button>
                  <button
                    onClick={shareOnWhatsApp}
                    className="p-2 text-gray-500 hover:text-green-600 transition-colors"
                    title="Share on WhatsApp"
                  >
                    <FaWhatsapp className="text-sm" />
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                    title="Copy Article Link"
                  >
                    <FaLink className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {blog?.blogImage?.url && (
            <div className="w-full px-6 sm:px-10 mb-8">
              <img
                src={blog.blogImage.url}
                alt={blog.title}
                className="w-full max-h-[480px] object-cover rounded-2xl shadow-md border border-gray-100"
              />
            </div>
          )}

          {/* Article Body */}
          <div className="px-6 sm:px-10 pb-12">
            <div className="prose prose-lg max-w-none text-gray-800 text-lg leading-relaxed space-y-4">
              {formatBlogContent(blog?.about)}
            </div>

            {/* Bottom Engagement Bar */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{readTime} min read</span>
                <span>•</span>
                <span>{blog?.comments?.length || 0} comments</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-sm ${
                    isLiked
                      ? "bg-red-50 text-red-600 border border-red-200 shadow-red-100"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaHeart
                    className={isLiked ? "text-red-500" : "text-gray-400"}
                  />
                  <span>{isLiked ? "Liked" : "Like this story"} ({likesCount})</span>
                </button>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm hover:bg-blue-100 transition-colors"
                >
                  <FaShareAlt />
                  Share
                </button>
              </div>
            </div>
          </div>
        </motion.article>

        {/* 💬 Comments & Discussions Section */}
        <section className="mt-12 bg-white rounded-3xl shadow-xl shadow-blue-500/5 border border-gray-100 p-6 sm:p-10">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <FaComment />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Discussion ({blog?.comments?.length || 0})
              </h2>
            </div>
            <span className="text-xs text-gray-400">Be respectful and kind</span>
          </div>

          {/* Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleAddComment} className="mb-10">
              <div className="flex items-start gap-4">
                <img
                  src={profile?.photo?.url || "/default-avatar.png"}
                  alt={profile?.name || "You"}
                  className="w-10 h-10 rounded-full object-cover border border-blue-200 mt-1"
                />
                <div className="flex-1">
                  <textarea
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts, questions, or insights on this story..."
                    className="w-full p-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-gray-800 placeholder-gray-400 transition-all resize-none text-sm"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-400">
                      {commentText.length}/500 characters
                    </span>
                    <button
                      type="submit"
                      disabled={commentLoading || !commentText.trim()}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all duration-200"
                    >
                      {commentLoading ? (
                        "Posting..."
                      ) : (
                        <>
                          <FaPaperPlane className="text-xs" /> Post Comment
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-8 p-6 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl text-center">
              <p className="text-gray-700 font-medium mb-3">
                Join the conversation! Log in to share your thoughts with the community.
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all"
              >
                Log In to Comment
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
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
                  const canDelete =
                    isAuthor || isBlogOwner || profile?.role === "admin";

                  return (
                    <motion.div
                      key={comm._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/70 border border-gray-100"
                    >
                      <img
                        src={comm.userPhoto || "/default-avatar.png"}
                        alt={comm.userName}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="font-bold text-gray-900 text-sm truncate">
                            {comm.userName}
                          </h4>
                          <span className="text-xs text-gray-400 shrink-0">
                            {new Date(comm.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed break-words">
                          {comm.comment}
                        </p>
                      </div>

                      {canDelete && (
                        <button
                          onClick={() => handleDeleteComment(comm._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1.5"
                          title="Delete comment"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      )}
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-gray-400 text-sm">
                  No comments yet. Be the first to start the discussion!
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Detail;