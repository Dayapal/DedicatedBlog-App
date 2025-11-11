import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

function MyBlogs() {
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4001/api/blogs/my-blog",
          { withCredentials: true }
        );
        setMyBlogs(data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load your blogs.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyBlogs();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:4001/api/blogs/delete/${id}`,
        { withCredentials: true }
      );
      toast.success(res.data.message || "Blog deleted successfully");
      setMyBlogs((prev) => prev.filter((blog) => blog._id !== id));
    } catch (error) {
      toast.error(error.response?.message || "Failed to delete blog");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-10">
          My Blogs
        </h2>

        {loading ? (
          <p className="text-center text-gray-500 text-lg animate-pulse">
            Loading your blogs...
          </p>
        ) : myBlogs && myBlogs.length > 0 ? (
          <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {myBlogs.map((blog) => (
              <motion.div
                key={blog._id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all flex flex-col"
              >
                {/* Image Section */}
                {blog?.blogImage?.url ? (
                  <img
                    src={blog.blogImage.url}
                    alt="Blog"
                    className="w-full h-52 object-cover rounded-t-2xl"
                  />
                ) : (
                  <div className="w-full h-52 bg-blue-100 flex items-center justify-center text-blue-500 font-medium">
                    No Image
                  </div>
                )}

                {/* Blog Info */}
                <div className="flex flex-col justify-between grow p-5">
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                      {blog.category || "Uncategorized"}
                    </p>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {blog.description || "No description available."}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-auto">
                    <Link
                      to={`/blog/update/${blog._id}`}
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white w-1/2 py-2 rounded-lg shadow hover:bg-blue-700 transition-all duration-300"
                    >
                      <FiEdit2 className="text-lg" />
                      <span>Update</span>
                    </Link>

                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="flex items-center justify-center gap-2 bg-red-500 text-white w-1/2 py-2 rounded-lg shadow hover:bg-red-600 transition-all duration-300"
                    >
                      <FiTrash2 className="text-lg" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600 text-lg bg-white p-8 rounded-2xl shadow-md mx-auto max-w-lg"
          >
            You haven’t posted any blogs yet.{" "}
            <Link
              to="/create-blog"
              className="text-blue-600 hover:underline font-medium"
            >
              Create your first blog now!
            </Link>
          </motion.p>
        )}
      </div>
    </div>
  );
}

export default MyBlogs;
