// backend/src/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../config/database");
require("dotenv").config();

const generateAccessToken = (admin) => {
  return jwt.sign(
    {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" },
  );
};

const generateRefreshToken = (admin) => {
  return jwt.sign({ id: admin.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
};

// ================================================================
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // SQLite tidak ada ILIKE, pakai LOWER() untuk case-insensitive
    const result = query(
      `SELECT * FROM admin
       WHERE (LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)) AND is_active = 1`,
      [username, username],
    );

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Username/email atau password salah",
        });
    }

    const admin = result.rows[0];

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Username/email atau password salah",
        });
    }

    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);

    query(
      `UPDATE admin SET refresh_token = ?, last_login = datetime('now'), updated_at = datetime('now') WHERE id = ?`,
      [refreshToken, admin.id],
    );

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: {
        admin: {
          id: admin.id,
          nama: admin.nama,
          username: admin.username,
          email: admin.email,
          role: admin.role,
          last_login: admin.last_login,
        },
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: "Bearer",
        expires_in: process.env.JWT_EXPIRES_IN || "15m",
      },
    });
  } catch (error) {
    next(error);
  }
};

// ================================================================
const refreshToken = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token tidak ditemukan" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res
        .status(401)
        .json({
          success: false,
          message: "Refresh token tidak valid atau sudah kadaluarsa",
        });
    }

    const result = query(
      `SELECT * FROM admin WHERE id = ? AND refresh_token = ? AND is_active = 1`,
      [decoded.id, refresh_token],
    );

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token tidak valid" });
    }

    const admin = result.rows[0];
    const newAccessToken = generateAccessToken(admin);
    const newRefreshToken = generateRefreshToken(admin);

    query(`UPDATE admin SET refresh_token = ? WHERE id = ?`, [
      newRefreshToken,
      admin.id,
    ]);

    res.status(200).json({
      success: true,
      message: "Token berhasil diperbarui",
      data: {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        token_type: "Bearer",
        expires_in: process.env.JWT_EXPIRES_IN || "15m",
      },
    });
  } catch (error) {
    next(error);
  }
};

// ================================================================
const logout = async (req, res, next) => {
  try {
    query(`UPDATE admin SET refresh_token = NULL WHERE id = ?`, [req.admin.id]);
    res.status(200).json({ success: true, message: "Logout berhasil" });
  } catch (error) {
    next(error);
  }
};

// ================================================================
const getMe = async (req, res, next) => {
  try {
    const result = query(
      `SELECT id, nama, username, email, role, is_active, last_login, created_at FROM admin WHERE id = ?`,
      [req.admin.id],
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Data profil berhasil diambil",
        data: result.rows[0],
      });
  } catch (error) {
    next(error);
  }
};

// ================================================================
const changePassword = async (req, res, next) => {
  try {
    const { password_lama, password_baru } = req.body;

    const result = query(`SELECT password FROM admin WHERE id = ?`, [
      req.admin.id,
    ]);
    const admin = result.rows[0];

    const isMatch = await bcrypt.compare(password_lama, admin.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Password lama tidak sesuai" });
    }

    const hashedPassword = await bcrypt.hash(password_baru, 12);

    query(
      `UPDATE admin SET password = ?, refresh_token = NULL, updated_at = datetime('now') WHERE id = ?`,
      [hashedPassword, req.admin.id],
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Password berhasil diubah. Silakan login kembali",
      });
  } catch (error) {
    next(error);
  }
};

// ================================================================
const register = async (req, res, next) => {
  try {
    const { nama, username, email, password, role = "admin" } = req.body;

    const usernameCheck = query(`SELECT id FROM admin WHERE username = ?`, [
      username,
    ]);
    if (usernameCheck.rows.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Username sudah digunakan" });
    }

    const emailCheck = query(`SELECT id FROM admin WHERE email = ?`, [email]);
    if (emailCheck.rows.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Email sudah digunakan" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const insertResult = query(
      `INSERT INTO admin (nama, username, email, password, role) VALUES (?, ?, ?, ?, ?)`,
      [nama, username, email, hashedPassword, role],
    );

    // Ambil data yang baru diinsert
    const newAdmin = query(
      `SELECT id, nama, username, email, role, is_active, created_at FROM admin WHERE id = ?`,
      [
        insertResult.rows[0]?.id ||
          /* fallback */ query(`SELECT last_insert_rowid() as id`).rows[0].id,
      ],
    );

    res
      .status(201)
      .json({
        success: true,
        message: "Admin baru berhasil dibuat",
        data: newAdmin.rows[0],
      });
  } catch (error) {
    next(error);
  }
};

// ================================================================
const getAllAdmins = async (req, res, next) => {
  try {
    const result = query(
      `SELECT id, nama, username, email, role, is_active, last_login, created_at FROM admin ORDER BY created_at DESC`,
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Data admin berhasil diambil",
        data: result.rows,
        total: result.rowCount,
      });
  } catch (error) {
    next(error);
  }
};

// ================================================================
const toggleActiveAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.admin.id) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Tidak dapat menonaktifkan akun sendiri",
        });
    }

    // Ambil status saat ini dulu
    const current = query(`SELECT is_active FROM admin WHERE id = ?`, [id]);
    if (current.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Admin tidak ditemukan" });
    }

    const newStatus = current.rows[0].is_active ? 0 : 1;

    query(
      `UPDATE admin SET is_active = ?, refresh_token = NULL, updated_at = datetime('now') WHERE id = ?`,
      [newStatus, id],
    );

    const updated = query(
      `SELECT id, nama, username, email, role, is_active FROM admin WHERE id = ?`,
      [id],
    );

    res.status(200).json({
      success: true,
      message: `Admin berhasil di${updated.rows[0].is_active ? "aktifkan" : "nonaktifkan"}`,
      data: updated.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// ================================================================
const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.admin.id) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Tidak dapat menghapus akun sendiri",
        });
    }

    const existing = query(
      `SELECT id, nama, username FROM admin WHERE id = ?`,
      [id],
    );
    if (existing.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Admin tidak ditemukan" });
    }

    const adminData = existing.rows[0];
    query(`DELETE FROM admin WHERE id = ?`, [id]);

    res
      .status(200)
      .json({
        success: true,
        message: `Admin ${adminData.nama} berhasil dihapus`,
      });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  refreshToken,
  getMe,
  changePassword,
  register,
  getAllAdmins,
  toggleActiveAdmin,
  deleteAdmin,
};
