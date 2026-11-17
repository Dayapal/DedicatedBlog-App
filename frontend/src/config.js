// Central API configuration
const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const rawBackendUrl =
  import.meta.env.VITE_BACKEND_URL ||
  (isLocalhost
    ? "http://localhost:4001"
    : "https://dedicatedblog-app.onrender.com");

// Strip any trailing slash so `${BACKEND_URL}/api/...` never produces double slashes
export const BACKEND_URL = rawBackendUrl.replace(/\/+$/, "");

