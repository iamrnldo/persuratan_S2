const logger = require("../utils/logger");

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // PostgreSQL errors
  if (err.code === "23505") {
    statusCode = 409;
    message = "Data sudah ada (duplikat)";
  } else if (err.code === "23503") {
    statusCode = 400;
    message = "Data referensi tidak ditemukan";
  } else if (err.code === "22P02") {
    statusCode = 400;
    message = "Format data tidak valid";
  } else if (err.code === "23502") {
    statusCode = 400;
    message = "Field wajib tidak boleh kosong";
  }

  // Log error
  logger.logError(err, req);

  // Response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      code: err.code,
    }),
  });
};

module.exports = errorHandler;
