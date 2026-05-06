const logger = require("../utils/logger");

/**
 * Middleware untuk log setiap HTTP request
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log saat response selesai
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.logRequest(req, res, duration);
  });

  next();
};

module.exports = requestLogger;
