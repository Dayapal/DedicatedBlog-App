import { Blog } from "../models/blog.model.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

export const createBlog = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Blog Image is required" });
    }
    const { blogImage } = req.files;
    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedFormats.includes(blogImage.mimetype)) {
      return res.status(400).json({
        message: "Invalid photo format. Only jpg and png are allowed",
      });
    }
    const { title, category, about } = req.body;
    console.log("Request body", req.body);
    if (!title || !category || !about) {
      return res
        .status(400)
        .json({ message: "title, category & about are required fields" });
    }
    const adminName = req?.user?.name;
    const adminPhoto = req?.user?.photo?.url;
    const createdBy = req?.user?._id;
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    console.log("USER:", req.user);

    const cloudinaryResponse = await cloudinary.uploader.upload(
      blogImage.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.log(cloudinaryResponse.error);
    }
    const blogData = {
      title,
      about,
      category,
      adminName,
      adminPhoto,
      createdBy,
      blogImage: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
      },
    };
    const blog = await Blog.create(blogData);

    res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server error" });
  }
};

export const deleteBlog = async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  await blog.deleteOne();
  res.status(200).json({ message: "Blog deleted successfully" });
};

export const getAllBlogs = async (req, res) => {
  const allBlogs = await Blog.find();
  res.status(200).json(allBlogs);
};

export const getSingleBlogs = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Blog id" });
  }
  const blog = await Blog.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  );
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  res.status(200).json(blog);
};

export const getTrendingBlogs = async (req, res) => {
  try {
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
      { $limit: 8 },
    ]);
    res.status(200).json(trending);
  } catch (error) {
    console.error("Error fetching trending blogs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const likeBlog = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Blog id" });
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const isLiked =
      blog.likes &&
      blog.likes.some((like) => like.toString() === userId.toString());

    if (isLiked) {
      blog.likes = blog.likes.filter(
        (like) => like.toString() !== userId.toString()
      );
    } else {
      if (!blog.likes) blog.likes = [];
      blog.likes.push(userId);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: isLiked ? "Blog unliked" : "Blog liked",
      isLiked: !isLiked,
      likesCount: blog.likes.length,
      likes: blog.likes,
    });
  } catch (error) {
    console.error("Error liking blog:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const user = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Blog id" });
  }

  if (!comment || comment.trim().length === 0) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const newComment = {
      user: user._id,
      userName: user.name,
      userPhoto: user.photo?.url || "",
      comment: comment.trim(),
      createdAt: new Date(),
    };

    blog.comments.unshift(newComment);
    await blog.save();

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comments: blog.comments,
      comment: blog.comments[0],
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  const userId = req.user._id;

  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(commentId)
  ) {
    return res.status(400).json({ message: "Invalid Blog or Comment id" });
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comment = blog.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isCommentAuthor = comment.user.toString() === userId.toString();
    const isBlogCreator =
      blog.createdBy && blog.createdBy.toString() === userId.toString();
    const isAdminUser = req.user.role === "admin";

    if (!isCommentAuthor && !isBlogCreator && !isAdminUser) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this comment" });
    }

    blog.comments = blog.comments.filter(
      (c) => c._id.toString() !== commentId.toString()
    );
    await blog.save();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      comments: blog.comments,
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyBlogs = async (req, res) => {
  const createdBy = req.user._id;
  const myBlogs = await Blog.find({ createdBy });
  res.status(200).json(myBlogs);
};




export const updateBlog = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Blog id" });
  }

  try {
    const updateData = {
      title: req.body.title || undefined,
      category: req.body.category || undefined,
      about: req.body.about || undefined,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    // Handle blog image if uploaded
    if (req.files && req.files.blogImage) {
      const blogImage = req.files.blogImage;
      const cloudinaryResponse = await cloudinary.uploader.upload(
        blogImage.tempFilePath,
        { folder: "blogs" }
      );
      updateData.blogImage = {
        url: cloudinaryResponse.secure_url,
        public_id: cloudinaryResponse.public_id,
      };
    }

    // Update blog in MongoDB
    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "Blog updated successfully",
      updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Server error" });
  }
};
