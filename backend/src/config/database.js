// backend/src/config/database.js
const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const dbDir = path.join(__dirname, "../../data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = process.env.DB_PATH || path.join(dbDir, "persuratan.db");

const db = new Database(dbPath, {
  verbose: process.env.NODE_ENV === "development" ? console.log : null,
});

// Enable WAL mode for better performance
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

console.log("✅ Database SQLite terhubung:", dbPath);

/**
 * Helper query - meniru interface PostgreSQL (result.rows, result.rowCount)
 * Otomatis deteksi SELECT vs mutasi berdasarkan keyword pertama
 */
const query = (text, params = []) => {
  const start = Date.now();

  try {
    // Konversi $1, $2, ... → ? untuk SQLite
    const sqliteText = text.replace(/\$\d+/g, "?");

    // Konversi nilai boolean JS → integer SQLite (true→1, false→0)
    const sqliteParams = params.map((p) =>
      typeof p === "boolean" ? (p ? 1 : 0) : p,
    );

    const keyword = sqliteText.trim().split(/\s+/)[0].toUpperCase();
    const isMutation = ["INSERT", "UPDATE", "DELETE"].includes(keyword);

    let rows = [];
    let rowCount = 0;

    if (isMutation) {
      // Cek apakah ada RETURNING clause
      const hasReturning = /RETURNING\s+/i.test(sqliteText);

      if (hasReturning) {
        // Pisah query utama dan RETURNING columns
        const returningMatch = sqliteText.match(
          /^([\s\S]+?)\s+RETURNING\s+([\s\S]+)$/i,
        );
        const mainSql = returningMatch[1];
        const returningCols = returningMatch[2].split(",").map((c) => c.trim());

        if (keyword === "INSERT") {
          const stmt = db.prepare(mainSql);
          const info = stmt.run(...sqliteParams);
          rowCount = info.changes;

          if (rowCount > 0) {
            // Ambil row yang baru diinsert
            const selectCols =
              returningCols[0] === "*" ? "*" : returningCols.join(", ");
            const selectStmt = db.prepare(
              `SELECT ${selectCols} FROM ${extractTableName(mainSql)} WHERE rowid = ?`,
            );
            const row = selectStmt.get(info.lastInsertRowid);
            rows = row ? [row] : [];
          }
        } else if (keyword === "UPDATE") {
          // Untuk UPDATE RETURNING, ambil dulu id-nya lalu ambil datanya setelah update
          const idMatch = mainSql.match(/WHERE\s+id\s*=\s*\?/i);
          let idValue = null;

          if (idMatch) {
            // Cari nilai id dari params (param terakhir biasanya id di WHERE)
            idValue = sqliteParams[sqliteParams.length - 1];
          }

          const stmt = db.prepare(mainSql);
          const info = stmt.run(...sqliteParams);
          rowCount = info.changes;

          if (rowCount > 0 && idValue !== null) {
            const selectCols =
              returningCols[0] === "*" ? "*" : returningCols.join(", ");
            const tableName = extractTableName(mainSql);
            const selectStmt = db.prepare(
              `SELECT ${selectCols} FROM ${tableName} WHERE id = ?`,
            );
            const row = selectStmt.get(idValue);
            rows = row ? [row] : [];
          }
        } else if (keyword === "DELETE") {
          // Untuk DELETE RETURNING, ambil data sebelum dihapus
          const idMatch = mainSql.match(/WHERE\s+id\s*=\s*\?/i);
          if (idMatch) {
            const idValue = sqliteParams[sqliteParams.length - 1];
            const selectCols =
              returningCols[0] === "*" ? "*" : returningCols.join(", ");
            const tableName = extractTableName(mainSql);
            const selectStmt = db.prepare(
              `SELECT ${selectCols} FROM ${tableName} WHERE id = ?`,
            );
            const row = selectStmt.get(idValue);
            rows = row ? [row] : [];
          }

          const stmt = db.prepare(mainSql);
          const info = stmt.run(...sqliteParams);
          rowCount = info.changes;
        }
      } else {
        // Mutasi tanpa RETURNING
        const stmt = db.prepare(sqliteText);
        const info = stmt.run(...sqliteParams);
        rowCount = info.changes;
        rows = [];
      }
    } else {
      // SELECT
      const stmt = db.prepare(sqliteText);
      rows = stmt.all(...sqliteParams);

      // Konversi integer SQLite (0/1) kembali ke boolean untuk kolom boolean
      rows = rows.map(convertBooleans);

      rowCount = rows.length;
    }

    if (process.env.NODE_ENV === "development") {
      const duration = Date.now() - start;
      console.log("📝 Query executed", {
        text: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
        duration: `${duration}ms`,
        rows: rowCount,
      });
    }

    return { rows, rowCount };
  } catch (error) {
    console.error("❌ Query error:", error.message);
    console.error("SQL:", text);
    console.error("Params:", params);
    throw error;
  }
};

/**
 * Ekstrak nama tabel dari SQL (hapus schema prefix jika ada, misal public.admin → admin)
 */
const extractTableName = (sql) => {
  const match = sql.match(/(?:FROM|INTO|UPDATE|JOIN)\s+(?:\w+\.)?(\w+)/i);
  return match ? match[1] : "";
};

/**
 * Konversi kolom integer 0/1 ke boolean untuk kolom yang diketahui
 */
const BOOLEAN_COLUMNS = ["is_active"];
const convertBooleans = (row) => {
  if (!row || typeof row !== "object") return row;
  const converted = { ...row };
  for (const col of BOOLEAN_COLUMNS) {
    if (col in converted && typeof converted[col] === "number") {
      converted[col] = converted[col] === 1;
    }
  }
  return converted;
};

/**
 * Transaction helper
 */
const withTransaction = (callback) => {
  const transaction = db.transaction(callback);
  return transaction();
};

/**
 * Inisialisasi tabel (jalankan sekali saat startup)
 */
const initDatabase = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      nama            TEXT    NOT NULL,
      username        TEXT    NOT NULL UNIQUE,
      email           TEXT    NOT NULL UNIQUE,
      password        TEXT    NOT NULL,
      role            TEXT    NOT NULL DEFAULT 'admin' CHECK(role IN ('superadmin', 'admin')),
      is_active       INTEGER NOT NULL DEFAULT 1,
      refresh_token   TEXT,
      last_login      TEXT,
      created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS surat_masuk (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      nomor_surat     TEXT    NOT NULL,
      tanggal_surat   TEXT    NOT NULL,
      tanggal_terima  TEXT    NOT NULL DEFAULT (date('now')),
      pengirim        TEXT    NOT NULL,
      perihal         TEXT    NOT NULL,
      kategori        TEXT,
      file_path       TEXT,
      file_name       TEXT,
      keterangan      TEXT,
      status          TEXT    NOT NULL DEFAULT 'baru' CHECK(status IN ('baru', 'diproses', 'selesai', 'arsip')),
      created_by      INTEGER REFERENCES admin(id),
      created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS surat_keluar (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      nomor_surat     TEXT    NOT NULL UNIQUE,
      tanggal_surat   TEXT    NOT NULL,
      tujuan          TEXT    NOT NULL,
      perihal         TEXT    NOT NULL,
      kategori        TEXT,
      file_path       TEXT,
      file_name       TEXT,
      keterangan      TEXT,
      status          TEXT    NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'terkirim', 'arsip')),
      created_by      INTEGER REFERENCES admin(id),
      created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);

  console.log("✅ Tabel database siap");
};

module.exports = { db, query, withTransaction, initDatabase };
