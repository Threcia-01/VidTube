//errorHandler.js
import { ApiError } from "./ApiError.js";

const globalErrorHandler = (err, req, res, next) => {
  console.error(err); 

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
    errors: [err.message || "Something went wrong"],
  });
};

export { globalErrorHandler };
