import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { HTTP_STATUS } from "../constants/statusCodes.js";
import createTokenAndSaveCookies, { clearAuthCookie } from "../jwt/authToken.js";

export class UserService {
  static async registerUser({ name, email, password, phone, role, education, photoFile }, res) {
    if (!photoFile) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Profile photo is required");
    }

    const allowedFormats = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedFormats.includes(photoFile.mimetype)) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Invalid photo format. Only JPG, JPEG, PNG, and WebP are allowed"
      );
    }

    if (!email || !name || !role || !education || !password || !phone) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "All fields are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "User is already registered with this email");
    }

    // Upload photo to Cloudinary
    let cloudinaryResponse;
    try {
      cloudinaryResponse = await cloudinary.uploader.upload(photoFile.tempFilePath, {
        folder: "user_avatars",
      });
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      throw new ApiError(HTTP_STATUS.BAD_GATEWAY, "Failed to upload profile photo to cloud storage");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      name,
      role,
      education,
      password: hashPassword,
      phone,
      photo: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url || cloudinaryResponse.url,
      },
    });

    await newUser.save();

    const token = await createTokenAndSaveCookies(newUser._id, res);

    return {
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        photo: newUser.photo,
      },
      newUser,
      token,
    };
  }

  static async loginUser({ email, password, role }, res) {
    if (!email || !password) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Please provide email and password");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
    }

    if (!user.password) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Password is missing from account");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
    }

    // If role was supplied by client, check compatibility
    if (role && user.role !== role) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        `Account role is '${user.role}', but '${role}' was selected`
      );
    }

    const token = await createTokenAndSaveCookies(user._id, res);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
      },
      token,
    };
  }

  static logoutUser(res) {
    clearAuthCookie(res);
  }

  static async getUserProfile(userId) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User profile not found");
    }
    return user;
  }

  static async getAdmins() {
    const admins = await User.find({ role: "admin" }).select("-password");
    return admins;
  }
}
