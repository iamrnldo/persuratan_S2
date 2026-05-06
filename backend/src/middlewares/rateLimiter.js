const rateLimit = require("express-rate-limit");

/**
 * General API Rate Limiter
 * 100 requests per 15 menit
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // 100 requests per windowMs
  message: {
    success: false,
    message: "Terlalu banyak request dari IP ini, silakan coba lagi nanti.",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  // Skip rate limiting untuk IP tertentu (optional)
  skip: (req) => {
    const whitelist = process.env.RATE_LIMIT_WHITELIST?.split(",") || [];
    return whitelist.includes(req.ip);
  },
});

/**
 * Auth Rate Limiter (lebih ketat)
 * 5 login attempts per 15 menit
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // 5 requests per windowMs
  skipSuccessfulRequests: true, // Tidak count request yang berhasil
  message: {
    success: false,
    message:
      "Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.",
  },
});

/**
 * Create/Update/Delete Rate Limiter (moderat)
 * 30 requests per 15 menit
 */
const mutateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: "Terlalu banyak operasi perubahan data. Silakan tunggu sebentar.",
  },
});

module.exports = {
  generalLimiter,
  authLimiter,
  mutateLimiter,
};
