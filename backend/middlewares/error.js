import { sendError } from "../utils/response.js";

// 404 handler
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  let errorDetails = {};

  // Mongoose Cast Error (Invalid Object ID)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message = "Resource not found (Invalid Object ID format)";
    errorDetails = { field: err.path, value: err.value };
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Database Validation Error";
    errorDetails = Object.values(err.errors).reduce((acc, current) => {
      acc[current.path] = current.message;
      return acc;
    }, {});
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    const duplicatedField = Object.keys(err.keyValue)[0];
    message = `Duplicate value error: ${duplicatedField} already exists.`;
    errorDetails = err.keyValue;
  }

  // Log error stack trace internally
  if (statusCode === 500) {
    console.error(err.stack);
  }

  return sendError(res, message, errorDetails, statusCode);
};
