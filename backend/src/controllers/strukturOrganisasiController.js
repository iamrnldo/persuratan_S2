// backend/src/controllers/strukturController.js
const { query } = require("../config/database");
const path = require("path");
const fs = require("fs");

const getAllStruktur = async (req, res, next) => {
  try {
    const { is_active, tree } = req.query;

    let conditions = [];
    let params = [];

    if (is_active !== undefined) {
      conditions.push(`so.is_active = ?`);
      params.push(is_active === "true" ? 1 : 0);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = query(
      `SELECT so.*,
              parent.nama     AS parent_nama,
              parent.jabatan  AS parent_jabatan
       FROM struktur_organisasi so
       LEFT JOIN struktur_organisasi parent ON so.parent_id = parent.id
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

// Rekursif builder tree — tidak perlu diubah, murni JS
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

    const result = query(
      `SELECT so.*,
              parent.nama    AS parent_nama,
              parent.jabatan AS parent_jabatan
       FROM struktur_organisasi so
       LEFT JOIN struktur_organisasi parent ON so.parent_id = parent.id
       WHERE so.id = ?`,
      [id],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Data struktur organisasi tidak ditemukan",
        });
    }

    const children = query(
      `SELECT * FROM struktur_organisasi WHERE parent_id = ? ORDER BY urutan ASC`,
      [id],
    );

    res.status(200).json({
      success: true,
      message: "Data struktur organisasi berhasil diambil",
      data: { ...result.rows[0], children: children.rows },
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

    const foto = req.file ? `/uploads/struktur/${req.file.filename}` : null;

    if (parent_id) {
      const parentCheck = query(
        `SELECT id FROM struktur_organisasi WHERE id = ?`,
        [parent_id],
      );
      if (parentCheck.rows.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Parent tidak ditemukan" });
      }
    }

    query(
      `INSERT INTO struktur_organisasi (nama, jabatan, parent_id, level, urutan, foto, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nama,
        jabatan,
        parent_id || null,
        parseInt(level) || 1,
        parseInt(urutan) || 0,
        foto,
        is_active === "true" || is_active === true ? 1 : 0,
      ],
    );

    const newData = query(
      `SELECT * FROM struktur_organisasi WHERE id = (SELECT last_insert_rowid())`,
      [],
    );

    res
      .status(201)
      .json({
        success: true,
        message: "Struktur organisasi berhasil dibuat",
        data: newData.rows[0],
      });
  } catch (error) {
    next(error);
  }
};

const updateStruktur = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nama, jabatan, parent_id, level, urutan, is_active } = req.body;

    const existCheck = query(`SELECT * FROM struktur_organisasi WHERE id = ?`, [
      id,
    ]);
    if (existCheck.rows.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Struktur organisasi tidak ditemukan",
        });
    }

    const existing = existCheck.rows[0];

    if (parent_id && parseInt(parent_id) === parseInt(id)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Parent tidak boleh sama dengan dirinya sendiri",
        });
    }

    if (parent_id) {
      const parentCheck = query(
        `SELECT id FROM struktur_organisasi WHERE id = ?`,
        [parent_id],
      );
      if (parentCheck.rows.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Parent tidak ditemukan" });
      }
    }

    // Handle foto baru
    let foto = existing.foto;
    if (req.file) {
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

    // Resolve nilai is_active
    let isActiveVal = existing.is_active;
    if (is_active !== undefined) {
      isActiveVal = is_active === "true" || is_active === true ? 1 : 0;
    }

    query(
      `UPDATE struktur_organisasi
       SET nama       = ?,
           jabatan    = ?,
           parent_id  = ?,
           level      = ?,
           urutan     = ?,
           foto       = ?,
           is_active  = ?,
           updated_at = datetime('now')
       WHERE id = ?`,
      [
        nama ?? existing.nama,
        jabatan ?? existing.jabatan,
        parent_id !== undefined
          ? parent_id
            ? parseInt(parent_id)
            : null
          : existing.parent_id,
        level ? parseInt(level) : existing.level,
        urutan !== undefined ? parseInt(urutan) : existing.urutan,
        foto,
        isActiveVal,
        id,
      ],
    );

    const updated = query(`SELECT * FROM struktur_organisasi WHERE id = ?`, [
      id,
    ]);

    res
      .status(200)
      .json({
        success: true,
        message: "Struktur organisasi berhasil diupdate",
        data: updated.rows[0],
      });
  } catch (error) {
    next(error);
  }
};

const deleteStruktur = async (req, res, next) => {
  try {
    const { id } = req.params;

    const childrenCheck = query(
      `SELECT id FROM struktur_organisasi WHERE parent_id = ?`,
      [id],
    );
    if (childrenCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Tidak dapat menghapus, masih ada ${childrenCheck.rows.length} data yang berada di bawahnya`,
      });
    }

    const existing = query(
      `SELECT foto FROM struktur_organisasi WHERE id = ?`,
      [id],
    );
    if (existing.rows.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Struktur organisasi tidak ditemukan",
        });
    }

    if (existing.rows[0].foto) {
      const filePath = path.join(__dirname, "../..", existing.rows[0].foto);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    query(`DELETE FROM struktur_organisasi WHERE id = ?`, [id]);
    res
      .status(200)
      .json({ success: true, message: "Struktur organisasi berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};

const toggleActiveStruktur = async (req, res, next) => {
  try {
    const { id } = req.params;

    const current = query(
      `SELECT id, is_active FROM struktur_organisasi WHERE id = ?`,
      [id],
    );
    if (current.rows.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Struktur organisasi tidak ditemukan",
        });
    }

    const newStatus = current.rows[0].is_active ? 0 : 1;

    query(
      `UPDATE struktur_organisasi SET is_active = ?, updated_at = datetime('now') WHERE id = ?`,
      [newStatus, id],
    );

    const updated = query(`SELECT * FROM struktur_organisasi WHERE id = ?`, [
      id,
    ]);

    res.status(200).json({
      success: true,
      message: `Struktur organisasi berhasil di${updated.rows[0].is_active ? "aktifkan" : "nonaktifkan"}`,
      data: updated.rows[0],
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
