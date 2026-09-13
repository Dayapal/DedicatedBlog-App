import express from "express";
import {
  addComment,
  createBlog,
  deleteBlog,
  deleteComment,
  getAllBlogs,
  getMyBlogs,
  getSingleBlogs,
  getTrendingBlogs,
  likeBlog,
  updateBlog,
} from "../controllers/blog.controller.js";
import { isAdmin, isAuthenticated } from "../middleware/authUser.js";

const router = express.Router();

// Routes
router.get("/trending", getTrendingBlogs);
router.get("/all-blogs", getAllBlogs);
router.get("/single-blog/:id", getSingleBlogs);
router.get("/my-blog", isAuthenticated, isAdmin("admin"), getMyBlogs);
router.post("/create", isAuthenticated, isAdmin("admin"), createBlog);
router.put("/update/:id", isAuthenticated, isAdmin("admin"), updateBlog);
router.delete("/delete/:id", isAuthenticated, isAdmin("admin"), deleteBlog);

// Interactive Reader Engagement Routes
router.put("/like/:id", isAuthenticated, likeBlog);
router.post("/comment/:id", isAuthenticated, addComment);
router.delete("/comment/:id/:commentId", isAuthenticated, deleteComment);

export default router;
