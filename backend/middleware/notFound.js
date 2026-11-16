import { ApiError } from "../utils/apiError.js";
import { HTTP_STATUS } from "../constants/statusCodes.js";

export const notFound = (req, res, next) => {
  const error = new ApiError(
    HTTP_STATUS.NOT_FOUND,
    `Route not found: [${req.method}] ${req.originalUrl}`
  );
  next(error);
};
