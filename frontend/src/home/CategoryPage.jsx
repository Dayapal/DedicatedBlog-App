import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

function CategoryPage() {
  const { blogs } = useAuth();
  const categories = ["Devotional", "Sports", "Tourism", "Technology", "Entertainment", "Health","Business"];
  const [selectedCategory, setSelectedCategory] = useState("Devotional");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBlogs = blogs
    ?.filter((blog) => blog.category === selectedCategory)
    .filter((blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <section className="min-h-screen bg-linear-to-b from-blue-50 via-white to-blue-100 py-12 px-6 md:px-12 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center text-blue-800 mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Explore Inspiring Categories
        </motion.h1>

        {/* Category Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold shadow-sm transition-all duration-300 border ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                  : "bg-white text-gray-700 hover:bg-blue-100 border-gray-200"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Search Box */}
        <div className="flex justify-center mb-10">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-10 pr-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm placeholder-gray-400"
            />
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          </div>
        </div>

        {/* Category Info */}
        <p className="text-center mb-6 text-gray-600 text-lg">
          Showing blogs in{" "}
          <span className="font-semibold text-blue-700">
            {selectedCategory}
          </span>{" "}
          category
        </p>

        {/* Blog Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {filteredBlogs && filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <Link to={`/blogs/${blog._id}`}>
                  <div className="relative">
                    <img
                      src={
                        blog?.blogImage?.url ||
                        "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt={blog?.title}
                      className="w-full h-52 object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <h2 className="text-white text-lg font-semibold">
                        {blog?.title}
                      </h2>
                      <p className="text-gray-200 text-sm">
                        {blog?.category}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 text-lg">
              No blogs found in this category.
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default CategoryPage;
