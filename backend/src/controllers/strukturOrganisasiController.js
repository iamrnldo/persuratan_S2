const { query, withTransaction } = require("../config/database");

/**
 * @desc    Get semua struktur organisasi (dengan tree structure)
 * @route   GET /api/v1/struktur-organisasi
 * @access  Public
 */
const getAllStruktur = async (req, res, next) => {
  try {
    const { is_active, tree } = req.query;

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

    // Build tree jika diminta
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

/**
 * Helper: Build tree dari flat array
 */
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

    // Get children
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
      foto,
      is_active = true,
    } = req.body;

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
      [nama, jabatan, parent_id, level, urutan, foto || null, is_active],
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
    const { nama, jabatan, parent_id, level, urutan, foto, is_active } =
      req.body;

    const existCheck = await query(
      "SELECT id FROM public.struktur_organisasi WHERE id = $1",
      [id],
    );
    if (existCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Struktur organisasi tidak ditemukan",
      });
    }

    // Cegah self-reference
    if (parent_id && parseInt(parent_id) === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: "Parent tidak boleh sama dengan dirinya sendiri",
      });
    }

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
      `UPDATE public.struktur_organisasi 
       SET nama = COALESCE($1, nama),
           jabatan = COALESCE($2, jabatan),
           parent_id = $3,
           level = COALESCE($4, level),
           urutan = COALESCE($5, urutan),
           foto = COALESCE($6, foto),
           is_active = COALESCE($7, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [
        nama,
        jabatan,
        parent_id !== undefined ? parent_id : null,
        level,
        urutan,
        foto,
        is_active,
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

    // Cek apakah ada children
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
