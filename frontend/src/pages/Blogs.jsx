import React from "react";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Blogs() {
  const { blogs } = useAuth();

  return (
    <section className="bg-linear-to-b from-blue-50 to-white py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3">
            ✨ All Blogs
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Explore stories, ideas, and perspectives from around the world —
            where every blog tells a unique story.
          </p>
        </div>

        {/* Blog Grid */}
        {blogs && blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {blogs.map((blog, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 group"
              >
                <Link to={`/blogs/${blog._id}`}>
                  {/* Image Section */}
                  <div className="relative">
                    <img
                      src={blog?.blogImage?.url}
                      alt={blog?.title}
                      className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 text-sm font-medium rounded-full shadow-md">
                      {blog?.category}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-5 bg-gray-50">
                    <h2
                      className="text-lg font-bold text-gray-800 mb-3 truncate"
                      title={blog?.title}
                    >
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
        ) : (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-600">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400 mb-4"></div>
            <p className="text-lg font-medium">Loading blogs...</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Blogs;
