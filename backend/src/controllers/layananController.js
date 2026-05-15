// backend/src/controllers/layananController.js
const { query } = require("../config/database");
const slugify = require("slugify");

const getAllLayanan = async (req, res, next) => {
  try {
    const { is_active, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let conditions = [];
    let params = [];

    if (is_active !== undefined) {
      conditions.push(`is_active = ?`);
      params.push(is_active === "true" ? 1 : 0);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = query(
      `SELECT COUNT(*) as count FROM layanan ${whereClause}`,
      params,
    );
    const total = countResult.rows[0].count;

    const result = query(
      `SELECT * FROM layanan ${whereClause}
       ORDER BY urutan ASC, id ASC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset],
    );

    res.status(200).json({
      success: true,
      message: "Data layanan berhasil diambil",
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

const getLayananById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = query(`SELECT * FROM layanan WHERE id = ?`, [id]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Layanan tidak ditemukan" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Data layanan berhasil diambil",
        data: result.rows[0],
      });
  } catch (error) {
    next(error);
  }
};

const getLayananBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const result = query(`SELECT * FROM layanan WHERE slug = ?`, [slug]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Layanan tidak ditemukan" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Data layanan berhasil diambil",
        data: result.rows[0],
      });
  } catch (error) {
    next(error);
  }
};

const createLayanan = async (req, res, next) => {
  try {
    const {
      nama,
      slug,
      deskripsi,
      icon,
      persyaratan,
      prosedur,
      is_active = true,
      urutan = 0,
    } = req.body;

    const generatedSlug =
      slug || slugify(nama, { lower: true, strict: true, locale: "id" });

    const slugCheck = query(`SELECT id FROM layanan WHERE slug = ?`, [
      generatedSlug,
    ]);
    if (slugCheck.rows.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Slug sudah digunakan" });
    }

    query(
      `INSERT INTO layanan (nama, slug, deskripsi, icon, persyaratan, prosedur, is_active, urutan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nama,
        generatedSlug,
        deskripsi || null,
        icon || null,
        persyaratan || null,
        prosedur || null,
        is_active ? 1 : 0,
        urutan,
      ],
    );

    const newData = query(
      `SELECT * FROM layanan WHERE id = (SELECT last_insert_rowid())`,
      [],
    );

    res
      .status(201)
      .json({
        success: true,
        message: "Layanan berhasil dibuat",
        data: newData.rows[0],
      });
  } catch (error) {
    next(error);
  }
};

const updateLayanan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      nama,
      slug,
      deskripsi,
      icon,
      persyaratan,
      prosedur,
      is_active,
      urutan,
    } = req.body;

    const existCheck = query(`SELECT * FROM layanan WHERE id = ?`, [id]);
    if (existCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Layanan tidak ditemukan" });
    }

    const current = existCheck.rows[0];

    let newSlug = slug;
    if (nama && !slug) {
      newSlug = slugify(nama, { lower: true, strict: true, locale: "id" });
    }

    if (newSlug) {
      const slugCheck = query(
        `SELECT id FROM layanan WHERE slug = ? AND id != ?`,
        [newSlug, id],
      );
      if (slugCheck.rows.length > 0) {
        return res
          .status(409)
          .json({ success: false, message: "Slug sudah digunakan" });
      }
    }

    // Resolve is_active ke integer
    let isActiveVal = current.is_active;
    if (is_active !== undefined) {
      isActiveVal = is_active ? 1 : 0;
    }

    query(
      `UPDATE layanan SET
        nama        = ?,
        slug        = ?,
        deskripsi   = ?,
        icon        = ?,
        persyaratan = ?,
        prosedur    = ?,
        is_active   = ?,
        urutan      = ?,
        updated_at  = datetime('now')
       WHERE id = ?`,
      [
        nama ?? current.nama,
        newSlug ?? current.slug,
        deskripsi ?? current.deskripsi,
        icon ?? current.icon,
        persyaratan ?? current.persyaratan,
        prosedur ?? current.prosedur,
        isActiveVal,
        urutan ?? current.urutan,
        id,
      ],
    );

    const updated = query(`SELECT * FROM layanan WHERE id = ?`, [id]);

    res
      .status(200)
      .json({
        success: true,
        message: "Layanan berhasil diupdate",
        data: updated.rows[0],
      });
  } catch (error) {
    next(error);
  }
};

const deleteLayanan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existCheck = query(`SELECT id FROM layanan WHERE id = ?`, [id]);
    if (existCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Layanan tidak ditemukan" });
    }

    query(`DELETE FROM layanan WHERE id = ?`, [id]);
    res
      .status(200)
      .json({ success: true, message: "Layanan berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};

const toggleActiveLayanan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const current = query(`SELECT id, is_active FROM layanan WHERE id = ?`, [
      id,
    ]);
    if (current.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Layanan tidak ditemukan" });
    }

    const newStatus = current.rows[0].is_active ? 0 : 1;
    query(
      `UPDATE layanan SET is_active = ?, updated_at = datetime('now') WHERE id = ?`,
      [newStatus, id],
    );

    const updated = query(`SELECT * FROM layanan WHERE id = ?`, [id]);

    res.status(200).json({
      success: true,
      message: `Layanan berhasil di${updated.rows[0].is_active ? "aktifkan" : "nonaktifkan"}`,
      data: updated.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLayanan,
  getLayananById,
  getLayananBySlug,
  createLayanan,
  updateLayanan,
  deleteLayanan,
  toggleActiveLayanan,
};
