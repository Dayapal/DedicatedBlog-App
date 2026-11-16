import rateLimit from "express-rate-limit";

// Auth routes rate limiter: strict to prevent brute-force
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 auth requests per 15 mins
  message: {
    success: false,
    statusCode: 429,
    message: "Too many authentication requests, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Contact form rate limiter
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Max 10 submissions per hour
  message: {
    success: false,
    statusCode: 429,
    message: "Too many messages sent. Please try again after an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
