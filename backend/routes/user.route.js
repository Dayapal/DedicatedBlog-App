import express from "express";
import {
  getAdmins,
  getMyProfile,
  login,
  logout,
  register,
} from "../controllers/user.controllers.js";
import { isAuthenticated } from "../middleware/authUser.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.get("/logout", logout); // Supported for backwards compatibility with existing UI
router.get("/my-profile", isAuthenticated, getMyProfile);
router.get("/admins", getAdmins);

export default router;
