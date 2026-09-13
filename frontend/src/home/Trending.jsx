import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import { motion } from "framer-motion";
import { FaEye, FaHeart } from "react-icons/fa";
import "react-multi-carousel/lib/styles.css";
import api from "../services/api";
import { useAuth } from "../context/AuthProvider";

function Trending() {
  const { blogs } = useAuth();
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await api.get("/api/blogs/trending");
        if (data && data.length > 0) {
          setTrendingBlogs(data);
        } else if (blogs && blogs.length > 0) {
          setTrendingBlogs(blogs.slice(0, 8));
        }
      } catch (error) {
        if (blogs && blogs.length > 0) {
          setTrendingBlogs(blogs.slice(0, 8));
        }
      } finally {
        setLoadingTrending(false);
      }
    };

    fetchTrending();
  }, [blogs]);

  const displayedBlogs =
    trendingBlogs.length > 0 ? trendingBlogs : (blogs || []).slice(0, 8);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
  };

  return (
    <section className="bg-linear-to-b from-blue-50 via-white to-blue-100 py-16">
      <div className="container mx-auto px-6">
        {/* Section Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-3">
            🔥 Live Data Driven
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3">
            Trending Stories
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Ranked in real-time by reader views, likes, and community discussions.
          </p>
        </motion.div>

        {displayedBlogs && displayedBlogs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Carousel
              responsive={responsive}
              infinite
              autoPlay
              autoPlaySpeed={2400}
              transitionDuration={700}
              containerClass="carousel-container"
              itemClass="px-3"
              draggable
              swipeable
            >
              {displayedBlogs.map((element, idx) => (
                <motion.div
                  key={element._id || idx}
                  whileHover={{
                    scale: 1.03,
                    y: -4,
                    boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.12)",
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:border-blue-200 cursor-pointer group flex flex-col h-full"
                >
                  <Link to={`/blogs/${element._id}`} className="flex flex-col h-full">
                    {/* Blog Image */}
                    <div className="relative">
                      <img
                        src={
                          element?.blogImage?.url ||
                          "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop"
                        }
                        alt={element?.title}
                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-md">
                        {element?.category}
                      </div>

                      {/* Ranking Badge */}
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 text-xs font-extrabold rounded-full">
                        #{idx + 1}
                      </div>
                    </div>

                    {/* Blog Content */}
                    <div className="p-5 bg-white flex flex-col flex-1 justify-between">
                      <div>
                        <h2
                          className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200"
                          title={element?.title}
                        >
                          {element?.title}
                        </h2>

                        <p className="text-gray-600 text-xs mb-4 line-clamp-2 leading-relaxed">
                          {element?.about?.slice(0, 100) || "Discover insights and ideas."}
                        </p>
                      </div>

                      {/* Author & Engagement Stats */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                          <img
                            src={element.adminPhoto || "/default-avatar.png"}
                            alt={element.adminName}
                            className="w-8 h-8 rounded-full border border-blue-200 object-cover"
                          />
                          <p className="text-gray-800 text-xs font-semibold truncate max-w-[90px]">
                            {element.adminName || "Author"}
                          </p>
                        </div>

                        {/* Views & Likes */}
                        <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                          <span className="flex items-center gap-1">
                            <FaEye className="text-blue-500 text-xs" />
                            {element.views || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaHeart className="text-red-500 text-xs" />
                            {element.likes?.length || element.likesCount || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </Carousel>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-600">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400 mb-4"></div>
            <p className="text-lg font-medium">Loading trending stories...</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Trending;
