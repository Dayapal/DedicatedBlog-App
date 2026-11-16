import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { env } from "../config/environment.js";
import { ApiError } from "../utils/apiError.js";
import { HTTP_STATUS } from "../constants/statusCodes.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    let token = req.cookies?.jwt;

    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          "Authentication required. Please login to access this resource."
        )
      );
    }

    const decoded = jwt.verify(token, env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return next(
        new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          "User account no longer exists. Please re-authenticate."
        )
      );
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(
        new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          "Session expired. Please login again."
        )
      );
    }
    return next(
      new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Invalid token. Authentication failed."
      )
    );
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(
          HTTP_STATUS.FORBIDDEN,
          `Access denied. Role '${req.user?.role || "anonymous"}' is not authorized to perform this action.`
        )
      );
    }
    next();
  };
};

// Backward-compatible alias for existing imports
export const isAdmin = authorizeRoles;
