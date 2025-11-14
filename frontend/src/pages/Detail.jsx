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
        const token = localStorage.getItem("jwt");
        const { data } = await axios.get(
          `https://dedicatedblog-app-1.onrender.com/api/blogs/single-blog/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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

  // Function to format the blog content with proper spacing and line breaks
  const formatBlogContent = (content) => {
    if (!content) return "";
    
    // Preserve all line breaks and spacing exactly as written
    return content.split('\n').map((paragraph, index) => {
      // If paragraph is empty, it's a line break - preserve it
      if (paragraph.trim() === '') {
        return <div key={index} className="h-4" />; // Empty line spacing
      }
      
      // Regular paragraph with proper spacing
      return (
        <p key={index} className="mb-4 leading-7 text-justify">
          {paragraph}
        </p>
      );
    });
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-400 mb-4"></div>
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
    <section className="container mx-auto px-4 sm:px-6 py-8">
      <motion.div
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 border border-gray-100"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Category + Date */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <span className="bg-linear-to-r from-red-500 to-red-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-sm">
            {blog?.category}
          </span>

          <p className="text-gray-500 text-sm font-medium">
            {new Date(blog?.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center leading-tight sm:leading-snug">
          {blog?.title}
        </h1>

        {/* Author */}
        <div className="flex flex-col sm:flex-row items-center justify-center mb-8 gap-4">
          <img
            src={blog?.adminPhoto}
            alt={blog?.adminName}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-red-200 shadow-sm"
          />
          <div className="text-center sm:text-left">
            <p className="text-gray-800 font-semibold text-lg">
              {blog?.adminName}
            </p>
            <p className="text-gray-500 text-sm">Author</p>
          </div>
        </div>

        {/* Blog Image */}
        {blog?.blogImage?.url && (
          <motion.div
            className="w-full mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <img
              src={blog.blogImage.url}
              alt={blog.title}
              className="w-full h-auto max-h-96 object-cover rounded-xl shadow-md border border-gray-200"
            />
          </motion.div>
        )}

        {/* Blog Content Section */}
        <motion.div
          className="relative bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8 text-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {/* Content Header */}
          <div className="border-b border-gray-100 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 inline-block">
              Blog Content
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Preserving original formatting and spacing as written by the author
            </p>
          </div>

          {/* 💡 FIXED: Blog content with EXACT spacing and formatting */}
          <div className="blog-content text-lg leading-relaxed">
            {formatBlogContent(blog?.about)}
          </div>

          {/* Enhanced styling for better readability */}
          <style jsx>{`
            .blog-content {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              line-height: 1.7;
              color: #374151;
            }
            .blog-content p {
              margin-bottom: 1.5rem;
              text-align: justify;
              word-wrap: break-word;
            }
            .blog-content p:last-child {
              margin-bottom: 0;
            }
          `}</style>

          {/* Inspirational Quote */}
          <motion.blockquote 
            className="mt-8 p-6 bg-linear-to-r from-red-50 to-orange-50 rounded-xl border-l-4 border-red-400 italic text-gray-700 text-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <svg className="w-8 h-8 text-red-300 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
            </svg>
            "Great stories deserve to be told exactly as they were written - preserving every thought, every pause, every emotion."
          </motion.blockquote>

          {/* Reading Stats */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{(blog?.about?.length || 0) / 200} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <span>{blog?.about?.split(/\s+/).filter(word => word.length > 0).length} words</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Detail;