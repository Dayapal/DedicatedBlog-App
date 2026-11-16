import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { env } from "../config/environment.js";

export const generateAuthToken = (userId) => {
  return jwt.sign({ userId }, env.JWT_SECRET_KEY, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

export const setAuthCookie = (res, token) => {
  const isProduction = env.isProduction;

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isProduction,
    // Cross-site cookies between Netlify/Vercel and Render require SameSite=None and Secure=true in production
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
};

export const clearAuthCookie = (res) => {
  const isProduction = env.isProduction;

  res.clearCookie("jwt", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
};

const createTokenAndSaveCookies = async (userId, res) => {
  const token = generateAuthToken(userId);
  if (res) {
    setAuthCookie(res, token);
  }
  // Keep the token update for backward compatibility with existing DB records
  try {
    await User.findByIdAndUpdate(userId, { token });
  } catch (err) {
    console.error("Warning: could not update token field in user doc:", err.message);
  }
  return token;
};

export default createTokenAndSaveCookies;
