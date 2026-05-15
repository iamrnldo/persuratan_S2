// backend/src/controllers/suratController.js
const { query } = require("../config/database");
const path = require("path");
const fs = require("fs");

// =============================================
// GET ALL SURAT
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

    if (jenis) {
      conditions.push(`s.jenis = ?`);
      params.push(jenis);
    }
    if (status) {
      conditions.push(`s.status = ?`);
      params.push(status);
    }
    if (klasifikasi_id) {
      conditions.push(`s.klasifikasi_id = ?`);
      params.push(klasifikasi_id);
    }
    if (search) {
      // SQLite: LIKE + LOWER() sebagai pengganti ILIKE
      conditions.push(
        `(LOWER(s.perihal) LIKE LOWER(?) OR LOWER(s.nomor_surat) LIKE LOWER(?) OR LOWER(s.pengirim_tujuan) LIKE LOWER(?) OR LOWER(s.nomor_agenda) LIKE LOWER(?))`,
      );
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (tanggal_dari) {
      conditions.push(`s.tanggal_dokumen >= ?`);
      params.push(tanggal_dari);
    }
    if (tanggal_sampai) {
      conditions.push(`s.tanggal_dokumen <= ?`);
      params.push(tanggal_sampai);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = query(
      `SELECT COUNT(*) as count FROM surat s ${whereClause}`,
      params,
    );
    const total = countResult.rows[0].count;

    const result = query(
      `SELECT
        s.*,
        ks.kode AS klasifikasi_kode,
        ks.nama AS klasifikasi_nama,
        a.nama AS created_by_nama
       FROM surat s
       LEFT JOIN klasifikasi_surat ks ON s.klasifikasi_id = ks.id
       LEFT JOIN admin a ON s.created_by = a.id
       ${whereClause}
       ORDER BY s.tanggal_dokumen DESC, s.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset],
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

    const suratResult = query(
      `SELECT
        s.*,
        ks.kode AS klasifikasi_kode,
        ks.nama AS klasifikasi_nama,
        a.nama AS created_by_nama
       FROM surat s
       LEFT JOIN klasifikasi_surat ks ON s.klasifikasi_id = ks.id
       LEFT JOIN admin a ON s.created_by = a.id
       WHERE s.id = ?`,
      [id],
    );

    if (suratResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Surat tidak ditemukan" });
    }

    const disposisiResult = query(
      `SELECT * FROM disposisi WHERE surat_id = ? ORDER BY created_at ASC`,
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

    let file_path = null;
    let file_name = null;
    let file_size = null;

    if (req.file) {
      file_path = `/uploads/surat/${req.file.filename}`;
      file_name = req.file.originalname;
      file_size = req.file.size;
    }

    const insertResult = query(
      `INSERT INTO surat
       (jenis, nomor_agenda, nomor_surat, tanggal_surat, tanggal_dokumen,
        pengirim_tujuan, perihal, klasifikasi_id, file_path, file_name,
        file_size, status, keterangan, created_by)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
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

    // Ambil data lengkap surat yang baru dibuat
    const newSurat = query(
      `SELECT s.*, ks.kode AS klasifikasi_kode, ks.nama AS klasifikasi_nama
       FROM surat s
       LEFT JOIN klasifikasi_surat ks ON s.klasifikasi_id = ks.id
       WHERE s.id = (SELECT last_insert_rowid())`,
      [],
    );

    res.status(201).json({
      success: true,
      message: "Surat berhasil ditambahkan",
      data: newSurat.rows[0],
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

    const existCheck = query(`SELECT * FROM surat WHERE id = ?`, [id]);
    if (existCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Surat tidak ditemukan" });
    }

    const current = existCheck.rows[0];

    // Handle file baru — hapus file lama jika ada
    let file_path = current.file_path;
    let file_name = current.file_name;
    let file_size = current.file_size;

    if (req.file) {
      if (current.file_path) {
        const oldPath = path.join(__dirname, "../..", current.file_path);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      file_path = `/uploads/surat/${req.file.filename}`;
      file_name = req.file.originalname;
      file_size = req.file.size;
    }

    query(
      `UPDATE surat SET
        jenis            = ?,
        nomor_agenda     = ?,
        nomor_surat      = ?,
        tanggal_surat    = ?,
        tanggal_dokumen  = ?,
        pengirim_tujuan  = ?,
        perihal          = ?,
        klasifikasi_id   = ?,
        file_path        = ?,
        file_name        = ?,
        file_size        = ?,
        status           = ?,
        keterangan       = ?,
        updated_at       = datetime('now')
       WHERE id = ?`,
      [
        jenis ?? current.jenis,
        nomor_agenda ?? current.nomor_agenda,
        nomor_surat ?? current.nomor_surat,
        tanggal_surat ?? current.tanggal_surat,
        tanggal_dokumen ?? current.tanggal_dokumen,
        pengirim_tujuan ?? current.pengirim_tujuan,
        perihal ?? current.perihal,
        klasifikasi_id ?? current.klasifikasi_id,
        file_path,
        file_name,
        file_size,
        status ?? current.status,
        keterangan ?? current.keterangan,
        id,
      ],
    );

    const updated = query(
      `SELECT s.*, ks.kode AS klasifikasi_kode, ks.nama AS klasifikasi_nama
       FROM surat s
       LEFT JOIN klasifikasi_surat ks ON s.klasifikasi_id = ks.id
       WHERE s.id = ?`,
      [id],
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Surat berhasil diperbarui",
        data: updated.rows[0],
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

    const existCheck = query(`SELECT * FROM surat WHERE id = ?`, [id]);
    if (existCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Surat tidak ditemukan" });
    }

    if (existCheck.rows[0].file_path) {
      const filePath = path.join(
        __dirname,
        "../..",
        existCheck.rows[0].file_path,
      );
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    query(`DELETE FROM surat WHERE id = ?`, [id]);
    res.status(200).json({ success: true, message: "Surat berhasil dihapus" });
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

    const existCheck = query(`SELECT id FROM surat WHERE id = ?`, [id]);
    if (existCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Surat tidak ditemukan" });
    }

    query(
      `UPDATE surat SET status = ?, updated_at = datetime('now') WHERE id = ?`,
      [status, id],
    );

    const updated = query(`SELECT * FROM surat WHERE id = ?`, [id]);

    res
      .status(200)
      .json({
        success: true,
        message: "Status surat berhasil diperbarui",
        data: updated.rows[0],
      });
  } catch (error) {
    next(error);
  }
};

// =============================================
// DISPOSISI — CREATE
// =============================================
const createDisposisi = async (req, res, next) => {
  try {
    const { surat_id } = req.params;
    const { dari, kepada, instruksi, catatan, tanggal_disposisi, status } =
      req.body;

    const suratCheck = query(`SELECT id FROM surat WHERE id = ?`, [surat_id]);
    if (suratCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Surat tidak ditemukan" });
    }

    query(
      `INSERT INTO disposisi (surat_id, dari, kepada, instruksi, catatan, tanggal_disposisi, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
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

    const newDisposisi = query(
      `SELECT * FROM disposisi WHERE id = (SELECT last_insert_rowid())`,
      [],
    );

    // Update status surat jadi diproses
    query(
      `UPDATE surat SET status = 'diproses', updated_at = datetime('now') WHERE id = ?`,
      [surat_id],
    );

    res
      .status(201)
      .json({
        success: true,
        message: "Disposisi berhasil ditambahkan",
        data: newDisposisi.rows[0],
      });
  } catch (error) {
    next(error);
  }
};

// =============================================
// DISPOSISI — UPDATE
// =============================================
const updateDisposisi = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { dari, kepada, instruksi, catatan, tanggal_disposisi, status } =
      req.body;

    const existCheck = query(`SELECT * FROM disposisi WHERE id = ?`, [id]);
    if (existCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Disposisi tidak ditemukan" });
    }

    const current = existCheck.rows[0];

    query(
      `UPDATE disposisi SET
        dari              = ?,
        kepada            = ?,
        instruksi         = ?,
        catatan           = ?,
        tanggal_disposisi = ?,
        status            = ?,
        updated_at        = datetime('now')
       WHERE id = ?`,
      [
        dari ?? current.dari,
        kepada ?? current.kepada,
        instruksi ?? current.instruksi,
        catatan ?? current.catatan,
        tanggal_disposisi ?? current.tanggal_disposisi,
        status ?? current.status,
        id,
      ],
    );

    const updated = query(`SELECT * FROM disposisi WHERE id = ?`, [id]);

    res
      .status(200)
      .json({
        success: true,
        message: "Disposisi berhasil diperbarui",
        data: updated.rows[0],
      });
  } catch (error) {
    next(error);
  }
};

// =============================================
// DISPOSISI — DELETE
// =============================================
const deleteDisposisi = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existCheck = query(`SELECT id FROM disposisi WHERE id = ?`, [id]);
    if (existCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Disposisi tidak ditemukan" });
    }

    query(`DELETE FROM disposisi WHERE id = ?`, [id]);
    res
      .status(200)
      .json({ success: true, message: "Disposisi berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};

// =============================================
// STATISTIK
// =============================================
const getStatistikSurat = async (req, res, next) => {
  try {
    // SQLite tidak ada COUNT(*) FILTER atau date_trunc — pakai SUM(CASE WHEN) + strftime
    const result = query(
      `
      SELECT
        SUM(CASE WHEN jenis = 'masuk' THEN 1 ELSE 0 END)        AS total_masuk,
        SUM(CASE WHEN jenis = 'keluar' THEN 1 ELSE 0 END)       AS total_keluar,
        SUM(CASE WHEN status = 'baru' THEN 1 ELSE 0 END)        AS total_baru,
        SUM(CASE WHEN status = 'diproses' THEN 1 ELSE 0 END)    AS total_diproses,
        SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END)     AS total_selesai,
        SUM(CASE WHEN status = 'diarsipkan' THEN 1 ELSE 0 END)  AS total_diarsipkan,
        SUM(CASE WHEN strftime('%Y-%m', tanggal_dokumen) = strftime('%Y-%m', 'now') THEN 1 ELSE 0 END) AS total_bulan_ini
      FROM surat
    `,
      [],
    );

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
