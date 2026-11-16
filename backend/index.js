import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
import rateLimit from "express-rate-limit";

import userRouter from "./routes/user.route.js";
import blogRouter from "./routes/blog.route.js";
import contactRouter from "./routes/contact.route.js";

const app = express();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 auth requests per 15 minutes
  message: { message: "Too many authentication requests, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

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

if (process.env.FRONTEND_URL) {
  const envFrontend = process.env.FRONTEND_URL.replace(/\/$/, "");
  if (!allowedOrigins.includes(envFrontend)) {
    allowedOrigins.push(envFrontend);
  }
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".netlify.app") ||
        origin.endsWith(".onrender.com") ||
        /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Root route
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully! hello");
});
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});


app.use("/api/user/login", authLimiter);
app.use("/api/user/register", authLimiter);
app.use("/api/user", userRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/contact", contactRouter);

// Global centralized error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start server
const port = process.env.PORT || 4001;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
