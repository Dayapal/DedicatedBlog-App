import express from "express";
import { handleContactMessage } from "../controllers/contact.controller.js";
import { contactLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/", contactLimiter, handleContactMessage);

export default router;
