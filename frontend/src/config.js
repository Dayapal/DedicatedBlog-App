// Central API configuration
const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (isLocalhost
    ? "http://localhost:4001"
    : "https://dedicatedblog-app-1.onrender.com");

