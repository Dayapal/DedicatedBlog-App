import React from "react";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";

function Hero() {
  const { blogs } = useAuth();

  return (
    <section className="bg-linear-to-b from-blue-50 via-white to-blue-100 py-20 px-6 md:px-12 lg:px-20 transition-colors">
      {/* Section Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-3">
          Discover Inspiring Stories
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Explore heartfelt articles written by passionate creators across
          different worlds — technology, Devotional, Entertainment, and beyond.
        </p>
      </motion.div>

      {/* Blog Grid */}
      {blogs && blogs.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          {blogs.slice(0, 4).map((element, index) => (
            <motion.div
              key={element._id}
              whileHover={{ scale: 1.04, y: -4 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden cursor-pointer border border-gray-100 hover:border-blue-200 transition-all duration-300"
            >
              <Link to={`/blogs/${element._id}`}>
                {/* Blog Image */}
                <div className="relative">
                  <img
                    src={
                      element.blogImage?.url ||
                      "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={element.title}
                    className="w-full h-56 object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>

                  {/* Blog Title Overlay */}
                  <h2 className="absolute bottom-4 left-4 text-white text-lg font-semibold tracking-wide drop-shadow-lg">
                    {element.title.length > 25
                      ? element.title.slice(0, 25) + "..."
                      : element.title}
                  </h2>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4 p-5">
                  {element.adminPhoto ? (
                    <img
                      src={element.adminPhoto}
                      alt={element.adminName}
                      className="w-12 h-12 rounded-full border-2 border-blue-400 shadow-sm"
                    />
                  ) : (
                    <FaUserCircle className="w-12 h-12 text-blue-400" />
                  )}
                  <div className="text-left">
                    <p className="text-gray-800 font-semibold">
                      {element.adminName}
                    </p>
                    <p className="text-sm text-blue-500 font-medium">
                      ✨ New Post
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* Loading State */
        <div className="flex flex-col items-center justify-center mt-20 text-gray-600">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mb-4"></div>
          <p className="text-lg font-medium">Loading amazing stories...</p>
        </div>
      )}
    </section>
  );
}

export default Hero;
