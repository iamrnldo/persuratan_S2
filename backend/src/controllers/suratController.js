const { query } = require("../config/database");
const path = require("path");
const fs = require("fs");

// =============================================
// GET ALL SURAT (dengan filter & pagination)
// =============================================
const getAllSurat = async (req, res, next) => {
  try {
    const {
      jenis,
      status,
      klasifikasi_id,
      search,
      tanggal_dari,
      tanggal_sampai,
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    let conditions = [];
    let params = [];
    let paramIndex = 1;

    if (jenis) {
      conditions.push(`s.jenis = $${paramIndex}`);
      params.push(jenis);
      paramIndex++;
    }
    if (status) {
      conditions.push(`s.status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }
    if (klasifikasi_id) {
      conditions.push(`s.klasifikasi_id = $${paramIndex}`);
      params.push(klasifikasi_id);
      paramIndex++;
    }
    if (search) {
      conditions.push(
        `(s.perihal ILIKE $${paramIndex} OR s.nomor_surat ILIKE $${paramIndex} OR s.pengirim_tujuan ILIKE $${paramIndex} OR s.nomor_agenda ILIKE $${paramIndex})`,
      );
      params.push(`%${search}%`);
      paramIndex++;
    }
    if (tanggal_dari) {
      conditions.push(`s.tanggal_dokumen >= $${paramIndex}`);
      params.push(tanggal_dari);
      paramIndex++;
    }
    if (tanggal_sampai) {
      conditions.push(`s.tanggal_dokumen <= $${paramIndex}`);
      params.push(tanggal_sampai);
      paramIndex++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await query(
      `SELECT COUNT(*) FROM public.surat s ${whereClause}`,
      params,
    );
    const total = parseInt(countResult.rows[0].count);

    params.push(parseInt(limit), offset);
    const result = await query(
      `SELECT 
        s.*,
        ks.kode AS klasifikasi_kode,
        ks.nama AS klasifikasi_nama,
        a.nama AS created_by_nama
       FROM public.surat s
       LEFT JOIN public.klasifikasi_surat ks ON s.klasifikasi_id = ks.id
       LEFT JOIN public.admin a ON s.created_by = a.id
       ${whereClause}
       ORDER BY s.tanggal_dokumen DESC, s.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params,
    );

    res.status(200).json({
      success: true,
      message: "Data surat berhasil diambil",
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

// =============================================
// GET SURAT BY ID (dengan disposisi)
// =============================================
const getSuratById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const suratResult = await query(
      `SELECT 
        s.*,
        ks.kode AS klasifikasi_kode,
        ks.nama AS klasifikasi_nama,
        a.nama AS created_by_nama
       FROM public.surat s
       LEFT JOIN public.klasifikasi_surat ks ON s.klasifikasi_id = ks.id
       LEFT JOIN public.admin a ON s.created_by = a.id
       WHERE s.id = $1`,
      [id],
    );

    if (suratResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Surat tidak ditemukan",
      });
    }

    const disposisiResult = await query(
      `SELECT * FROM public.disposisi 
       WHERE surat_id = $1 
       ORDER BY created_at ASC`,
      [id],
    );

    res.status(200).json({
      success: true,
      message: "Data surat berhasil diambil",
      data: {
        ...suratResult.rows[0],
        disposisi: disposisiResult.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =============================================
// CREATE SURAT
// =============================================
const createSurat = async (req, res, next) => {
  try {
    const {
      jenis,
      nomor_agenda,
      nomor_surat,
      tanggal_surat,
      tanggal_dokumen,
      pengirim_tujuan,
      perihal,
      klasifikasi_id,
      status = "baru",
      keterangan,
    } = req.body;

    const created_by = req.user?.id || null;

    // Handle file upload
    let file_path = null;
    let file_name = null;
    let file_size = null;

    if (req.file) {
      file_path = `/uploads/surat/${req.file.filename}`;
      file_name = req.file.originalname;
      file_size = req.file.size;
    }

    const result = await query(
      `INSERT INTO public.surat 
       (jenis, nomor_agenda, nomor_surat, tanggal_surat, tanggal_dokumen,
        pengirim_tujuan, perihal, klasifikasi_id, file_path, file_name,
        file_size, status, keterangan, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING *`,
      [
        jenis,
        nomor_agenda || null,
        nomor_surat || null,
        tanggal_surat || null,
        tanggal_dokumen || null,
        pengirim_tujuan || null,
        perihal,
        klasifikasi_id || null,
        file_path,
        file_name,
        file_size,
        status,
        keterangan || null,
        created_by,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Surat berhasil ditambahkan",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// =============================================
// UPDATE SURAT
// =============================================
const updateSurat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      jenis,
      nomor_agenda,
      nomor_surat,
      tanggal_surat,
      tanggal_dokumen,
      pengirim_tujuan,
      perihal,
      klasifikasi_id,
      status,
      keterangan,
    } = req.body;

    const existCheck = await query("SELECT * FROM public.surat WHERE id = $1", [
      id,
    ]);
    if (existCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Surat tidak ditemukan",
      });
    }

    // Handle file upload baru
    let file_path = existCheck.rows[0].file_path;
    let file_name = existCheck.rows[0].file_name;
    let file_size = existCheck.rows[0].file_size;

    if (req.file) {
      // Hapus file lama jika ada
      if (existCheck.rows[0].file_path) {
        const oldPath = path.join(
          __dirname,
          "../..",
          existCheck.rows[0].file_path,
        );
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      file_path = `/uploads/surat/${req.file.filename}`;
      file_name = req.file.originalname;
      file_size = req.file.size;
    }

    const result = await query(
      `UPDATE public.surat SET
        jenis = COALESCE($1, jenis),
        nomor_agenda = COALESCE($2, nomor_agenda),
        nomor_surat = COALESCE($3, nomor_surat),
        tanggal_surat = COALESCE($4, tanggal_surat),
        tanggal_dokumen = COALESCE($5, tanggal_dokumen),
        pengirim_tujuan = COALESCE($6, pengirim_tujuan),
        perihal = COALESCE($7, perihal),
        klasifikasi_id = COALESCE($8, klasifikasi_id),
        file_path = $9,
        file_name = $10,
        file_size = $11,
        status = COALESCE($12, status),
        keterangan = COALESCE($13, keterangan),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $14
       RETURNING *`,
      [
        jenis,
        nomor_agenda,
        nomor_surat,
        tanggal_surat,
        tanggal_dokumen,
        pengirim_tujuan,
        perihal,
        klasifikasi_id,
        file_path,
        file_name,
        file_size,
        status,
        keterangan,
        id,
      ],
    );

    res.status(200).json({
      success: true,
      message: "Surat berhasil diperbarui",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// =============================================
// DELETE SURAT
// =============================================
const deleteSurat = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existCheck = await query("SELECT * FROM public.surat WHERE id = $1", [
      id,
    ]);
    if (existCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Surat tidak ditemukan",
      });
    }

    // Hapus file jika ada
    if (existCheck.rows[0].file_path) {
      const filePath = path.resolve(existCheck.rows[0].file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await query("DELETE FROM public.surat WHERE id = $1", [id]);

    res.status(200).json({
      success: true,
      message: "Surat berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

// =============================================
// UPDATE STATUS SURAT
// =============================================
const updateStatusSurat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await query(
      `UPDATE public.surat 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 RETURNING *`,
      [status, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Surat tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status surat berhasil diperbarui",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// =============================================
// DISPOSISI
// =============================================
const createDisposisi = async (req, res, next) => {
  try {
    const { surat_id } = req.params;
    const { dari, kepada, instruksi, catatan, tanggal_disposisi, status } =
      req.body;

    // Cek surat ada
    const suratCheck = await query(
      "SELECT id FROM public.surat WHERE id = $1",
      [surat_id],
    );
    if (suratCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Surat tidak ditemukan",
      });
    }

    const result = await query(
      `INSERT INTO public.disposisi 
       (surat_id, dari, kepada, instruksi, catatan, tanggal_disposisi, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        surat_id,
        dari,
        kepada,
        instruksi,
        catatan || null,
        tanggal_disposisi || new Date().toISOString().split("T")[0],
        status || "belum_ditindaklanjuti",
      ],
    );

    // Update status surat jadi diproses otomatis
    await query(
      `UPDATE public.surat SET status = 'diproses', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [surat_id],
    );

    res.status(201).json({
      success: true,
      message: "Disposisi berhasil ditambahkan",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const updateDisposisi = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { dari, kepada, instruksi, catatan, tanggal_disposisi, status } =
      req.body;

    const result = await query(
      `UPDATE public.disposisi SET
        dari = COALESCE($1, dari),
        kepada = COALESCE($2, kepada),
        instruksi = COALESCE($3, instruksi),
        catatan = COALESCE($4, catatan),
        tanggal_disposisi = COALESCE($5, tanggal_disposisi),
        status = COALESCE($6, status),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [dari, kepada, instruksi, catatan, tanggal_disposisi, status, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Disposisi tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Disposisi berhasil diperbarui",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const deleteDisposisi = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      "DELETE FROM public.disposisi WHERE id = $1 RETURNING id",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Disposisi tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Disposisi berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

// =============================================
// STATISTIK
// =============================================
const getStatistikSurat = async (req, res, next) => {
  try {
    const result = await query(`
      SELECT
        COUNT(*) FILTER (WHERE jenis = 'masuk') AS total_masuk,
        COUNT(*) FILTER (WHERE jenis = 'keluar') AS total_keluar,
        COUNT(*) FILTER (WHERE status = 'baru') AS total_baru,
        COUNT(*) FILTER (WHERE status = 'diproses') AS total_diproses,
        COUNT(*) FILTER (WHERE status = 'selesai') AS total_selesai,
        COUNT(*) FILTER (WHERE status = 'diarsipkan') AS total_diarsipkan,
        COUNT(*) FILTER (WHERE tanggal_dokumen >= date_trunc('month', CURRENT_DATE)) AS total_bulan_ini
      FROM public.surat
    `);

    res.status(200).json({
      success: true,
      message: "Statistik surat berhasil diambil",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSurat,
  getSuratById,
  createSurat,
  updateSurat,
  deleteSurat,
  updateStatusSurat,
  createDisposisi,
  updateDisposisi,
  deleteDisposisi,
  getStatistikSurat,
};
