import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CiMenuBurger } from "react-icons/ci";
import { BiSolidLeftArrowAlt } from "react-icons/bi";
import toast from "react-hot-toast";

function Sidebar({ setComponent }) {
  const { setIsAuthenticated } = useAuth();
  const navigateTo = useNavigate();
  const [show, setShow] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          toast.error("Please log in first");
          return;
        }

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
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);
  const handleComponents = (value) => setComponent(value);
  const gotoHome = () => navigateTo("/");

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get("https://dedicatedblog-app-1.onrender.com/api/user/logout", {
        withCredentials: true,
      });
      toast.success(data.message);
      localStorage.removeItem("jwt");
      setIsAuthenticated(false);
      navigateTo("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to logout");
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div
        className="sm:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-md shadow-md cursor-pointer"
        onClick={() => setShow(!show)}
      >
        <CiMenuBurger className="text-xl" />
      </div>

      {/* Sidebar */}
      <div
        className={`w-60 h-full shadow-lg fixed top-0 left-0 bg-linear-to-b from-gray-50 to-gray-100 border-r border-gray-200 transition-transform duration-300 transform sm:translate-x-0 ${show ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Close Button for Mobile */}
        <div
          className="sm:hidden absolute top-4 right-4 text-gray-700 cursor-pointer"
          onClick={() => setShow(!show)}
        >
          <BiSolidLeftArrowAlt className="text-2xl" />
        </div>

        {/* Profile Section */}
        <div className="text-center mt-10 mb-6">
          {loading ? (
            <p className="text-gray-500">Loading profile...</p>
          ) : (
            <>
              <img
                className="w-20 h-20 rounded-full mx-auto border-2 border-gray-300 shadow-sm object-cover"
                src={profile?.user?.photo?.url || "/default-avatar.png"}
                alt="User"
              />
              <p className="text-lg font-semibold mt-2 text-gray-800">
                {profile?.user?.name || "Unknown User"}
              </p>
              <p className="text-sm text-gray-500">{profile?.user?.email}</p>
            </>
          )}
        </div>

        {/* Buttons Section */}
        <ul className="space-y-4 px-5">
          <button
            onClick={() => handleComponents("My Blogs")}
            className="w-full py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition duration-300 font-medium"
          >
            My Blogs
          </button>
          <button
            onClick={() => handleComponents("Create Blog")}
            className="w-full py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-300 font-medium"
          >
            Create Blog
          </button>
          <button
            onClick={() => handleComponents("My Profile")}
            className="w-full py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition duration-300 font-medium"
          >
            My Profile
          </button>
          <button
            onClick={gotoHome}
            className="w-full py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800 transition duration-300 font-medium"
          >
            Home
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition duration-300 font-medium"
          >
            Logout
          </button>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
