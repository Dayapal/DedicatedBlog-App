import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import Sidebar from "../dashboard/Sidebar";
import MyProfile from "../dashboard/MyProfile";
import MyBlogs from "../dashboard/MyBlogs";
import CreateBlog from "../dashboard/CreateBlog";
import UpdateBlog from "../dashboard/UpdateBlog";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Dashboard() {
  const { profile, isAuthenticated } = useAuth();
  const [component, setComponent] = useState("My Blogs");

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  // Component titles with icons
  const componentTitles = {
    "My Blogs": "📝 My Stories",
    "Create Blog": "✨ Create New Story", 
    "Update Blog": "✏️ Edit Story",
    "My Profile": "👤 My Profile"
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar - Fixed for mobile, flexible for desktop */}
        <div className="md:w-60 w-full bg-white  md:min-h-screen border-r border-gray-200 md:fixed md:left-0 md:top-0 md:h-full z-40">
          <Sidebar setComponent={setComponent} currentComponent={component} />
        </div>

        {/* Main Content Area - Adjusted for sidebar */}
        <div className="flex-1 md:ml-80 min-h-screen">
          <div className="p-6 md:p-8 bg-transparent">
            {/* Header */}
            <motion.div 
              className="mb-8 text-center md:text-left"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {componentTitles[component] || component}
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl">
                {component === "My Blogs" && "Manage and view all your published stories"}
                {component === "Create Blog" && "Craft a new inspiring story for your readers"}
                {component === "Update Blog" && "Refine and improve your existing content"}
                {component === "My Profile" && "Manage your account settings and preferences"}
              </p>
            </motion.div>

            {/* Content with smooth transitions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={component}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
              >
                {component === "My Profile" ? (
                  <MyProfile />
                ) : component === "Create Blog" ? (
                  <CreateBlog />
                ) : component === "Update Blog" ? (
                  <UpdateBlog />
                ) : (
                  <MyBlogs />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Dashboard Stats Footer */}
            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="inline-flex items-center gap-6 text-sm text-gray-500 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 border border-gray-200">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">Dashboard</div>
                  <div className="text-xs">Control Center</div>
                </div>
                <div className="w-px h-6 bg-gray-300"></div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">Secure</div>
                  <div className="text-xs">Your Data</div>
                </div>
                <div className="w-px h-6 bg-gray-300"></div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">24/7</div>
                  <div className="text-xs">Available</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile padding to account for fixed sidebar button */}
      <div className="h-20 md:h-0"></div>
    </div>
  );
}

export default Dashboard;