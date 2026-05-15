// backend/src/controllers/adminController.js
const { query } = require("../config/database");
const bcrypt = require("bcryptjs");

const getAllAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "", role = "" } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let conditions = [];
    let params = [];

    if (search) {
      // SQLite tidak ada ILIKE, pakai LIKE + LOWER()
      conditions.push(
        `(LOWER(nama) LIKE LOWER(?) OR LOWER(email) LIKE LOWER(?) OR LOWER(username) LIKE LOWER(?))`,
      );
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (role) {
      conditions.push(`role = ?`);
      params.push(role);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = query(
      `SELECT COUNT(*) as count FROM admin ${whereClause}`,
      params,
    );
    const total = countResult.rows[0].count;

    const dataResult = query(
      `SELECT id, nama, username, email, role, is_active, last_login, created_at, updated_at
       FROM admin ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset],
    );

    res.status(200).json({
      success: true,
      message: "Data admin berhasil diambil",
      data: dataResult.rows,
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
    const result = query(
      `SELECT id, nama, username, email, role, is_active, last_login, created_at, updated_at FROM admin WHERE id = ?`,
      [id],
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Admin tidak ditemukan" });
    }
    res
      .status(200)
      .json({
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

    const emailCheck = query(`SELECT id FROM admin WHERE email = ?`, [email]);
    if (emailCheck.rows.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Email sudah terdaftar" });
    }

    const usernameCheck = query(`SELECT id FROM admin WHERE username = ?`, [
      username,
    ]);
    if (usernameCheck.rows.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Username sudah digunakan" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const insertResult = query(
      `INSERT INTO admin (nama, username, email, password, role, is_active) VALUES (?, ?, ?, ?, ?, ?)`,
      [nama, username, email, hashedPassword, role, is_active ? 1 : 0],
    );

    const newAdmin = query(
      `SELECT id, nama, username, email, role, is_active, created_at FROM admin WHERE rowid = ?`,
      [insertResult.rows[0]?.rowid],
    );

    // Fallback: ambil berdasarkan username
    const adminData =
      newAdmin.rows[0] ||
      query(
        `SELECT id, nama, username, email, role, is_active, created_at FROM admin WHERE username = ?`,
        [username],
      ).rows[0];

    res
      .status(201)
      .json({
        success: true,
        message: "Admin berhasil dibuat",
        data: adminData,
      });
  } catch (error) {
    next(error);
  }
};

const updateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nama, username, email, role, is_active } = req.body;

    const existCheck = query(`SELECT id FROM admin WHERE id = ?`, [id]);
    if (existCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Admin tidak ditemukan" });
    }

    if (email) {
      const emailCheck = query(
        `SELECT id FROM admin WHERE email = ? AND id != ?`,
        [email, id],
      );
      if (emailCheck.rows.length > 0) {
        return res
          .status(409)
          .json({ success: false, message: "Email sudah digunakan" });
      }
    }

    if (username) {
      const usernameCheck = query(
        `SELECT id FROM admin WHERE username = ? AND id != ?`,
        [username, id],
      );
      if (usernameCheck.rows.length > 0) {
        return res
          .status(409)
          .json({ success: false, message: "Username sudah digunakan" });
      }
    }

    // SQLite tidak ada COALESCE untuk update partial seperti PostgreSQL,
    // jadi kita ambil data lama dulu lalu merge
    const current = query(
      `SELECT nama, username, email, role, is_active FROM admin WHERE id = ?`,
      [id],
    ).rows[0];

    query(
      `UPDATE admin
       SET nama = ?, username = ?, email = ?, role = ?, is_active = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [
        nama ?? current.nama,
        username ?? current.username,
        email ?? current.email,
        role ?? current.role,
        is_active !== undefined
          ? is_active
            ? 1
            : 0
          : current.is_active
            ? 1
            : 0,
        id,
      ],
    );

    const updated = query(
      `SELECT id, nama, username, email, role, is_active, created_at, updated_at FROM admin WHERE id = ?`,
      [id],
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Admin berhasil diperbarui",
        data: updated.rows[0],
      });
  } catch (error) {
    next(error);
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user && req.user.id === parseInt(id)) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Tidak dapat menghapus akun sendiri",
        });
    }

    const existing = query(`SELECT id FROM admin WHERE id = ?`, [id]);
    if (existing.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Admin tidak ditemukan" });
    }

    query(`DELETE FROM admin WHERE id = ?`, [id]);
    res.status(200).json({ success: true, message: "Admin berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};

const toggleActiveAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user && req.user.id === parseInt(id)) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Tidak dapat mengubah status akun sendiri",
        });
    }

    const current = query(`SELECT is_active FROM admin WHERE id = ?`, [id]);
    if (current.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Admin tidak ditemukan" });
    }

    const newStatus = current.rows[0].is_active ? 0 : 1;
    query(
      `UPDATE admin SET is_active = ?, updated_at = datetime('now') WHERE id = ?`,
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

const resetPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { new_password } = req.body;

    const existCheck = query(`SELECT id FROM admin WHERE id = ?`, [id]);
    if (existCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Admin tidak ditemukan" });
    }

    const hashedPassword = await bcrypt.hash(new_password, 12);
    query(
      `UPDATE admin SET password = ?, updated_at = datetime('now') WHERE id = ?`,
      [hashedPassword, id],
    );

    res
      .status(200)
      .json({ success: true, message: "Password admin berhasil direset" });
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
