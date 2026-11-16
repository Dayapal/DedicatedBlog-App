import { UserService } from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HTTP_STATUS } from "../constants/statusCodes.js";

export const register = asyncHandler(async (req, res) => {
  const { email, name, role, education, password, phone } = req.body || {};
  const photo = req.files?.photo;

  const result = await UserService.registerUser(
    { email, name, role, education, password, phone, photoFile: photo },
    res
  );

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: "User registered successfully",
    user: result.user,
    newUser: result.newUser,
    token: result.token,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body || {};

  const result = await UserService.loginUser({ email, password, role }, res);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "User logged in successfully",
    user: result.user,
    token: result.token,
  });
});

export const logout = asyncHandler(async (req, res) => {
  UserService.logoutUser(res);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const getMyProfile = asyncHandler(async (req, res) => {
  const user = await UserService.getUserProfile(req.user._id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    user,
  });
});

export const getAdmins = asyncHandler(async (req, res) => {
  const admins = await UserService.getAdmins();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    admins,
  });
});
