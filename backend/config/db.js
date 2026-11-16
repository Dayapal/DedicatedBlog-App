import mongoose from "mongoose";
import { env } from "./environment.js";

export const connectDB = async () => {
  if (!env.MONGODB_URL) {
    console.error("❌ CRITICAL: MONGODB_URL is not set in environment variables!");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(env.MONGODB_URL, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB connection disconnected.");
  });

  mongoose.connection.on("error", (err) => {
    console.error(`❌ MongoDB runtime error: ${err.message}`);
  });
};

export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
};
