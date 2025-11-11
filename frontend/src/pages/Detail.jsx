import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

function Detail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4001/api/blogs/single-blog/${id}`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        setBlog(data);
      } catch (error) {
        toast.error("Failed to load blog details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-400 mb-4"></div>
        <p className="text-lg font-medium">Loading blog details...</p>
      </div>
    );

  if (!blog)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <p className="text-xl font-semibold">Blog not found 😢</p>
      </div>
    );

  return (
    <section className="container mx-auto px-6 py-12">
      <motion.div
        className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-gray-100"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Category and Date */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
          <span className="bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-md">
            {blog?.category}
          </span>

          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            {new Date(blog?.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 leading-snug text-center">
          {blog?.title}
        </h1>

        {/* Author */}
        <div className="flex flex-col md:flex-row items-center justify-center mb-10 gap-4">
          <img
            src={blog?.adminPhoto}
            alt={blog?.adminName}
            className="w-16 h-16 rounded-full border-2 border-blue-400 shadow-sm"
          />
          <div className="text-center md:text-left">
            <p className="text-gray-800 font-semibold text-lg">{blog?.adminName}</p>
            <p className="text-gray-500 text-sm">Author</p>
          </div>
        </div>

        {/* Blog Image */}
        {blog?.blogImage?.url && (
          <motion.img
            src={blog.blogImage.url}
            alt={blog.title}
            className="w-full h-[450px] object-cover rounded-2xl shadow-md mb-10 border"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          />
        )}

        {/* About Section */}
        <motion.div
          className="relative bg-linear-to-br from-blue-50 to-white border border-blue-100 rounded-2xl shadow-inner p-8 md:p-10 text-gray-700 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-blue-800 mb-6 border-b pb-2 inline-block">
            About This Blog
          </h2>

          <div className="text-lg text-gray-700">
            {blog?.about.split(/(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu).map((item, idx) => {
              if (!item.trim()) return null;

              // If item is an emoji/icon
              if (/^\p{Emoji}$/u.test(item) || /\p{Emoji_Presentation}/u.test(item)) {
                return (
                  <div
                    key={idx}
                    className="text-2xl my-2 inline-block bg-blue-100 rounded-full p-2 shadow-sm"
                  >
                    {item}
                  </div>
                );
              }

              // Normal text
              return (
                <span key={idx} className="block mb-2">
                  {item}
                </span>
              );
            })}
          </div>

          <blockquote className="mt-8 italic border-l-4 border-blue-400 pl-4 text-gray-600">
            “Great thoughts deserve great readers.”
          </blockquote>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Detail;
