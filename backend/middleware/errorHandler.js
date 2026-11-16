import { ApiError } from "../utils/apiError.js";
import { env } from "../config/environment.js";
import { HTTP_STATUS } from "../constants/statusCodes.js";

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // If error is not an instance of ApiError, normalize it
  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let message = error.message || "Internal Server Error";
    let errors = [];

    // Mongoose bad ObjectId (CastError)
    if (error.name === "CastError") {
      statusCode = HTTP_STATUS.BAD_REQUEST;
      message = `Invalid ${error.path}: ${error.value}`;
    }

    // Mongoose duplicate key error (e.g., email already exists)
    if (error.code === 11000) {
      statusCode = HTTP_STATUS.CONFLICT;
      const field = Object.keys(error.keyValue || {})[0] || "field";
      message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    }

    // Mongoose validation error
    if (error.name === "ValidationError") {
      statusCode = HTTP_STATUS.BAD_REQUEST;
      errors = Object.values(error.errors || {}).map((val) => val.message);
      message = errors.join(", ") || "Validation Error";
    }

    // JWT verification errors
    if (error.name === "JsonWebTokenError") {
      statusCode = HTTP_STATUS.UNAUTHORIZED;
      message = "Invalid authentication token";
    }

    if (error.name === "TokenExpiredError") {
      statusCode = HTTP_STATUS.UNAUTHORIZED;
      message = "Authentication token has expired. Please login again.";
    }

    error = new ApiError(statusCode, message, errors, err.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(error.errors?.length > 0 && { errors: error.errors }),
    ...(env.isDevelopment && { stack: error.stack }),
  };

  if (env.isDevelopment) {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, error.message);
  }

  return res.status(error.statusCode).json(response);
};
