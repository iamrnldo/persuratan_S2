const { query } = require("../config/database");
const slugify = require("slugify");

const getAllKategoriPengumuman = async (req, res, next) => {
  try {
    const result = await query(
      "SELECT * FROM public.kategori_pengumuman ORDER BY id ASC",
    );
    res.status(200).json({
      success: true,
      message: "Data kategori pengumuman berhasil diambil",
      data: result.rows,
      total: result.rowCount,
    });
  } catch (error) {
    next(error);
  }
};

const getKategoriPengumumanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      "SELECT * FROM public.kategori_pengumuman WHERE id = $1",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kategori pengumuman tidak ditemukan",
      });
    }
    res.status(200).json({
      success: true,
      message: "Data kategori pengumuman berhasil diambil",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const createKategoriPengumuman = async (req, res, next) => {
  try {
    const { nama, slug, icon } = req.body;

    const generatedSlug =
      slug || slugify(nama, { lower: true, strict: true, locale: "id" });

    // Cek slug unik
    const slugCheck = await query(
      "SELECT id FROM public.kategori_pengumuman WHERE slug = $1",
      [generatedSlug],
    );
    if (slugCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Slug sudah digunakan",
      });
    }

    const result = await query(
      `INSERT INTO public.kategori_pengumuman (nama, slug, icon) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [nama, generatedSlug, icon || null],
    );

    res.status(201).json({
      success: true,
      message: "Kategori pengumuman berhasil dibuat",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const updateKategoriPengumuman = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nama, slug, icon } = req.body;

    const existCheck = await query(
      "SELECT id FROM public.kategori_pengumuman WHERE id = $1",
      [id],
    );
    if (existCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kategori pengumuman tidak ditemukan",
      });
    }

    let newSlug = slug;
    if (nama && !slug) {
      newSlug = slugify(nama, { lower: true, strict: true, locale: "id" });
    }

    if (newSlug) {
      const slugCheck = await query(
        "SELECT id FROM public.kategori_pengumuman WHERE slug = $1 AND id != $2",
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
      `UPDATE public.kategori_pengumuman 
       SET nama = COALESCE($1, nama),
           slug = COALESCE($2, slug),
           icon = COALESCE($3, icon)
       WHERE id = $4 
       RETURNING *`,
      [nama, newSlug, icon, id],
    );

    res.status(200).json({
      success: true,
      message: "Kategori pengumuman berhasil diupdate",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const deleteKategoriPengumuman = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      "DELETE FROM public.kategori_pengumuman WHERE id = $1 RETURNING id",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kategori pengumuman tidak ditemukan",
      });
    }
    res.status(200).json({
      success: true,
      message: "Kategori pengumuman berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllKategoriPengumuman,
  getKategoriPengumumanById,
  createKategoriPengumuman,
  updateKategoriPengumuman,
  deleteKategoriPengumuman,
};
