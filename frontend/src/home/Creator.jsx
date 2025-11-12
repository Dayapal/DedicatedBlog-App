import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";

function Creator() {
  const [admin, setAdmin] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "https://dedicatedblog-app-1.onrender.com/api/user/admins",
          { withCredentials: true }
        );
        setAdmin(data.admins || []);
      } catch (err) {
        console.error("Error fetching admins:", err);
        setError("Failed to load creators. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  return (
    <section className="bg-linear-to-b from-blue-50 via-white to-blue-100 py-16 px-6 md:px-12 transition-colors">
      {/* Section Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-3">
          Meet Our Creators
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Explore the brilliant minds sharing ideas, insights, and inspiration across the platform.
        </p>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center mt-12 text-gray-500">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mb-4"></div>
          <p className="text-lg font-medium">Loading creators...</p>
        </div>
      )}

      {/* Error Message */}
      {error && !loading && (
        <p className="text-center text-red-500 font-medium">{error}</p>
      )}

      {/* Creator Grid */}
      {!loading && !error && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {admin && admin.length > 0 ? (
            admin.slice(0, 8).map((element, index) => (
              <motion.div
                key={element._id}
                whileHover={{
                  scale: 1.05,
                  y: -6,
                  rotate: 0.3,
                  transition: { type: "spring", stiffness: 200 },
                }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center p-6 border border-gray-100 hover:border-blue-200"
              >
                {element?.photo?.url ? (
                  <motion.img
                    src={element.photo.url}
                    alt={element?.name || "Creator"}
                    className="w-32 h-32 object-cover rounded-full border-4 border-blue-200 shadow-sm mb-4"
                    whileHover={{ rotate: 5 }}
                    transition={{ duration: 0.4 }}
                  />
                ) : (
                  <FaUserCircle className="w-32 h-32 text-blue-300 mb-4" />
                )}

                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {element?.name || "Unknown"}
                </h2>
                <p className="text-blue-500 text-sm font-medium tracking-wide">
                  {element?.role || "Admin"}
                </p>

                <div className="mt-4 text-center">
                  <p className="text-gray-500 text-sm max-w-[200px] mx-auto">
                    Passionate creator bringing ideas to life ✨
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 text-lg">
              No creators found.
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
}

export default Creator;
