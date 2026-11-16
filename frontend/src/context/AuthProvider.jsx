import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let token = localStorage.getItem("jwt");
        if (token) {
          const { data } = await axios.get("/api/user/my-profile", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          setProfile(data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log("Profile fetch error:", error);
        setIsAuthenticated(false);
        setProfile(null);
      }
    };

    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get("/api/blogs/all-blogs");
        setBlogs(data);
      } catch (error) {
        console.log("Blogs fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        blogs,
        setBlogs,
        profile,
        setProfile,
        isAuthenticated,
        setIsAuthenticated,
        loading: isLoading,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
