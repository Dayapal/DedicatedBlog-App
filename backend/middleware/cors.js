import cors from "cors";
import { env } from "../config/environment.js";

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
  "https://dedicatedblog12-c6306a.netlify.app",
  "https://dedicated-blog-71bttldgt-daya-pals-projects.vercel.app",
  "https://dedicated-blog-app-git-main-daya-pals-projects.vercel.app",
  "https://dedicatedblog-app-1.onrender.com",
  "https://dayapal-portflio-21.netlify.app",
];

if (env.FRONTEND_URL && !allowedOrigins.includes(env.FRONTEND_URL)) {
  allowedOrigins.push(env.FRONTEND_URL);
}

export const corsMiddleware = cors({
  origin: function (origin, callback) {
    // Allow server-to-server or tools with no origin (like Postman or curl in dev)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
    ) {
      return callback(null, true);
    }

    // In production, enforce exact origins
    if (env.isProduction) {
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    }

    // In development, allow for local network testing
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
});
