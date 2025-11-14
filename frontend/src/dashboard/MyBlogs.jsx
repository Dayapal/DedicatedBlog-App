import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit2, FiTrash2, FiEye, FiCalendar, FiClock } from "react-icons/fi";
import { FaBlog, FaHeart, FaComment, FaShare } from "react-icons/fa";

function MyBlogs() {
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const { data } = await axios.get(
          "https://dedicatedblog-app-1.onrender.com/api/blogs/my-blog",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMyBlogs(data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load your blogs.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog? This action cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    try {
      const token = localStorage.getItem("jwt")
      const res = await axios.delete(
        `https://dedicatedblog-app-1.onrender.com/api/blogs/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        }
      );
      toast.success(res.data.message || "🗑️ Blog deleted successfully");
      setMyBlogs((prev) => prev.filter((blog) => blog._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete blog");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Technology: "bg-blue-100 text-blue-700 border-blue-200",
      Devotional: "bg-purple-100 text-purple-700 border-purple-200",
      Sports: "bg-green-100 text-green-700 border-green-200",
      Tourism: "bg-orange-100 text-orange-700 border-orange-200",
      Entertainment: "bg-yellow-100 text-yellow-700 border-yellow-200",
      Health: "bg-teal-100 text-teal-700 border-teal-200",
      Business: "bg-indigo-100 text-indigo-700 border-indigo-200"
    };
    return colors[category] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Responsive grid columns based on screen size
  const getGridColumns = () => {
    if (myBlogs.length === 1) return "grid-cols-1 max-w-md mx-auto";
    if (myBlogs.length === 2) return "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  };

  // Skeleton loader with responsive design
  const SkeletonLoader = () => (
    <div className={`grid gap-4 sm:gap-6 ${getGridColumns()}`}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 animate-pulse">
          <div className="w-full h-40 sm:h-48 bg-gray-200 rounded-xl mb-3 sm:mb-4"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/3 mb-2 sm:mb-3"></div>
          <div className="h-4 sm:h-6 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-full mb-1"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3 mb-3 sm:mb-4"></div>
          <div className="flex gap-2 sm:gap-3">
            <div className="h-8 sm:h-10 bg-gray-200 rounded-lg flex-1"></div>
            <div className="h-8 sm:h-10 bg-gray-200 rounded-lg flex-1"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        {/* Header Section - Responsive */}
        <motion.div
          className="text-center mb-8 sm:mb-10 lg:mb-12 px-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
            <FaBlog className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 px-2">
            My Stories
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Manage and track all your published stories in one place
          </p>
          
          {/* Stats Bar - Responsive */}
          <div className="flex justify-center gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8 flex-wrap">
            <div className="text-center min-w-20 sm:min-w-[100px]">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{myBlogs.length}</div>
              <div className="text-xs sm:text-sm text-gray-500">Total Stories</div>
            </div>
            <div className="text-center min-w-20 sm:min-w-[100px]">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">1.2K</div>
              <div className="text-xs sm:text-sm text-gray-500">Total Reads</div>
            </div>
            <div className="text-center min-w-20 sm:min-w-[100px]">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">24</div>
              <div className="text-xs sm:text-sm text-gray-500">Engagements</div>
            </div>
          </div>
        </motion.div>

        {/* Content Section */}
        {loading ? (
          <SkeletonLoader />
        ) : myBlogs && myBlogs.length > 0 ? (
          <motion.div
            className={`grid gap-4 sm:gap-6 ${getGridColumns()}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {myBlogs.map((blog) => (
              <motion.div
                key={blog._id}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg border border-gray-200 transition-all duration-300 overflow-hidden group"
              >
                {/* Image Section - Responsive */}
                <div className="relative overflow-hidden">
                  <img
                    src={blog?.blogImage?.url || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop"}
                    alt={blog.title}
                    className="w-full h-36 sm:h-40 md:h-44 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Category Badge */}
                  <div className={`absolute top-2 sm:top-3 left-2 sm:left-3 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(blog.category)}`}>
                    {blog.category || "Uncategorized"}
                  </div>

                  {/* Date Badge */}
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 px-2 py-1 bg-black/70 text-white text-xs rounded-full flex items-center gap-1">
                    <FiCalendar className="w-3 h-3" />
                    <span className="hidden sm:inline">{formatDate(blog.createdAt)}</span>
                    <span className="sm:hidden">
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Blog Content - Responsive */}
                <div className="p-3 sm:p-4 lg:p-6">
                  {/* Title */}
                  <h3 
                    className="font-bold text-gray-900 text-base sm:text-lg mb-2 sm:mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-300"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '3rem'
                    }}
                  >
                    {blog.title}
                  </h3>

                  {/* Excerpt */}
                  <p 
                    className="text-gray-600 text-sm mb-3 sm:mb-4 leading-relaxed line-clamp-2 sm:line-clamp-3"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: window.innerWidth < 640 ? 2 : 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: window.innerWidth < 640 ? '2.5rem' : '3.75rem'
                    }}
                  >
                    {blog.about || "No description available."}
                  </p>

                  {/* Stats - Responsive */}
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                      <div className="flex items-center gap-1">
                        <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">1.2K</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaHeart className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                        <span className="hidden xs:inline">24</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaComment className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                        <span className="hidden xs:inline">8</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">5 min</span>
                    </div>
                  </div>

                  {/* Action Buttons - Responsive */}
                  <div className="flex gap-2 sm:gap-3">
                    <Link
                      to={`/blog/update/${blog._id}`}
                      className="flex items-center justify-center gap-1 sm:gap-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white flex-1 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 group/btn text-xs sm:text-sm"
                    >
                      <FiEdit2 className="text-sm sm:text-lg group-hover/btn:scale-110 transition-transform duration-300" />
                      <span className="font-medium">Edit</span>
                    </Link>

                    <motion.button
                      onClick={() => handleDelete(blog._id)}
                      disabled={deletingId === blog._id}
                      className="flex items-center justify-center gap-1 sm:gap-2 bg-linear-to-r from-red-500 to-orange-500 text-white flex-1 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group/btn text-xs sm:text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {deletingId === blog._id ? (
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FiTrash2 className="text-sm sm:text-lg group-hover/btn:scale-110 transition-transform duration-300" />
                      )}
                      <span className="font-medium">
                        {deletingId === blog._id ? "Deleting..." : "Delete"}
                      </span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty State - Responsive */
          <motion.div
            className="text-center bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 lg:p-12 max-w-md sm:max-w-lg lg:max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <FaBlog className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-blue-500" />
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
              No Stories Yet
            </h3>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 max-w-md mx-auto">
              Your creative journey begins here. Share your first story with the world and inspire others with your unique perspective.
            </p>
            <Link
              to="/create-blog"
              className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              <FaBlog className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Create Your First Story</span>
            </Link>
          </motion.div>
        )}

        {/* Footer Encouragement - Responsive */}
        {myBlogs && myBlogs.length > 0 && (
          <motion.div
            className="text-center mt-8 sm:mt-10 lg:mt-12 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl border border-blue-200 mx-2 sm:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-blue-700 text-sm sm:text-base">
              <FaHeart className="text-red-400 text-xs sm:text-sm" />
              <span className="font-medium">Keep writing! Your stories are making a difference. ✨</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default MyBlogs;