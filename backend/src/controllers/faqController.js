// backend/src/controllers/faqController.js
const { query } = require("../config/database");

const getAllFaq = async (req, res, next) => {
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
      `SELECT COUNT(*) as count FROM faq ${whereClause}`,
      params,
    );
    const total = countResult.rows[0].count;

    const result = query(
      `SELECT * FROM faq ${whereClause}
       ORDER BY urutan ASC, id ASC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset],
    );

    res.status(200).json({
      success: true,
      message: "Data FAQ berhasil diambil",
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

const getFaqById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = query(`SELECT * FROM faq WHERE id = ?`, [id]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "FAQ tidak ditemukan" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Data FAQ berhasil diambil",
        data: result.rows[0],
      });
  } catch (error) {
    next(error);
  }
};

const createFaq = async (req, res, next) => {
  try {
    const { pertanyaan, jawaban, urutan = 0, is_active = true } = req.body;

    const insertResult = query(
      `INSERT INTO faq (pertanyaan, jawaban, urutan, is_active) VALUES (?, ?, ?, ?)`,
      [pertanyaan, jawaban, urutan, is_active ? 1 : 0],
    );

    // Ambil data yang baru diinsert via lastInsertRowid
    const newFaq = query(`SELECT * FROM faq WHERE rowid = ?`, [
      insertResult.rows[0]?.rowid,
    ]);
    // Fallback jika rowid tidak tersedia di rows
    const data =
      newFaq.rows[0] ||
      query(`SELECT * FROM faq WHERE pertanyaan = ? ORDER BY id DESC LIMIT 1`, [
        pertanyaan,
      ]).rows[0];

    res
      .status(201)
      .json({ success: true, message: "FAQ berhasil dibuat", data });
  } catch (error) {
    next(error);
  }
};

const updateFaq = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { pertanyaan, jawaban, urutan, is_active } = req.body;

    const existCheck = query(`SELECT * FROM faq WHERE id = ?`, [id]);
    if (existCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "FAQ tidak ditemukan" });
    }

    const current = existCheck.rows[0];

    query(
      `UPDATE faq SET
        pertanyaan = ?,
        jawaban = ?,
        urutan = ?,
        is_active = ?,
        updated_at = datetime('now')
       WHERE id = ?`,
      [
        pertanyaan ?? current.pertanyaan,
        jawaban ?? current.jawaban,
        urutan ?? current.urutan,
        is_active !== undefined ? (is_active ? 1 : 0) : current.is_active,
        id,
      ],
    );

    const updated = query(`SELECT * FROM faq WHERE id = ?`, [id]);

    res
      .status(200)
      .json({
        success: true,
        message: "FAQ berhasil diupdate",
        data: updated.rows[0],
      });
  } catch (error) {
    next(error);
  }
};

const deleteFaq = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existCheck = query(`SELECT id FROM faq WHERE id = ?`, [id]);
    if (existCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "FAQ tidak ditemukan" });
    }

    query(`DELETE FROM faq WHERE id = ?`, [id]);
    res.status(200).json({ success: true, message: "FAQ berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};

const toggleActiveFaq = async (req, res, next) => {
  try {
    const { id } = req.params;

    const current = query(`SELECT id, is_active FROM faq WHERE id = ?`, [id]);
    if (current.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "FAQ tidak ditemukan" });
    }

    const newStatus = current.rows[0].is_active ? 0 : 1;
    query(
      `UPDATE faq SET is_active = ?, updated_at = datetime('now') WHERE id = ?`,
      [newStatus, id],
    );

    const updated = query(`SELECT * FROM faq WHERE id = ?`, [id]);

    res.status(200).json({
      success: true,
      message: `FAQ berhasil di${updated.rows[0].is_active ? "aktifkan" : "nonaktifkan"}`,
      data: updated.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFaq,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
  toggleActiveFaq,
};
