import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookies from "../jwt/authToken.js";

export const register = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "User photo is required" });
    }
    const { photo } = req.files;
    const allowedFormats = [
      "image/jpg",
      "image/png",
      "image/jpeg",
      "image/webp",
    ];
    if (!allowedFormats.includes(photo.mimetype)) {
      return res.status(400).json({
        message: "Invalid photo format. Only jpg and png are allowed",
      });
    }
    const { email, name, role, education, password, phone } = req.body;
    if (
      !email ||
      !name ||
      !role ||
      !education ||
      !password ||
      !phone ||
      !photo
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User is already register" });
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
      photo.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.log(cloudinaryResponse.error);
      return res.status(400).json({ message: "cloudinary error" });
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
        url: cloudinaryResponse.url,
      },
    });
    await newUser.save();
    const token = await createTokenAndSaveCookies(newUser._id, res);
    if (newUser) {
      res
        .status(201)
        .json({ message: "User register successfully", newUser, token: token });
    }
    console.log(newUser, token);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    if (!email || !password || !role) {
      return res.status(400).json({ messgae: "Please fill required fileds " });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user.password) {
      return res.status(400).json({ message: "User password is missing" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user || !isMatch) {
      return res.status(400).json({ message: "Invalied email or password" });
    }
    if (user.role !== role) {
      return res.status(400).json({ message: `Given role ${role} not found` });
    }
    const token = await createTokenAndSaveCookies(user._id, res);
    console.log("Login token: ", token)
    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._ic,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", { httpOnly: true ,
      secure:false,
      sameSite:'strict',
    });
    res.status(200).json({ message: " Logged out succeussfully" });
  } catch (error) {
    console.log(error)
    res.status(500).json({error: "Internal Server error"})
  }
};

export const getMyProfile = async (req, res) => {
  const user = await req.user;
  res.status(200).json({ user });
};

export const getAdmins = async (req, res) => {
  const admins = await User.find({ role: "admin" });
  res.status(200).json({ admins });
};