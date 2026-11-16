import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded regardless of current working directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config(); // Fallback for root or environment overrides

export const env = Object.freeze({
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT, 10) || 4001,
  MONGODB_URL: process.env.MONGODB_URL || "",
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "default_dev_jwt_secret_key_change_me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  FRONTEND_URL: (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, ""),

  CLOUDINARY: Object.freeze({
    CLOUD_NAME: process.env.CLOUD_NAME || "",
    API_KEY: process.env.CLOUD_API_KEY || "",
    API_SECRET: process.env.CLOUD_SECRET_KEY || "",
  }),

  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  CONTACT_RECEIVER_EMAIL: process.env.CONTACT_RECEIVER_EMAIL || "dayapal235370@gmail.com",

  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV !== "production",
});
