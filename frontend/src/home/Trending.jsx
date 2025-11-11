import React from "react";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import { motion } from "framer-motion";
import "react-multi-carousel/lib/styles.css";

function Trending() {
  const { blogs } = useAuth();

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
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3">
            🔥 Trending Now
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore stories capturing hearts and minds this week.
          </p>
        </motion.div>

        {blogs && blogs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Carousel
              responsive={responsive}
              infinite
              autoPlay
              autoPlaySpeed={2200}
              transitionDuration={700}
              containerClass="carousel-container"
              itemClass="px-4"
              draggable
              swipeable
            >
              {blogs.slice(0, 6).map((element) => (
                <motion.div
                  key={element._id}
                  whileHover={{
                    scale: 1.04,
                    rotate: 0.5,
                    boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.15)",
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:border-blue-200 cursor-pointer group"
                >
                  <Link to={`/blogs/${element._id}`}>
                    {/* Blog Image */}
                    <div className="relative">
                      <img
                        src={element.blogImage.url}
                        alt={element.title}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 text-sm font-semibold rounded-full shadow-sm">
                        {element.category}
                      </div>
                    </div>

                    {/* Blog Content */}
                    <div className="p-6 bg-gray-50">
                      <h2
                        className="text-xl font-bold text-gray-800 mb-3 truncate group-hover:text-blue-600 transition-colors duration-300"
                        title={element.title}
                      >
                        {element.title}
                      </h2>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {element.description?.slice(0, 90) || "Discover trending insights and ideas."}
                      </p>

                      {/* Author Info */}
                      <div className="flex items-center mt-auto">
                        <img
                          src={element.adminPhoto || "/default-avatar.png"}
                          alt={element.adminName}
                          className="w-10 h-10 rounded-full border border-blue-300 shadow-sm"
                        />
                        <div className="ml-3">
                          <p className="text-gray-800 text-sm font-semibold">
                            {element.adminName}
                          </p>
                          <p className="text-gray-400 text-xs">Author</p>
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
            <p className="text-lg font-medium">Loading trending blogs...</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Trending;
