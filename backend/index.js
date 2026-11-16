import express from "express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import os from "os";

// Configurations & Database
import { env } from "./config/environment.js";
import { connectDB, closeDB } from "./config/db.js";
import "./config/cloudinary.js"; // Initialize Cloudinary config

// Middlewares
import { corsMiddleware } from "./middleware/cors.js";
import { mongoSanitize } from "./middleware/sanitize.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Routes
import apiV1Router from "./routes/index.js";
import userRouter from "./routes/user.route.js";
import blogRouter from "./routes/blog.route.js";
import contactRouter from "./routes/contact.route.js";
import healthRouter from "./routes/health.route.js";

const app = express();

// 1. Trust proxy for rate limiting & secure cookies behind reverse proxies (Render, Vercel, Nginx)
app.set("trust proxy", 1);

// 2. Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Keep disabled to allow Cloudinary remote assets
  })
);

// 3. Secure CORS configuration (single, unified configuration)
app.use(corsMiddleware);

// 4. Request Logging (HTTP access log)
if (env.isDevelopment) {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// 5. Performance: gzip / deflate response compression
app.use(compression());

// 6. Body Parsers & Cookie Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// 7. NoSQL Query & Body Sanitization
app.use(mongoSanitize);

// 8. Cross-platform File Uploads (Windows & Linux compatible temp directory)
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max upload size
    abortOnLimit: true,
  })
);

// 9. Root & Health Check Endpoints
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DedicatedBlog Platform API is running.",
    version: "v1.0.0",
    docs: "/api/v1",
    health: "/health",
  });
});

app.use("/health", healthRouter);

// 10. General API Rate Limiting
app.use("/api", apiLimiter);

// 11. Versioned API Routes (/api/v1)
app.use("/api/v1", apiV1Router);

// 12. Legacy API Routes (for backward compatibility with existing frontend)
app.use("/api/user", userRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/contact", contactRouter);

// 13. 404 Catch-All Handler
app.use(notFound);

// 14. Centralized Global Error Handler
app.use(errorHandler);

// 15. Server Initialization & Graceful Shutdown
const PORT = env.PORT;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
    console.log(`📡 Healthcheck available at: http://localhost:${PORT}/health`);
  });

  const handleTermination = async (signal) => {
    console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
    server.close(async () => {
      console.log("HTTP server closed.");
      await closeDB();
      process.exit(0);
    });

    // Force shutdown after 10 seconds if hanging
    setTimeout(() => {
      console.error("❌ Forcing shutdown after timeout.");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => handleTermination("SIGTERM"));
  process.on("SIGINT", () => handleTermination("SIGINT"));
};

startServer();

export default app;
