// backend/src/middlewares/auth.js
const jwt = require("jsonwebtoken");
const { query } = require("../config/database");
require("dotenv").config();

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Akses ditolak. Token tidak ditemukan",
        });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({
            success: false,
            message: "Token sudah kadaluarsa. Silakan login kembali",
            code: "TOKEN_EXPIRED",
          });
      }
      return res
        .status(401)
        .json({
          success: false,
          message: "Token tidak valid",
          code: "TOKEN_INVALID",
        });
    }

    // SQLite: query sync, tidak perlu await
    const result = query(
      `SELECT id, nama, username, email, role, is_active FROM admin WHERE id = ?`,
      [decoded.id],
    );

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Admin tidak ditemukan" });
    }

    const admin = result.rows[0];

    if (!admin.is_active) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Akun anda telah dinonaktifkan. Hubungi superadmin",
        });
    }

    req.admin = admin;
    next();
  } catch (error) {
    next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res
        .status(401)
        .json({ success: false, message: "Tidak terautentikasi" });
    }
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak. Hanya ${roles.join(" atau ")} yang dapat mengakses`,
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
