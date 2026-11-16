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
import { authorizeRoles, isAuthenticated } from "../middleware/authUser.js";

const router = express.Router();

// Public Discovery Routes
router.get("/trending", getTrendingBlogs);
router.get("/all-blogs", getAllBlogs);
router.get("/single-blog/:id", getSingleBlogs);

// RESTful aliases for /api/v1
router.get("/", getAllBlogs);
router.get("/:id", getSingleBlogs);

// Author & Admin Protected Content Management Routes
router.get(
  "/my-blog",
  isAuthenticated,
  authorizeRoles("admin", "author"),
  getMyBlogs
);
router.post(
  "/create",
  isAuthenticated,
  authorizeRoles("admin", "author"),
  createBlog
);
router.post(
  "/",
  isAuthenticated,
  authorizeRoles("admin", "author"),
  createBlog
);
router.put(
  "/update/:id",
  isAuthenticated,
  authorizeRoles("admin", "author"),
  updateBlog
);
router.put(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin", "author"),
  updateBlog
);
router.delete(
  "/delete/:id",
  isAuthenticated,
  authorizeRoles("admin", "author"),
  deleteBlog
);
router.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin", "author"),
  deleteBlog
);

// Reader Engagement Routes
router.put("/like/:id", isAuthenticated, likeBlog);
router.post("/comment/:id", isAuthenticated, addComment);
router.delete("/comment/:id/:commentId", isAuthenticated, deleteComment);

export default router;
