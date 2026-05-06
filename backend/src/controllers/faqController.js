const { query } = require("../config/database");

/**
 * @desc    Get semua FAQ
 * @route   GET /api/v1/faq
 * @access  Public
 */
const getAllFaq = async (req, res, next) => {
  try {
    const { is_active, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let conditions = [];
    let params = [];
    let paramIndex = 1;

    if (is_active !== undefined) {
      conditions.push(`is_active = $${paramIndex}`);
      params.push(is_active === "true");
      paramIndex++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Count total
    const countResult = await query(
      `SELECT COUNT(*) FROM public.faq ${whereClause}`,
      params,
    );
    const total = parseInt(countResult.rows[0].count);

    // Get data
    params.push(parseInt(limit), offset);
    const result = await query(
      `SELECT * FROM public.faq 
       ${whereClause} 
       ORDER BY urutan ASC, id ASC 
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params,
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

/**
 * @desc    Get FAQ by ID
 * @route   GET /api/v1/faq/:id
 * @access  Public
 */
const getFaqById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query("SELECT * FROM public.faq WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "FAQ tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Data FAQ berhasil diambil",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Buat FAQ baru
 * @route   POST /api/v1/faq
 * @access  Private
 */
const createFaq = async (req, res, next) => {
  try {
    const { pertanyaan, jawaban, urutan = 0, is_active = true } = req.body;

    const result = await query(
      `INSERT INTO public.faq (pertanyaan, jawaban, urutan, is_active) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [pertanyaan, jawaban, urutan, is_active],
    );

    res.status(201).json({
      success: true,
      message: "FAQ berhasil dibuat",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update FAQ
 * @route   PUT /api/v1/faq/:id
 * @access  Private
 */
const updateFaq = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { pertanyaan, jawaban, urutan, is_active } = req.body;

    // Cek apakah data ada
    const existCheck = await query("SELECT id FROM public.faq WHERE id = $1", [
      id,
    ]);
    if (existCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "FAQ tidak ditemukan",
      });
    }

    const result = await query(
      `UPDATE public.faq 
       SET pertanyaan = COALESCE($1, pertanyaan),
           jawaban = COALESCE($2, jawaban),
           urutan = COALESCE($3, urutan),
           is_active = COALESCE($4, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 
       RETURNING *`,
      [pertanyaan, jawaban, urutan, is_active, id],
    );

    res.status(200).json({
      success: true,
      message: "FAQ berhasil diupdate",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Hapus FAQ
 * @route   DELETE /api/v1/faq/:id
 * @access  Private
 */
const deleteFaq = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      "DELETE FROM public.faq WHERE id = $1 RETURNING id",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "FAQ tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "FAQ berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle status aktif FAQ
 * @route   PATCH /api/v1/faq/:id/toggle-active
 * @access  Private
 */
const toggleActiveFaq = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `UPDATE public.faq 
       SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 
       RETURNING *`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "FAQ tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: `FAQ berhasil di${result.rows[0].is_active ? "aktifkan" : "nonaktifkan"}`,
      data: result.rows[0],
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
