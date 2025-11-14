import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Blogs() {
  const { blogs } = useAuth();

  const [visibleCount, setVisibleCount] = useState(8);
  const loaderRef = useRef(null);

  const visibleBlogs = blogs?.slice(0, visibleCount);

  // 🎨 Skeleton Card Component
  const SkeletonCard = () => {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 animate-pulse">
        {/* Image skeleton */}
        <div className="w-full h-56 bg-gray-200 shimmer"></div>

        <div className="p-5">
          {/* Title lines */}
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-3 shimmer"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-5 shimmer"></div>

          {/* Author section */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full shimmer"></div>
            <div className="ml-3 w-full">
              <div className="h-3 bg-gray-300 rounded w-1/2 mb-2 shimmer"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4 shimmer"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 🌀 Infinite Scroll Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + 8); // load next 8
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, []);

  return (
    <section className="bg-linear-to-b from-blue-50 to-white py-20">
      <div className="container mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h1 className="text-4xl font-extrabold text-gray-800 mb-3">
            ✨ Explore All Blogs
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover inspiring stories, ideas, and knowledge — updated endlessly as you scroll.
          </p>
        </motion.div>

        {/* Blog Grid */}
        {blogs && blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {visibleBlogs.map((blog, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.04 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 group transition-all"
                >
                  <Link to={`/blogs/${blog._id}`}>
                    {/* Image */}
                    <div className="relative">
                      <img
                        src={blog?.blogImage?.url}
                        alt={blog?.title}
                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Category */}
                      <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 text-xs font-medium rounded-full shadow-md">
                        {blog?.category}
                      </div>
                    </div>

                    <div className="p-5 bg-gray-50">
                      <h2 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
                        {blog?.title}
                      </h2>

                      <div className="flex items-center mt-auto">
                        <img
                          src={blog?.adminPhoto}
                          alt={blog?.adminName}
                          className="w-10 h-10 rounded-full border border-blue-300 shadow-sm"
                        />
                        <div className="ml-3">
                          <p className="text-gray-700 text-sm font-semibold">
                            {blog?.adminName}
                          </p>
                          <p className="text-gray-400 text-xs">Author</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Infinite Scroll Skeleton Loader */}
            {visibleCount < blogs.length && (
              <div
                ref={loaderRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-16 mb-16"
              >
                {[...Array(4)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}
          </>
        ) : (
          // Initial Skeleton Loader (when blogs not loaded)
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}
      </div>

      {/* Shimmer CSS */}
      <style>{`
        .shimmer {
          position: relative;
          overflow: hidden;
        }

        .shimmer::after {
          content: "";
          position: absolute;
          top: 0;
          left: -150px;
          width: 150px;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 1.3s infinite;
        }

        @keyframes shimmer {
          0% { left: -150px; }
          100% { left: 100%; }
        }
      `}</style>
    </section>
  );
}

export default Blogs;
