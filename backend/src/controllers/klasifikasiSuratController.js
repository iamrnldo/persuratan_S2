const { query } = require("../config/database");

const getAllKlasifikasiSurat = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let conditions = [];
    let params = [];
    let paramIndex = 1;

    if (search) {
      conditions.push(
        `(kode ILIKE $${paramIndex} OR nama ILIKE $${paramIndex})`,
      );
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await query(
      `SELECT COUNT(*) FROM public.klasifikasi_surat ${whereClause}`,
      params,
    );
    const total = parseInt(countResult.rows[0].count);

    params.push(parseInt(limit), offset);
    const result = await query(
      `SELECT * FROM public.klasifikasi_surat 
       ${whereClause} 
       ORDER BY kode ASC 
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params,
    );

    res.status(200).json({
      success: true,
      message: "Data klasifikasi surat berhasil diambil",
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

const getKlasifikasiSuratById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      "SELECT * FROM public.klasifikasi_surat WHERE id = $1",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Klasifikasi surat tidak ditemukan",
      });
    }
    res.status(200).json({
      success: true,
      message: "Data klasifikasi surat berhasil diambil",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const createKlasifikasiSurat = async (req, res, next) => {
  try {
    const { kode, nama, keterangan } = req.body;

    // Cek kode unik
    const kodeCheck = await query(
      "SELECT id FROM public.klasifikasi_surat WHERE kode = $1",
      [kode],
    );
    if (kodeCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Kode klasifikasi sudah digunakan",
      });
    }

    const result = await query(
      `INSERT INTO public.klasifikasi_surat (kode, nama, keterangan) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [kode, nama, keterangan || null],
    );

    res.status(201).json({
      success: true,
      message: "Klasifikasi surat berhasil dibuat",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const updateKlasifikasiSurat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { kode, nama, keterangan } = req.body;

    const existCheck = await query(
      "SELECT id FROM public.klasifikasi_surat WHERE id = $1",
      [id],
    );
    if (existCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Klasifikasi surat tidak ditemukan",
      });
    }

    if (kode) {
      const kodeCheck = await query(
        "SELECT id FROM public.klasifikasi_surat WHERE kode = $1 AND id != $2",
        [kode, id],
      );
      if (kodeCheck.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Kode klasifikasi sudah digunakan",
        });
      }
    }

    const result = await query(
      `UPDATE public.klasifikasi_surat 
       SET kode = COALESCE($1, kode),
           nama = COALESCE($2, nama),
           keterangan = COALESCE($3, keterangan)
       WHERE id = $4 
       RETURNING *`,
      [kode, nama, keterangan, id],
    );

    res.status(200).json({
      success: true,
      message: "Klasifikasi surat berhasil diupdate",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const deleteKlasifikasiSurat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      "DELETE FROM public.klasifikasi_surat WHERE id = $1 RETURNING id",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Klasifikasi surat tidak ditemukan",
      });
    }
    res.status(200).json({
      success: true,
      message: "Klasifikasi surat berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllKlasifikasiSurat,
  getKlasifikasiSuratById,
  createKlasifikasiSurat,
  updateKlasifikasiSurat,
  deleteKlasifikasiSurat,
};
