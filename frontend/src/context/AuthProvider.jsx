import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    
    const fetchProfile = async () => {
      console.log("hlks")
      try {
        let token = localStorage.getItem("jwt");
        console.log(localStorage.getItem("jwt" ));

        if (token) {
          const { data } = await axios.get(
            "http://localhost:4001/api/user/my-profile",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("User Profile:", data.user);
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
        const { data } = await axios.get(
          "http://localhost:4001/api/blogs/all-blogs"
        );
        console.log("All Blogs:", data);
        setBlogs(data);
      } catch (error) {
        console.log("Blogs fetch error:", error);
      }
    };

    fetchBlogs();
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        blogs,
        profile,
        setProfile,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
