const { query, withTransaction } = require("../config/database");
const path = require("path");
const fs = require("fs");

const getAllStruktur = async (req, res, next) => {
  try {
    const { is_active, tree } = req.query;

    let conditions = [];
    let params = [];
    let paramIndex = 1;

    if (is_active !== undefined) {
      conditions.push(`so.is_active = $${paramIndex}`);
      params.push(is_active === "true");
      paramIndex++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await query(
      `SELECT so.*, 
              parent.nama AS parent_nama, 
              parent.jabatan AS parent_jabatan
       FROM public.struktur_organisasi so
       LEFT JOIN public.struktur_organisasi parent ON so.parent_id = parent.id
       ${whereClause}
       ORDER BY so.level ASC, so.urutan ASC`,
      params,
    );

    if (tree === "true") {
      const treeData = buildTree(result.rows);
      return res.status(200).json({
        success: true,
        message: "Data struktur organisasi berhasil diambil",
        data: treeData,
      });
    }

    res.status(200).json({
      success: true,
      message: "Data struktur organisasi berhasil diambil",
      data: result.rows,
      total: result.rowCount,
    });
  } catch (error) {
    next(error);
  }
};

const buildTree = (items, parentId = null) => {
  return items
    .filter((item) => item.parent_id === parentId)
    .map((item) => ({
      ...item,
      children: buildTree(items, item.id),
    }));
};

const getStrukturById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT so.*, 
              parent.nama AS parent_nama,
              parent.jabatan AS parent_jabatan
       FROM public.struktur_organisasi so
       LEFT JOIN public.struktur_organisasi parent ON so.parent_id = parent.id
       WHERE so.id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data struktur organisasi tidak ditemukan",
      });
    }

    const children = await query(
      "SELECT * FROM public.struktur_organisasi WHERE parent_id = $1 ORDER BY urutan ASC",
      [id],
    );

    res.status(200).json({
      success: true,
      message: "Data struktur organisasi berhasil diambil",
      data: {
        ...result.rows[0],
        children: children.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createStruktur = async (req, res, next) => {
  try {
    const {
      nama,
      jabatan,
      parent_id = null,
      level = 1,
      urutan = 0,
      is_active = true,
    } = req.body;

    // Ambil path foto dari multer jika ada
    const foto = req.file ? `/uploads/struktur/${req.file.filename}` : null;

    // Validasi parent_id jika ada
    if (parent_id) {
      const parentCheck = await query(
        "SELECT id FROM public.struktur_organisasi WHERE id = $1",
        [parent_id],
      );
      if (parentCheck.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Parent tidak ditemukan",
        });
      }
    }

    const result = await query(
      `INSERT INTO public.struktur_organisasi 
       (nama, jabatan, parent_id, level, urutan, foto, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        nama,
        jabatan,
        parent_id || null,
        parseInt(level) || 1,
        parseInt(urutan) || 0,
        foto,
        is_active === "true" || is_active === true,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Struktur organisasi berhasil dibuat",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const updateStruktur = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nama, jabatan, parent_id, level, urutan, is_active } = req.body;

    // Cek exist
    const existCheck = await query(
      "SELECT * FROM public.struktur_organisasi WHERE id = $1",
      [id],
    );
    if (existCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Struktur organisasi tidak ditemukan",
      });
    }

    const existing = existCheck.rows[0];

    // Cegah self-reference
    if (parent_id && parseInt(parent_id) === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: "Parent tidak boleh sama dengan dirinya sendiri",
      });
    }

    // Validasi parent_id
    if (parent_id) {
      const parentCheck = await query(
        "SELECT id FROM public.struktur_organisasi WHERE id = $1",
        [parent_id],
      );
      if (parentCheck.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Parent tidak ditemukan",
        });
      }
    }

    // Handle foto
    let foto = existing.foto; // default: tetap pakai foto lama

    if (req.file) {
      // Ada file baru → hapus file lama jika ada
      if (existing.foto) {
       const oldPath = path.join(
         __dirname,
         "../../uploads/struktur",
         path.basename(existing.foto),
       );
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      foto = `/uploads/struktur/${req.file.filename}`;
    }

    const result = await query(
      `UPDATE public.struktur_organisasi 
       SET nama        = COALESCE($1, nama),
           jabatan     = COALESCE($2, jabatan),
           parent_id   = $3,
           level       = COALESCE($4, level),
           urutan      = COALESCE($5, urutan),
           foto        = $6,
           is_active   = COALESCE($7, is_active),
           updated_at  = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [
        nama || null,
        jabatan || null,
        parent_id ? parseInt(parent_id) : null,
        level ? parseInt(level) : null,
        urutan !== undefined ? parseInt(urutan) : null,
        foto,
        is_active !== undefined
          ? is_active === "true" || is_active === true
          : null,
        id,
      ],
    );

    res.status(200).json({
      success: true,
      message: "Struktur organisasi berhasil diupdate",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const deleteStruktur = async (req, res, next) => {
  try {
    const { id } = req.params;

    const childrenCheck = await query(
      "SELECT id FROM public.struktur_organisasi WHERE parent_id = $1",
      [id],
    );
    if (childrenCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Tidak dapat menghapus, masih ada ${childrenCheck.rows.length} data yang berada di bawahnya`,
      });
    }

    // Hapus file foto jika ada
    const existing = await query(
      "SELECT foto FROM public.struktur_organisasi WHERE id = $1",
      [id],
    );
    if (existing.rows[0]?.foto) {
      const filePath = path.join(__dirname, "..", existing.rows[0].foto);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    const result = await query(
      "DELETE FROM public.struktur_organisasi WHERE id = $1 RETURNING id",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Struktur organisasi tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Struktur organisasi berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

const toggleActiveStruktur = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      `UPDATE public.struktur_organisasi 
       SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Struktur organisasi tidak ditemukan",
      });
    }
    res.status(200).json({
      success: true,
      message: `Struktur organisasi berhasil di${result.rows[0].is_active ? "aktifkan" : "nonaktifkan"}`,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStruktur,
  getStrukturById,
  createStruktur,
  updateStruktur,
  deleteStruktur,
  toggleActiveStruktur,
};
