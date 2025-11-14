import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CiMenuBurger } from "react-icons/ci";
import { BiSolidLeftArrowAlt } from "react-icons/bi";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaHome,
  FaPenFancy,
  FaBookOpen,
} from "react-icons/fa";
import toast from "react-hot-toast";

function Sidebar({ setComponent }) {
  const { setIsAuthenticated } = useAuth();
  const navigateTo = useNavigate();
  const [show, setShow] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) return toast.error("Please log in first");

        const { data } = await axios.get(
          "https://dedicatedblog-app-1.onrender.com/api/user/my-profile",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const navItems = [
    {
      label: "My Blogs",
      icon: FaBookOpen,
      action: () => setComponent("My Blogs"),
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Create Blog",
      icon: FaPenFancy,
      action: () => setComponent("Create Blog"),
      color: "from-blue-600 to-blue-700",
    },
    {
      label: "My Profile",
      icon: FaUserCircle,
      action: () => setComponent("My Profile"),
      color: "from-blue-700 to-blue-800",
    },
    {
      label: "Home",
      icon: FaHome,
      action: () => navigateTo("/"),
      color: "from-gray-600 to-gray-700",
    },
  ];

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(
        "https://dedicatedblog-app-1.onrender.com/api/user/logout",
        { withCredentials: true }
      );

      toast.success(data.message);
      localStorage.removeItem("jwt");
      setIsAuthenticated(false);
      navigateTo("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <>
      {/* Mobile menu trigger */}
      <div
        className="sm:hidden fixed top-2 left-4 z-50 bg-blue-600 text-white p-2 rounded-2xl cursor-pointer"
        onClick={() => setShow(true)}
      >
        <CiMenuBurger className="text-xl" />
      </div>

      {/* Sidebar container */}
      <div
        className={`
    w-66 h-full fixed top-0 left-0
    bg-white/70 backdrop-blur-xl
    border-r border-gray-200 shadow-2xl
    p-6 transition-transform duration-300
    sm:translate-x-0 z-20

    /* Prevent scroll on desktop */
    sm:overflow-y-hidden

    /* Allow scroll only on mobile */
    overflow-y-auto

    ${show ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        {/* Mobile close button */}
        <div
          className="sm:hidden absolute top-3 right-4 text-gray-600 cursor-pointer"
          onClick={() => setShow(false)}
        >
          <BiSolidLeftArrowAlt className="text-3xl" />
        </div>

        {/* Profile Section */}
        <div className="text-center  mb-5">
          {loading ? (
            <p className="text-gray-500">Loading profile...</p>
          ) : (
            <>
              <img
                src={profile?.user?.photo?.url || "/default-avatar.png"}
                className="w-16 h-16 mx-auto rounded-full border-4 border-blue-100 shadow-lg object-cover"
                alt="Profile"
              />

              <h2 className="text-lg font-semibold mt-3 text-gray-900">
                {profile?.user?.name}
              </h2>

              <p className="text-sm text-gray-500 break-all px-2">
                {profile?.user?.email}
              </p>
            </>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-4 pb-10">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.action();
                setShow(false);
              }}
              className={`
                w-full flex items-center gap-3 px-5 py-3 rounded-xl
                text-white font-medium shadow-sm
                bg-linear-to-r ${item.color}
                hover:shadow-md hover:scale-[1.02]
                transition-all duration-200
              `}
            >
              <item.icon className="text-lg" />
              {item.label}
            </button>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="
              w-full flex items-center gap-3 px-5 py-3 rounded-xl
              font-medium text-white bg-red-500
              hover:bg-red-600 hover:shadow-md hover:scale-[1.02]
              transition-all duration-200
            "
          >
            <FaSignOutAlt className="text-lg" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
