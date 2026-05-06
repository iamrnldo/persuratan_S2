const { query } = require("../config/database");

/**
 * @desc    Get profil desa (hanya 1 record)
 * @route   GET /api/v1/profil-desa
 * @access  Public
 */
const getProfilDesa = async (req, res, next) => {
  try {
    const result = await query(
      "SELECT * FROM public.profil_desa ORDER BY id ASC LIMIT 1",
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Profil desa belum dikonfigurasi",
      });
    }

    res.status(200).json({
      success: true,
      message: "Data profil desa berhasil diambil",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Buat atau update profil desa (upsert)
 * @route   POST /api/v1/profil-desa
 * @access  Private
 */
const upsertProfilDesa = async (req, res, next) => {
  try {
    const {
      nama_desa,
      kecamatan,
      kabupaten,
      provinsi,
      kode_pos,
      alamat,
      no_telp,
      email,
      website,
      luas_wilayah,
      jumlah_penduduk,
      jumlah_kk,
      jumlah_dusun,
      jumlah_rw,
      sejarah,
      visi,
      misi,
      foto_kantor,
      maps_embed,
      maps_link,
      facebook,
      instagram,
      youtube,
      whatsapp,
      jam_layanan,
      jam_istirahat,
    } = req.body;

    // Cek apakah sudah ada data
    const existing = await query("SELECT id FROM public.profil_desa LIMIT 1");

    let result;
    if (existing.rows.length > 0) {
      // Update existing
      const existingId = existing.rows[0].id;
      result = await query(
        `UPDATE public.profil_desa SET
          nama_desa = COALESCE($1, nama_desa),
          kecamatan = COALESCE($2, kecamatan),
          kabupaten = COALESCE($3, kabupaten),
          provinsi = COALESCE($4, provinsi),
          kode_pos = COALESCE($5, kode_pos),
          alamat = COALESCE($6, alamat),
          no_telp = COALESCE($7, no_telp),
          email = COALESCE($8, email),
          website = COALESCE($9, website),
          luas_wilayah = COALESCE($10, luas_wilayah),
          jumlah_penduduk = COALESCE($11, jumlah_penduduk),
          jumlah_kk = COALESCE($12, jumlah_kk),
          jumlah_dusun = COALESCE($13, jumlah_dusun),
          jumlah_rw = COALESCE($14, jumlah_rw),
          sejarah = COALESCE($15, sejarah),
          visi = COALESCE($16, visi),
          misi = COALESCE($17, misi),
          foto_kantor = COALESCE($18, foto_kantor),
          maps_embed = COALESCE($19, maps_embed),
          maps_link = COALESCE($20, maps_link),
          facebook = COALESCE($21, facebook),
          instagram = COALESCE($22, instagram),
          youtube = COALESCE($23, youtube),
          whatsapp = COALESCE($24, whatsapp),
          jam_layanan = COALESCE($25, jam_layanan),
          jam_istirahat = COALESCE($26, jam_istirahat),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $27
        RETURNING *`,
        [
          nama_desa,
          kecamatan,
          kabupaten,
          provinsi,
          kode_pos,
          alamat,
          no_telp,
          email,
          website,
          luas_wilayah,
          jumlah_penduduk,
          jumlah_kk,
          jumlah_dusun,
          jumlah_rw,
          sejarah,
          visi,
          misi,
          foto_kantor,
          maps_embed,
          maps_link,
          facebook,
          instagram,
          youtube,
          whatsapp,
          jam_layanan,
          jam_istirahat,
          existingId,
        ],
      );

      return res.status(200).json({
        success: true,
        message: "Profil desa berhasil diupdate",
        data: result.rows[0],
      });
    } else {
      // Insert baru
      result = await query(
        `INSERT INTO public.profil_desa 
         (nama_desa, kecamatan, kabupaten, provinsi, kode_pos, alamat,
          no_telp, email, website, luas_wilayah, jumlah_penduduk,
          jumlah_kk, jumlah_dusun, jumlah_rw, sejarah, visi, misi,
          foto_kantor, maps_embed, maps_link, facebook, instagram,
          youtube, whatsapp, jam_layanan, jam_istirahat)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,
                 $15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)
         RETURNING *`,
        [
          nama_desa,
          kecamatan,
          kabupaten,
          provinsi,
          kode_pos,
          alamat,
          no_telp,
          email,
          website,
          luas_wilayah,
          jumlah_penduduk,
          jumlah_kk,
          jumlah_dusun,
          jumlah_rw,
          sejarah,
          visi,
          misi,
          foto_kantor,
          maps_embed,
          maps_link,
          facebook,
          instagram,
          youtube,
          whatsapp,
          jam_layanan,
          jam_istirahat,
        ],
      );

      return res.status(201).json({
        success: true,
        message: "Profil desa berhasil dibuat",
        data: result.rows[0],
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update profil desa by ID
 * @route   PUT /api/v1/profil-desa/:id
 * @access  Private
 */
const updateProfilDesa = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = req.body;

    const existCheck = await query(
      "SELECT id FROM public.profil_desa WHERE id = $1",
      [id],
    );
    if (existCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Profil desa tidak ditemukan",
      });
    }

    // Dynamic update
    const keys = Object.keys(fields);
    if (keys.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada data yang diupdate",
      });
    }

    const setClause = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");
    const values = Object.values(fields);
    values.push(id);

    const result = await query(
      `UPDATE public.profil_desa 
       SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${values.length} 
       RETURNING *`,
      values,
    );

    res.status(200).json({
      success: true,
      message: "Profil desa berhasil diupdate",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfilDesa,
  upsertProfilDesa,
  updateProfilDesa,
};
