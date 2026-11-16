import axios from "axios";
import { BACKEND_URL } from "../config";

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically inject JWT token into all outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 (token expired) gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      // If token expired while on dashboard, clean up and redirect
      if (currentPath.startsWith("/dashboard")) {
        localStorage.removeItem("jwt");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

