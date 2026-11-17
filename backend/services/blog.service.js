import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import { Blog } from "../models/blog.model.js";
import { ApiError } from "../utils/apiError.js";
import { HTTP_STATUS } from "../constants/statusCodes.js";

export class BlogService {
  static async createBlog({ title, category, about, blogImageFile, user }) {
    if (!blogImageFile) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Blog featured image is required");
    }

    const allowedFormats = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedFormats.includes(blogImageFile.mimetype)) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Invalid image format. Only JPG, JPEG, PNG, and WebP are allowed"
      );
    }

    if (!title || !category || !about) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Title, category, and about content are required fields"
      );
    }

    if (about.length < 200) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Content should contain at least 200 characters"
      );
    }

    let cloudinaryResponse;
    try {
      cloudinaryResponse = await cloudinary.uploader.upload(blogImageFile.tempFilePath, {
        folder: "blogs",
      });
    } catch (uploadError) {
      console.error("Cloudinary blog image upload error:", uploadError);
      throw new ApiError(HTTP_STATUS.BAD_GATEWAY, "Failed to upload blog image to cloud storage");
    }

    const blogData = {
      title,
      about,
      category,
      adminName: user.name,
      adminPhoto: user.photo?.url || "",
      createdBy: user._id,
      blogImage: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url || cloudinaryResponse.url,
      },
    };

    const blog = await Blog.create(blogData);
    return blog;
  }

  static async getAllBlogs({ category, search, page = 1, limit = 50 } = {}) {
    const query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { about: { $regex: search, $options: "i" } },
      ];
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    return blogs;
  }

  static async getSingleBlog(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid Blog ID format");
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!blog) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Blog not found");
    }

    return blog;
  }

  static async getTrendingBlogs(limit = 8) {
    const trending = await Blog.aggregate([
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ["$likes", []] } },
          score: {
            $add: [
              { $ifNull: ["$views", 0] },
              { $multiply: [{ $size: { $ifNull: ["$likes", []] } }, 3] },
            ],
          },
        },
      },
      { $sort: { score: -1, createdAt: -1 } },
      { $limit: Number(limit) },
    ]);

    return trending;
  }

  static async getMyBlogs(userId) {
    const blogs = await Blog.find({ createdBy: userId }).sort({ createdAt: -1 });
    return blogs;
  }

  static async updateBlog({ id, title, category, about, blogImageFile, user }) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid Blog ID format");
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Blog not found");
    }

    // Ownership check: must be author of blog or an admin
    const isOwner = blog.createdBy && blog.createdBy.toString() === user._id.toString();
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, "You do not have permission to edit this blog");
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (about !== undefined) updateData.about = about;

    if (blogImageFile) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(blogImageFile.tempFilePath, {
          folder: "blogs",
        });
        updateData.blogImage = {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url || cloudinaryResponse.url,
        };
      } catch (uploadError) {
        console.error("Cloudinary update image error:", uploadError);
        throw new ApiError(HTTP_STATUS.BAD_GATEWAY, "Failed to upload updated blog image");
      }
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
    return updatedBlog;
  }

  static async deleteBlog(id, user) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid Blog ID format");
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Blog not found");
    }

    const isOwner = blog.createdBy && blog.createdBy.toString() === user._id.toString();
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, "You do not have permission to delete this blog");
    }

    // Attempt to delete Cloudinary asset if public_id exists
    if (blog.blogImage?.public_id) {
      try {
        await cloudinary.uploader.destroy(blog.blogImage.public_id);
      } catch (cleanupErr) {
        console.warn("Could not delete old image from Cloudinary:", cleanupErr.message);
      }
    }

    await blog.deleteOne();
    return { success: true };
  }

  static async toggleLikeBlog(id, userId) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid Blog ID format");
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Blog not found");
    }

    if (!blog.likes) blog.likes = [];

    const isLiked = blog.likes.some((like) => like.toString() === userId.toString());

    if (isLiked) {
      blog.likes = blog.likes.filter((like) => like.toString() !== userId.toString());
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    return {
      isLiked: !isLiked,
      likesCount: blog.likes.length,
      likes: blog.likes,
    };
  }

  static async addComment(id, { commentText, user }) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid Blog ID format");
    }

    if (!commentText || commentText.trim().length === 0) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Comment text is required");
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Blog not found");
    }

    const newComment = {
      user: user._id,
      userName: user.name,
      userPhoto: user.photo?.url || "",
      comment: commentText.trim(),
      createdAt: new Date(),
    };

    blog.comments.unshift(newComment);
    await blog.save();

    return {
      comments: blog.comments,
      comment: blog.comments[0],
    };
  }

  static async deleteComment(id, commentId, user) {
    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(commentId)
    ) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid Blog or Comment ID format");
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Blog not found");
    }

    const comment = typeof blog.comments.id === "function"
      ? blog.comments.id(commentId)
      : blog.comments.find((c) => c._id?.toString() === commentId.toString());
    if (!comment) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Comment not found");
    }

    const isCommentAuthor = comment.user && comment.user.toString() === user._id.toString();
    const isBlogCreator = blog.createdBy && blog.createdBy.toString() === user._id.toString();
    const isAdmin = user.role === "admin";

    if (!isCommentAuthor && !isBlogCreator && !isAdmin) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, "Unauthorized to delete this comment");
    }

    blog.comments = blog.comments.filter((c) => c._id.toString() !== commentId.toString());
    await blog.save();

    return { comments: blog.comments };
  }
}
