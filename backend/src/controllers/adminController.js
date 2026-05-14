// backend/src/controllers/adminController.js
const { query } = require("../config/database");
const bcrypt = require("bcryptjs");

const getAllAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "", role = "" } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let conditions = [];
    let params = [];
    let paramIndex = 1;

    if (search) {
      conditions.push(
        `(nama ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR username ILIKE $${paramIndex})`,
      );
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (role) {
      conditions.push(`role = $${paramIndex}`);
      params.push(role);
      paramIndex++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await query(
      `SELECT COUNT(*) FROM public.admin ${whereClause}`,
      params,
    );
    const total = parseInt(countResult.rows[0].count);

    params.push(parseInt(limit), offset);
    const result = await query(
      `SELECT id, nama, username, email, role, is_active, last_login, created_at, updated_at
       FROM public.admin
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params,
    );

    res.status(200).json({
      success: true,
      message: "Data admin berhasil diambil",
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAdminById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT id, nama, username, email, role, is_active, last_login, created_at, updated_at
       FROM public.admin WHERE id = $1`,
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
      message: "Data admin berhasil diambil",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const createAdmin = async (req, res, next) => {
  try {
    const {
      nama,
      username,
      email,
      password,
      role = "admin",
      is_active = true,
    } = req.body;

    // Check email uniqueness
    const emailCheck = await query(
      "SELECT id FROM public.admin WHERE email = $1",
      [email],
    );
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    // Check username uniqueness
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

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await query(
      `INSERT INTO public.admin (nama, username, email, password, role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, nama, username, email, role, is_active, created_at`,
      [nama, username, email, hashedPassword, role, is_active],
    );

    res.status(201).json({
      success: true,
      message: "Admin berhasil dibuat",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const updateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nama, username, email, role, is_active } = req.body;

    const existCheck = await query(
      "SELECT id FROM public.admin WHERE id = $1",
      [id],
    );
    if (existCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin tidak ditemukan",
      });
    }

    if (email) {
      const emailCheck = await query(
        "SELECT id FROM public.admin WHERE email = $1 AND id != $2",
        [email, id],
      );
      if (emailCheck.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Email sudah digunakan",
        });
      }
    }

    if (username) {
      const usernameCheck = await query(
        "SELECT id FROM public.admin WHERE username = $1 AND id != $2",
        [username, id],
      );
      if (usernameCheck.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Username sudah digunakan",
        });
      }
    }

    const result = await query(
      `UPDATE public.admin
       SET nama       = COALESCE($1, nama),
           username   = COALESCE($2, username),
           email      = COALESCE($3, email),
           role       = COALESCE($4, role),
           is_active  = COALESCE($5, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING id, nama, username, email, role, is_active, created_at, updated_at`,
      [nama, username, email, role, is_active, id],
    );

    res.status(200).json({
      success: true,
      message: "Admin berhasil diperbarui",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent deleting own account
    if (req.user && req.user.id === parseInt(id)) {
      return res.status(403).json({
        success: false,
        message: "Tidak dapat menghapus akun sendiri",
      });
    }

    const result = await query(
      "DELETE FROM public.admin WHERE id = $1 RETURNING id",
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
      message: "Admin berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

const toggleActiveAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user && req.user.id === parseInt(id)) {
      return res.status(403).json({
        success: false,
        message: "Tidak dapat mengubah status akun sendiri",
      });
    }

    const result = await query(
      `UPDATE public.admin
       SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
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

const resetPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { new_password } = req.body;

    const existCheck = await query(
      "SELECT id FROM public.admin WHERE id = $1",
      [id],
    );
    if (existCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin tidak ditemukan",
      });
    }

    const hashedPassword = await bcrypt.hash(new_password, 12);

    await query(
      "UPDATE public.admin SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [hashedPassword, id],
    );

    res.status(200).json({
      success: true,
      message: "Password admin berhasil direset",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAdmin,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  toggleActiveAdmin,
  resetPassword,
};
