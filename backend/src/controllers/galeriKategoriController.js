const { query } = require("../config/database");
const slugify = require("slugify");

/**
 * @desc    Get semua kategori galeri
 * @route   GET /api/v1/galeri-kategori
 * @access  Public
 */
const getAllGaleriKategori = async (req, res, next) => {
  try {
    const result = await query(
      "SELECT * FROM public.galeri_kategori ORDER BY id ASC",
    );

    res.status(200).json({
      success: true,
      message: "Data kategori galeri berhasil diambil",
      data: result.rows,
      total: result.rowCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get kategori galeri by ID
 * @route   GET /api/v1/galeri-kategori/:id
 * @access  Public
 */
const getGaleriKategoriById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      "SELECT * FROM public.galeri_kategori WHERE id = $1",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kategori galeri tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Data kategori galeri berhasil diambil",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Buat kategori galeri baru
 * @route   POST /api/v1/galeri-kategori
 * @access  Private
 */
const createGaleriKategori = async (req, res, next) => {
  try {
    const { nama, slug } = req.body;

    const generatedSlug =
      slug ||
      slugify(nama, {
        lower: true,
        strict: true,
        locale: "id",
      });

    // Cek slug unik
    const slugCheck = await query(
      "SELECT id FROM public.galeri_kategori WHERE slug = $1",
      [generatedSlug],
    );
    if (slugCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Slug sudah digunakan, gunakan slug lain",
      });
    }

    const result = await query(
      `INSERT INTO public.galeri_kategori (nama, slug) 
       VALUES ($1, $2) 
       RETURNING *`,
      [nama, generatedSlug],
    );

    res.status(201).json({
      success: true,
      message: "Kategori galeri berhasil dibuat",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update kategori galeri
 * @route   PUT /api/v1/galeri-kategori/:id
 * @access  Private
 */
const updateGaleriKategori = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nama, slug } = req.body;

    const existCheck = await query(
      "SELECT id FROM public.galeri_kategori WHERE id = $1",
      [id],
    );
    if (existCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kategori galeri tidak ditemukan",
      });
    }

    let newSlug = slug;
    if (nama && !slug) {
      newSlug = slugify(nama, { lower: true, strict: true, locale: "id" });
    }

    // Cek slug unik (kecuali untuk record ini sendiri)
    if (newSlug) {
      const slugCheck = await query(
        "SELECT id FROM public.galeri_kategori WHERE slug = $1 AND id != $2",
        [newSlug, id],
      );
      if (slugCheck.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Slug sudah digunakan, gunakan slug lain",
        });
      }
    }

    const result = await query(
      `UPDATE public.galeri_kategori 
       SET nama = COALESCE($1, nama),
           slug = COALESCE($2, slug)
       WHERE id = $3 
       RETURNING *`,
      [nama, newSlug, id],
    );

    res.status(200).json({
      success: true,
      message: "Kategori galeri berhasil diupdate",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Hapus kategori galeri
 * @route   DELETE /api/v1/galeri-kategori/:id
 * @access  Private
 */
const deleteGaleriKategori = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      "DELETE FROM public.galeri_kategori WHERE id = $1 RETURNING id",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kategori galeri tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Kategori galeri berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllGaleriKategori,
  getGaleriKategoriById,
  createGaleriKategori,
  updateGaleriKategori,
  deleteGaleriKategori,
};
