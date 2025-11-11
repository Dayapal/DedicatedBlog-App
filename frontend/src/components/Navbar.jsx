import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import toast from "react-hot-toast";

function Navbar() {
  const [show, setShow] = useState(false);
  const { profile, isAuthenticated, setIsAuthenticated, setProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // get current path

  const menuItems = ["HOME", "BLOGS", "CREATORS", "ABOUT", "CONTACT"];

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get("http://localhost:4001/api/user/logout", {
        withCredentials: true,
      });
      toast.success(data.message);
      setIsAuthenticated(false);
      setProfile(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error("Failed to logout");
    }
  };

  const getLinkClasses = (path) =>
    `font-medium px-3 py-1 rounded-md transition-all duration-300 ${
      location.pathname === path
        ? "bg-blue-100 text-blue-700 shadow-inner"
        : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-lg">
      <div className="flex items-center justify-between container mx-auto px-4 py-3 md:py-4">
        {/* Logo */}
        <div className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-wide hover:scale-105 transition-transform duration-300">
          Dedicated<span className="text-blue-600">Blog</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {menuItems.map((item) => {
            const path = item.toLowerCase() === "home" ? "/" : `/${item.toLowerCase()}`;
            return (
              <Link key={item} to={path} className={getLinkClasses(path)}>
                {item}
              </Link>
            );
          })}

          {/* Admin Dashboard */}
          {isAuthenticated && profile?.role === "admin" && (
            <Link
              to="/dashboard"
              className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-xl hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-300"
            >
              Dashboard
            </Link>
          )}

          {/* Login / Logout */}
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="bg-linear-to-r from-red-500 to-red-600 text-white font-semibold px-5 py-2 rounded-xl hover:opacity-90 shadow-sm hover:shadow-md transition-all duration-300"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-linear-to-r from-red-500 to-red-600 text-white font-semibold px-5 py-2 rounded-xl hover:opacity-90 shadow-sm hover:shadow-md transition-all duration-300"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div
          className="md:hidden text-gray-700 cursor-pointer hover:scale-110 transition-transform"
          onClick={() => setShow(!show)}
        >
          {show ? <IoCloseSharp size={28} /> : <AiOutlineMenu size={28} />}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div
        className={`absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-md transition-all duration-500 ease-in-out ${
          show ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <ul className="flex flex-col items-center py-6 space-y-5 text-lg font-medium">
          {menuItems.map((item) => {
            const path = item.toLowerCase() === "home" ? "/" : `/${item.toLowerCase()}`;
            return (
              <Link
                key={item}
                to={path}
                onClick={() => setShow(false)}
                className={`px-4 py-2 rounded-md w-full text-center transition-all duration-300 ${
                  location.pathname === path
                    ? "bg-blue-100 text-blue-700 shadow-inner"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {item}
              </Link>
            );
          })}

          {/* Admin Dashboard */}
          {isAuthenticated && profile?.role === "admin" && (
            <Link
              to="/dashboard"
              onClick={() => setShow(false)}
              className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-300"
            >
              Dashboard
            </Link>
          )}

          {/* Login / Logout */}
          {!isAuthenticated ? (
            <Link
              to="/login"
              onClick={() => setShow(false)}
              className="bg-linear-to-r from-red-500 to-red-600 text-white font-semibold px-6 py-2 rounded-xl hover:opacity-90 shadow-sm hover:shadow-md transition-all duration-300"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={(e) => {
                handleLogout(e);
                setShow(false);
              }}
              className="bg-linear-to-r from-red-500 to-red-600 text-white font-semibold px-6 py-2 rounded-xl hover:opacity-90 shadow-sm hover:shadow-md transition-all duration-300"
            >
              Logout
            </button>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
