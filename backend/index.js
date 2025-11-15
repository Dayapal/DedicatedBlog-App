import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";

import userRouter from "./routes/user.route.js";
import blogRouter from "./routes/blog.route.js";
import contactRouter from "./routes/contact.route.js";

dotenv.config();
const app = express();

// ✅ CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://dedicatedblog12-c6306a.netlify.app",
  "https://dedicated-blog-71bttldgt-daya-pals-projects.vercel.app",
  "https://dedicated-blog-app-git-main-daya-pals-projects.vercel.app",
  "https://dedicatedblog-app-1.onrender.com",
  "https://dayapal-portflio-21.netlify.app/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle OPTIONS requests globally (for DELETE, PUT, etc.)
app.options(/.*/, cors());

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

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

// Routes
app.use("/api/user", userRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/contact", contactRouter);

// Start server
const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
