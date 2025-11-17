import React from "react";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaUserCircle, 
  FaClock, 
  FaArrowRight,
  FaBookOpen
} from "react-icons/fa";

function Hero() {
  const { blogs, loading } = useAuth(); // Assuming your useAuth provides loading state
  const sortedBlogs = blogs
    ? [...blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

 

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      scale: 1.03,
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Function to get category color
  const getCategoryColor = (category) => {
    const colors = {
      Technology: "from-blue-500 to-cyan-500",
      Devotional: "from-purple-500 to-pink-500",
      Sports: "from-green-500 to-emerald-500",
      Tourism: "from-orange-500 to-red-500",
      Entertainment: "from-yellow-500 to-orange-500",
      Health: "from-teal-500 to-green-500",
      Business: "from-indigo-500 to-blue-500"
    };
    return colors[category] || "from-gray-500 to-gray-700";
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Calculate read time based on content length
  const getReadTime = (content) => {
    if (!content) return "5 min";
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min`;
  };

  // YouTube-style Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <div key={item} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Image Skeleton */}
          <div className="relative">
            <div className="w-full h-48 bg-gray-300 animate-pulse rounded-t-2xl"></div>
            <div className="absolute top-4 left-4 w-16 h-6 bg-gray-400 animate-pulse rounded-full"></div>
            <div className="absolute top-4 right-4 w-12 h-6 bg-gray-400 animate-pulse rounded-full"></div>
          </div>
          
          {/* Content Skeleton */}
          <div className="p-5 space-y-3">
            {/* Title Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 animate-pulse rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 animate-pulse rounded w-full"></div>
            </div>
            
            {/* Excerpt Skeleton */}
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 animate-pulse rounded w-full"></div>
              <div className="h-3 bg-gray-200 animate-pulse rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 animate-pulse rounded w-4/6"></div>
            </div>
            
            {/* Author Info Skeleton */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 animate-pulse rounded-full"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-300 animate-pulse rounded w-16"></div>
                  <div className="h-2 bg-gray-200 animate-pulse rounded w-12"></div>
                </div>
              </div>
              <div className="w-8 h-8 bg-gray-300 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Enhanced Loading State with Shimmer Effect
  const EnhancedLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div
        className="relative mb-6"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full" />
      </motion.div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Curating Amazing Stories
      </h3>
      <p className="text-gray-500 text-center max-w-md">
        We're gathering the most inspiring blogs and articles for you. 
        Great stories are worth the wait!
      </p>
    </div>
  );

  return (
    <section className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center justify-center mt-4 w-20 h-20 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <FaBookOpen className="w-8 h-8 text-white" />
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Discover Stories That{" "}
            <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Inspire
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Journey through heartfelt narratives, expert insights, and captivating stories 
            crafted by passionate creators. Every blog is a new adventure waiting to be explored.
          </p>

          {/* Stats Bar */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {[
              { label: "Stories", value: blogs?.length || 0, icon: FaBookOpen },
              { label: "Categories", value: "7+", icon: FaUserCircle },
              { label: "Active Readers", value: "1.2K+", icon: FaUserCircle },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Content Section with Skeleton Loading */}
        {loading ? (
          <SkeletonLoader />
        ) : blogs && blogs.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sortedBlogs.slice(0, 8).map((blog, index) => (
              <motion.div
                key={blog._id}
                variants={cardVariants}
                whileHover="hover"
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300"
              >
                <Link to={`/blogs/${blog._id}`} className="block h-full">
                  {/* Blog Image with Category Badge */}
                  <div className="relative overflow-hidden">
                    <img
                      src={blog.blogImage?.url || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop"}
                      alt={blog.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category Badge */}
                    <div className={`absolute top-4 left-4 px-3 py-1 bg-linear-to-r ${getCategoryColor(blog.category)} text-white text-xs font-semibold rounded-full shadow-lg`}>
                      {blog.category}
                    </div>

                    {/* Read Time */}
                    <div className="absolute top-4 right-4 px-2 py-1 bg-black/50 text-white text-xs rounded-full flex items-center gap-1">
                      <FaClock className="w-3 h-3" />
                      <span>{getReadTime(blog.about)}</span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-5">
                    {/* Title with custom line clamp */}
                    <h3 
                      className="font-bold text-gray-900 text-lg mb-3 group-hover:text-blue-600 transition-colors duration-300"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: '1.4'
                      }}
                    >
                      {blog.title}
                    </h3>

                    {/* Excerpt with custom line clamp */}
                    <p 
                      className="text-gray-600 text-sm mb-4"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: '1.5'
                      }}
                    >
                      {blog.about?.slice(0, 120)}...
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        {blog.adminPhoto ? (
                          <img
                            src={blog.adminPhoto}
                            alt={blog.adminName}
                            className="w-8 h-8 rounded-full border-2 border-blue-200 shadow-sm"
                          />
                        ) : (
                          <FaUserCircle className="w-8 h-8 text-blue-400" />
                        )}
                        <div className="text-left">
                          <p className="text-sm font-semibold text-gray-900">
                            {blog.adminName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(blog.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Read More Arrow */}
                      <motion.div
                        className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        <FaArrowRight className="w-3 h-3 text-blue-600" />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EnhancedLoadingState />
        )}

        {/* Call to Action */}
        {blogs && blogs.length > 0 && (
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Link
              to="/blogs"
              className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span>Explore All Stories</span>
              <FaArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-gray-500 mt-4 text-sm">
              Discover {blogs.length - 8} more inspiring stories waiting for you
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default Hero;