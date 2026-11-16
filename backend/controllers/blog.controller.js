import { BlogService } from "../services/blog.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HTTP_STATUS } from "../constants/statusCodes.js";

export const createBlog = asyncHandler(async (req, res) => {
  const { title, category, about } = req.body;
  const blogImage = req.files?.blogImage;

  const blog = await BlogService.createBlog({
    title,
    category,
    about,
    blogImageFile: blogImage,
    user: req.user,
  });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: "Blog created successfully",
    blog,
  });
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await BlogService.deleteBlog(id, req.user);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Blog deleted successfully",
  });
});

export const getAllBlogs = asyncHandler(async (req, res) => {
  const { category, search, limit } = req.query;

  const blogs = await BlogService.getAllBlogs({ category, search, limit });

  // Frontend currently binds directly to array on /api/blogs/all-blogs
  res.status(HTTP_STATUS.OK).json(blogs);
});

export const getSingleBlogs = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await BlogService.getSingleBlog(id);

  // Frontend currently expects the blog object directly
  res.status(HTTP_STATUS.OK).json(blog);
});

export const getTrendingBlogs = asyncHandler(async (req, res) => {
  const { limit } = req.query;

  const trending = await BlogService.getTrendingBlogs(limit || 8);

  // Frontend currently expects array directly
  res.status(HTTP_STATUS.OK).json(trending);
});

export const getMyBlogs = asyncHandler(async (req, res) => {
  const myBlogs = await BlogService.getMyBlogs(req.user._id);

  // Frontend currently expects array directly
  res.status(HTTP_STATUS.OK).json(myBlogs);
});

export const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, category, about } = req.body;
  const blogImage = req.files?.blogImage;

  const updatedBlog = await BlogService.updateBlog({
    id,
    title,
    category,
    about,
    blogImageFile: blogImage,
    user: req.user,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Blog updated successfully",
    updatedBlog,
  });
});

export const likeBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await BlogService.toggleLikeBlog(id, req.user._id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: result.isLiked ? "Blog liked" : "Blog unliked",
    isLiked: result.isLiked,
    likesCount: result.likesCount,
    likes: result.likes,
  });
});

export const addComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  const result = await BlogService.addComment(id, {
    commentText: comment,
    user: req.user,
  });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: "Comment added successfully",
    comments: result.comments,
    comment: result.comment,
  });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { id, commentId } = req.params;

  const result = await BlogService.deleteComment(id, commentId, req.user);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Comment deleted successfully",
    comments: result.comments,
  });
});
