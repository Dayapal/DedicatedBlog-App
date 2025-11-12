import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Creators() {
  const [creators, setCreators] = useState([]);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const { data } = await axios.get(
          "https://dedicatedblog-app-1.onrender.com/api/user/admins",
          { withCredentials: true }
        );
        setCreators(data.admins);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCreators();
  }, []);

  return (
    <section className="bg-linear-to-b from-blue-50 to-white py-20">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3">
            👥 Our Creators
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Meet the amazing minds behind the content — passionate storytellers,
            visionaries, and creators who bring ideas to life.
          </p>
        </div>

        {/* Creator Cards */}
        <div className="flex flex-wrap justify-center gap-10">
          {creators && creators.length > 0 ? (
            creators.map((creator) => (
              <motion.div
                key={creator._id}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden max-w-xs w-full relative border border-gray-100"
              >
                {/* Header Background Image */}
                <div className="relative h-32 bg-linear-to-r from-blue-500 to-indigo-500">
                  <img
                    src={creator.photo.url}
                    alt={creator.name}
                    className="absolute left-1/2 transform -translate-x-1/2 translate-y-12 w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                </div>

                {/* Content */}
                <div className="pt-16 pb-8 px-6 text-center bg-gray-50">
                  <h2 className="text-xl font-bold text-gray-800">
                    {creator.name}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">{creator.role}</p>
                  <div className="mt-4 text-gray-600 text-sm">
                    <p>{creator.email}</p>
                    {creator.phone && <p className="mt-1">{creator.phone}</p>}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center mt-20 text-gray-600">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400 mb-4"></div>
              <p className="text-lg font-medium">Loading creators...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Creators;
