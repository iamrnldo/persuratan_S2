const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../config/database");
require("dotenv").config();

/**
 * Generate Access Token (short-lived)
 */
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

/**
 * Generate Refresh Token (long-lived)
 */
const generateRefreshToken = (admin) => {
  return jwt.sign({ id: admin.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
};

// ================================================================
/**
 * @desc    Login admin
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Cari admin berdasarkan username atau email
    const result = await query(
      `SELECT * FROM public.admin 
       WHERE (username = $1 OR email = $1) AND is_active = true`,
      [username],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Username/email atau password salah",
      });
    }

    const admin = result.rows[0];

    // Cek password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Username/email atau password salah",
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);

    // Simpan refresh token ke database
    await query(
      `UPDATE public.admin 
       SET refresh_token = $1, last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
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
/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public (butuh refresh token)
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token tidak ditemukan",
      });
    }

    // Verifikasi refresh token
    let decoded;
    try {
      decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Refresh token tidak valid atau sudah kadaluarsa",
      });
    }

    // Cek refresh token di database
    const result = await query(
      `SELECT * FROM public.admin 
       WHERE id = $1 AND refresh_token = $2 AND is_active = true`,
      [decoded.id, refresh_token],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Refresh token tidak valid",
      });
    }

    const admin = result.rows[0];

    // Generate access token baru
    const newAccessToken = generateAccessToken(admin);
    const newRefreshToken = generateRefreshToken(admin);

    // Update refresh token di database
    await query("UPDATE public.admin SET refresh_token = $1 WHERE id = $2", [
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
/**
 * @desc    Logout
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    // Hapus refresh token dari database
    await query("UPDATE public.admin SET refresh_token = NULL WHERE id = $1", [
      req.admin.id,
    ]);

    res.status(200).json({
      success: true,
      message: "Logout berhasil",
    });
  } catch (error) {
    next(error);
  }
};

// ================================================================
/**
 * @desc    Get profil admin yang sedang login
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, nama, username, email, role, is_active, last_login, created_at 
       FROM public.admin WHERE id = $1`,
      [req.admin.id],
    );

    res.status(200).json({
      success: true,
      message: "Data profil berhasil diambil",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// ================================================================
/**
 * @desc    Ganti password
 * @route   PUT /api/v1/auth/change-password
 * @access  Private
 */
const changePassword = async (req, res, next) => {
  try {
    const { password_lama, password_baru } = req.body;

    // Ambil password dari database
    const result = await query(
      "SELECT password FROM public.admin WHERE id = $1",
      [req.admin.id],
    );

    const admin = result.rows[0];

    // Verifikasi password lama
    const isMatch = await bcrypt.compare(password_lama, admin.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Password lama tidak sesuai",
      });
    }

    // Hash password baru
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password_baru, salt);

    // Update password & hapus refresh token (force login ulang)
    await query(
      `UPDATE public.admin 
       SET password = $1, refresh_token = NULL, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [hashedPassword, req.admin.id],
    );

    res.status(200).json({
      success: true,
      message: "Password berhasil diubah. Silakan login kembali",
    });
  } catch (error) {
    next(error);
  }
};

// ================================================================
/**
 * @desc    Register admin baru (hanya superadmin)
 * @route   POST /api/v1/auth/register
 * @access  Private - Superadmin only
 */
const register = async (req, res, next) => {
  try {
    const { nama, username, email, password, role = "admin" } = req.body;

    // Cek username sudah ada
    const usernameCheck = await query(
      "SELECT id FROM public.admin WHERE username = $1",
      [username],
    );
    if (usernameCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Username sudah digunakan",
      });
    }

    // Cek email sudah ada
    const emailCheck = await query(
      "SELECT id FROM public.admin WHERE email = $1",
      [email],
    );
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email sudah digunakan",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await query(
      `INSERT INTO public.admin (nama, username, email, password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nama, username, email, role, is_active, created_at`,
      [nama, username, email, hashedPassword, role],
    );

    res.status(201).json({
      success: true,
      message: "Admin baru berhasil dibuat",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// ================================================================
/**
 * @desc    Get semua admin (hanya superadmin)
 * @route   GET /api/v1/auth/admins
 * @access  Private - Superadmin only
 */
const getAllAdmins = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, nama, username, email, role, is_active, last_login, created_at
       FROM public.admin
       ORDER BY created_at DESC`,
    );

    res.status(200).json({
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
/**
 * @desc    Toggle aktif/nonaktif admin (hanya superadmin)
 * @route   PATCH /api/v1/auth/admins/:id/toggle-active
 * @access  Private - Superadmin only
 */
const toggleActiveAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Cegah superadmin menonaktifkan dirinya sendiri
    if (parseInt(id) === req.admin.id) {
      return res.status(400).json({
        success: false,
        message: "Tidak dapat menonaktifkan akun sendiri",
      });
    }

    const result = await query(
      `UPDATE public.admin
       SET is_active = NOT is_active, 
           refresh_token = NULL,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, nama, username, email, role, is_active`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: `Admin berhasil di${result.rows[0].is_active ? "aktifkan" : "nonaktifkan"}`,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// ================================================================
/**
 * @desc    Hapus admin (hanya superadmin)
 * @route   DELETE /api/v1/auth/admins/:id
 * @access  Private - Superadmin only
 */
const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Cegah superadmin hapus dirinya sendiri
    if (parseInt(id) === req.admin.id) {
      return res.status(400).json({
        success: false,
        message: "Tidak dapat menghapus akun sendiri",
      });
    }

    const result = await query(
      "DELETE FROM public.admin WHERE id = $1 RETURNING id, nama, username",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: `Admin ${result.rows[0].nama} berhasil dihapus`,
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
