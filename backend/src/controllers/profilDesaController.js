// backend/src/controllers/profilDesaController.js
const { query } = require("../config/database");

const getProfilDesa = async (req, res, next) => {
  try {
    const result = query(
      `SELECT * FROM profil_desa ORDER BY id ASC LIMIT 1`,
      [],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Profil desa belum dikonfigurasi" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Data profil desa berhasil diambil",
        data: result.rows[0],
      });
  } catch (error) {
    next(error);
  }
};

const PROFIL_FIELDS = [
  "nama_desa",
  "kecamatan",
  "kabupaten",
  "provinsi",
  "kode_pos",
  "alamat",
  "no_telp",
  "email",
  "website",
  "luas_wilayah",
  "jumlah_penduduk",
  "jumlah_kk",
  "jumlah_dusun",
  "jumlah_rw",
  "sejarah",
  "visi",
  "misi",
  "foto_kantor",
  "maps_embed",
  "maps_link",
  "facebook",
  "instagram",
  "youtube",
  "whatsapp",
  "jam_layanan",
  "jam_istirahat",
];

const upsertProfilDesa = async (req, res, next) => {
  try {
    const body = req.body;
    const values = PROFIL_FIELDS.map((f) => body[f] ?? null);

    const existing = query(`SELECT id FROM profil_desa LIMIT 1`, []);

    if (existing.rows.length > 0) {
      // Update — ambil data lama dulu untuk merge
      const current = query(`SELECT * FROM profil_desa WHERE id = ?`, [
        existing.rows[0].id,
      ]);
      const currentData = current.rows[0];

      const mergedValues = PROFIL_FIELDS.map(
        (f) => body[f] ?? currentData[f] ?? null,
      );

      query(
        `UPDATE profil_desa SET
          nama_desa = ?, kecamatan = ?, kabupaten = ?, provinsi = ?, kode_pos = ?,
          alamat = ?, no_telp = ?, email = ?, website = ?, luas_wilayah = ?,
          jumlah_penduduk = ?, jumlah_kk = ?, jumlah_dusun = ?, jumlah_rw = ?,
          sejarah = ?, visi = ?, misi = ?, foto_kantor = ?, maps_embed = ?,
          maps_link = ?, facebook = ?, instagram = ?, youtube = ?, whatsapp = ?,
          jam_layanan = ?, jam_istirahat = ?, updated_at = datetime('now')
         WHERE id = ?`,
        [...mergedValues, existing.rows[0].id],
      );

      const updated = query(`SELECT * FROM profil_desa WHERE id = ?`, [
        existing.rows[0].id,
      ]);

      return res
        .status(200)
        .json({
          success: true,
          message: "Profil desa berhasil diupdate",
          data: updated.rows[0],
        });
    } else {
      // Insert baru
      query(
        `INSERT INTO profil_desa
          (nama_desa, kecamatan, kabupaten, provinsi, kode_pos, alamat,
           no_telp, email, website, luas_wilayah, jumlah_penduduk,
           jumlah_kk, jumlah_dusun, jumlah_rw, sejarah, visi, misi,
           foto_kantor, maps_embed, maps_link, facebook, instagram,
           youtube, whatsapp, jam_layanan, jam_istirahat)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        values,
      );

      const newData = query(
        `SELECT * FROM profil_desa WHERE id = (SELECT last_insert_rowid())`,
        [],
      );

      return res
        .status(201)
        .json({
          success: true,
          message: "Profil desa berhasil dibuat",
          data: newData.rows[0],
        });
    }
  } catch (error) {
    next(error);
  }
};

const updateProfilDesa = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = req.body;

    const existCheck = query(`SELECT * FROM profil_desa WHERE id = ?`, [id]);
    if (existCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Profil desa tidak ditemukan" });
    }

    const keys = Object.keys(fields);
    if (keys.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Tidak ada data yang diupdate" });
    }

    // Dynamic update — SQLite pakai ? bukan $N, tapi posisi tetap aman
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const values = [...Object.values(fields), id];

    query(
      `UPDATE profil_desa SET ${setClause}, updated_at = datetime('now') WHERE id = ?`,
      values,
    );

    const updated = query(`SELECT * FROM profil_desa WHERE id = ?`, [id]);

    res
      .status(200)
      .json({
        success: true,
        message: "Profil desa berhasil diupdate",
        data: updated.rows[0],
      });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfilDesa, upsertProfilDesa, updateProfilDesa };
