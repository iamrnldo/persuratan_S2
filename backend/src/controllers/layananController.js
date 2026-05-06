const { query } = require("../config/database");
const slugify = require("slugify");

const getAllLayanan = async (req, res, next) => {
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

    const countResult = await query(
      `SELECT COUNT(*) FROM public.layanan ${whereClause}`,
      params,
    );
    const total = parseInt(countResult.rows[0].count);

    params.push(parseInt(limit), offset);
    const result = await query(
      `SELECT * FROM public.layanan 
       ${whereClause} 
       ORDER BY urutan ASC, id ASC 
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params,
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
    const result = await query("SELECT * FROM public.layanan WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Layanan tidak ditemukan",
      });
    }
    res.status(200).json({
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
    const result = await query("SELECT * FROM public.layanan WHERE slug = $1", [
      slug,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Layanan tidak ditemukan",
      });
    }
    res.status(200).json({
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

    const slugCheck = await query(
      "SELECT id FROM public.layanan WHERE slug = $1",
      [generatedSlug],
    );
    if (slugCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Slug sudah digunakan",
      });
    }

    const result = await query(
      `INSERT INTO public.layanan 
       (nama, slug, deskripsi, icon, persyaratan, prosedur, is_active, urutan) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        nama,
        generatedSlug,
        deskripsi || null,
        icon || null,
        persyaratan || null,
        prosedur || null,
        is_active,
        urutan,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Layanan berhasil dibuat",
      data: result.rows[0],
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

    const existCheck = await query(
      "SELECT id FROM public.layanan WHERE id = $1",
      [id],
    );
    if (existCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Layanan tidak ditemukan",
      });
    }

    let newSlug = slug;
    if (nama && !slug) {
      newSlug = slugify(nama, { lower: true, strict: true, locale: "id" });
    }

    if (newSlug) {
      const slugCheck = await query(
        "SELECT id FROM public.layanan WHERE slug = $1 AND id != $2",
        [newSlug, id],
      );
      if (slugCheck.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Slug sudah digunakan",
        });
      }
    }

    const result = await query(
      `UPDATE public.layanan 
       SET nama = COALESCE($1, nama),
           slug = COALESCE($2, slug),
           deskripsi = COALESCE($3, deskripsi),
           icon = COALESCE($4, icon),
           persyaratan = COALESCE($5, persyaratan),
           prosedur = COALESCE($6, prosedur),
           is_active = COALESCE($7, is_active),
           urutan = COALESCE($8, urutan),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 
       RETURNING *`,
      [
        nama,
        newSlug,
        deskripsi,
        icon,
        persyaratan,
        prosedur,
        is_active,
        urutan,
        id,
      ],
    );

    res.status(200).json({
      success: true,
      message: "Layanan berhasil diupdate",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const deleteLayanan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      "DELETE FROM public.layanan WHERE id = $1 RETURNING id",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Layanan tidak ditemukan",
      });
    }
    res.status(200).json({
      success: true,
      message: "Layanan berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

const toggleActiveLayanan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      `UPDATE public.layanan 
       SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Layanan tidak ditemukan",
      });
    }
    res.status(200).json({
      success: true,
      message: `Layanan berhasil di${result.rows[0].is_active ? "aktifkan" : "nonaktifkan"}`,
      data: result.rows[0],
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
