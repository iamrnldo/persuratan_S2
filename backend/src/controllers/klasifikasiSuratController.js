// backend/src/controllers/klasifikasiSuratController.js
const { query } = require("../config/database");

const getAllKlasifikasiSurat = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let conditions = [];
    let params = [];

    if (search) {
      conditions.push(
        `(LOWER(kode) LIKE LOWER(?) OR LOWER(nama) LIKE LOWER(?))`,
      );
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = query(
      `SELECT COUNT(*) as count FROM klasifikasi_surat ${whereClause}`,
      params,
    );
    const total = countResult.rows[0].count;

    const result = query(
      `SELECT * FROM klasifikasi_surat ${whereClause}
       ORDER BY kode ASC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset],
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
    const result = query(`SELECT * FROM klasifikasi_surat WHERE id = ?`, [id]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Klasifikasi surat tidak ditemukan" });
    }

    res
      .status(200)
      .json({
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

    const kodeCheck = query(`SELECT id FROM klasifikasi_surat WHERE kode = ?`, [
      kode,
    ]);
    if (kodeCheck.rows.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Kode klasifikasi sudah digunakan" });
    }

    query(
      `INSERT INTO klasifikasi_surat (kode, nama, keterangan) VALUES (?, ?, ?)`,
      [kode, nama, keterangan || null],
    );

    const newData = query(
      `SELECT * FROM klasifikasi_surat WHERE id = (SELECT last_insert_rowid())`,
      [],
    );

    res
      .status(201)
      .json({
        success: true,
        message: "Klasifikasi surat berhasil dibuat",
        data: newData.rows[0],
      });
  } catch (error) {
    next(error);
  }
};

const updateKlasifikasiSurat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { kode, nama, keterangan } = req.body;

    const existCheck = query(`SELECT * FROM klasifikasi_surat WHERE id = ?`, [
      id,
    ]);
    if (existCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Klasifikasi surat tidak ditemukan" });
    }

    if (kode) {
      const kodeCheck = query(
        `SELECT id FROM klasifikasi_surat WHERE kode = ? AND id != ?`,
        [kode, id],
      );
      if (kodeCheck.rows.length > 0) {
        return res
          .status(409)
          .json({
            success: false,
            message: "Kode klasifikasi sudah digunakan",
          });
      }
    }

    const current = existCheck.rows[0];

    query(
      `UPDATE klasifikasi_surat
       SET kode = ?, nama = ?, keterangan = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [
        kode ?? current.kode,
        nama ?? current.nama,
        keterangan ?? current.keterangan,
        id,
      ],
    );

    const updated = query(`SELECT * FROM klasifikasi_surat WHERE id = ?`, [id]);

    res
      .status(200)
      .json({
        success: true,
        message: "Klasifikasi surat berhasil diupdate",
        data: updated.rows[0],
      });
  } catch (error) {
    next(error);
  }
};

const deleteKlasifikasiSurat = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existCheck = query(`SELECT id FROM klasifikasi_surat WHERE id = ?`, [
      id,
    ]);
    if (existCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Klasifikasi surat tidak ditemukan" });
    }

    query(`DELETE FROM klasifikasi_surat WHERE id = ?`, [id]);
    res
      .status(200)
      .json({ success: true, message: "Klasifikasi surat berhasil dihapus" });
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
