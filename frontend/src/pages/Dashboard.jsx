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
  const { isAuthenticated } = useAuth();
  const [component, setComponent] = useState("My Blogs");
  const [editingBlogId, setEditingBlogId] = useState(null);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const componentTitles = {
    "My Blogs": {
      title: "My Stories",
      description: "Manage, analyze, and edit all your published articles",
    },
    "Create Blog": {
      title: "Publish New Story",
      description: "Craft a modern article with rich typography and visual assets",
    },
    "Update Blog": {
      title: "Edit Story",
      description: "Revise content, update media, and refine metadata",
    },
    "My Profile": {
      title: "Account Settings",
      description: "Manage your credentials, bio, and author identity",
    },
  };

  const currentInfo = componentTitles[component] || {
    title: component,
    description: "Manage your workspace",
  };

  const handleStartEdit = (id) => {
    setEditingBlogId(id);
    setComponent("Update Blog");
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Sidebar Component */}
      <Sidebar setComponent={setComponent} currentComponent={component} />

      {/* Main Content Pane */}
      <main className="md:ml-80 min-h-[calc(100vh-4rem)] pt-12 md:pt-2">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Title */}
          <motion.div
            key={component}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="pb-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full glass-panel border border-[var(--glass-border)] text-xs font-semibold text-[#332FD0] dark:text-[#B4B2FF] mb-2">
              <span>Author Workspace</span>
              <span>•</span>
              <span className="text-[var(--text-muted)]">{component}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {currentInfo.title}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              {currentInfo.description}
            </p>
          </motion.div>

          {/* Dynamic Content Panel with Transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={component}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {component === "My Profile" ? (
                <MyProfile />
              ) : component === "Create Blog" ? (
                <CreateBlog onCreated={() => setComponent("My Blogs")} />
              ) : component === "Update Blog" ? (
                <UpdateBlog
                  blogId={editingBlogId}
                  onUpdated={() => setComponent("My Blogs")}
                />
              ) : (
                <MyBlogs
                  onNavigateCreate={() => setComponent("Create Blog")}
                  onEditBlog={handleStartEdit}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
