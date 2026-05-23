import { ErrorRequestHandler } from "express";
import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File size cannot exceed 5 MB"
        : err.message;
    return res.status(400).json({
      success: false,
      message,
      errors: [],
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    errors: [],
  });
};
