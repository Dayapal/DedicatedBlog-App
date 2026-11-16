export class ApiResponse {
  constructor(statusCode, message = "Success", data = null, meta = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;

    if (data !== null && data !== undefined) {
      this.data = data;
    }

    if (meta !== null && meta !== undefined) {
      this.meta = meta;
    }
  }

  static success(res, statusCode = 200, message = "Success", data = null, meta = null) {
    return res
      .status(statusCode)
      .json(new ApiResponse(statusCode, message, data, meta));
  }
}
