import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import Sidebar from "../dashboard/Sidebar";
import MyProfile from "../dashboard/MyProfile";
import MyBlogs from "../dashboard/MyBlogs";
import CreateBlog from "../dashboard/CreateBlog";
import UpdateBlog from "../dashboard/UpdateBlog";
import { Navigate } from "react-router-dom";

function Dashboard() {
  const { profile, isAuthenticated } = useAuth();
  const [component, setComponent] = useState("My Blogs");

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 via-white to-gray-200">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */} 
        <div className="md:w-1/5 w-full bg-white shadow-xl md:min-h-screen border-r border-gray-200">
          <Sidebar component={component} setComponent={setComponent} />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-10 bg-white rounded-t-2xl md:rounded-none md:rounded-l-2xl shadow-inner">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
            {component} 
          </h1>

          <div className="transition-all duration-500 ease-in-out">
            {component === "My Profile" ? (
              <MyProfile />
            ) : component === "Create Blog" ? (
              <CreateBlog />
            ) : component === "Update Blog" ? (
              <UpdateBlog />
            ) : (
              <MyBlogs />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
