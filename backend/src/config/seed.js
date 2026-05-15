// backend/src/config/seed.js — UPDATED: semua tabel
// Jalankan: node src/config/seed.js
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const dbDir = path.join(__dirname, "../../data");
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const dbPath = process.env.DB_PATH || path.join(dbDir, "persuratan.db");
const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

// Buat semua tabel
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

  CREATE TABLE IF NOT EXISTS klasifikasi_surat (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    kode       TEXT    NOT NULL UNIQUE,
    nama       TEXT    NOT NULL,
    keterangan TEXT,
    is_active  INTEGER NOT NULL DEFAULT 1,
    created_at TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS surat (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    jenis           TEXT    NOT NULL CHECK(jenis IN ('masuk', 'keluar')),
    nomor_agenda    TEXT,
    nomor_surat     TEXT,
    tanggal_surat   TEXT,
    tanggal_dokumen TEXT,
    pengirim_tujuan TEXT,
    perihal         TEXT    NOT NULL,
    klasifikasi_id  INTEGER REFERENCES klasifikasi_surat(id),
    file_path       TEXT,
    file_name       TEXT,
    file_size       INTEGER,
    status          TEXT    NOT NULL DEFAULT 'baru' CHECK(status IN ('baru', 'diproses', 'selesai', 'diarsipkan')),
    keterangan      TEXT,
    created_by      INTEGER REFERENCES admin(id),
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS disposisi (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    surat_id          INTEGER NOT NULL REFERENCES surat(id) ON DELETE CASCADE,
    dari              TEXT    NOT NULL,
    kepada            TEXT    NOT NULL,
    instruksi         TEXT,
    catatan           TEXT,
    tanggal_disposisi TEXT    NOT NULL DEFAULT (date('now')),
    status            TEXT    NOT NULL DEFAULT 'belum_ditindaklanjuti'
                              CHECK(status IN ('belum_ditindaklanjuti', 'sedang_ditindaklanjuti', 'selesai')),
    created_at        TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at        TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS faq (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    pertanyaan TEXT    NOT NULL,
    jawaban    TEXT    NOT NULL,
    urutan     INTEGER NOT NULL DEFAULT 0,
    is_active  INTEGER NOT NULL DEFAULT 1,
    created_at TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS struktur_organisasi (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    nama       TEXT    NOT NULL,
    jabatan    TEXT    NOT NULL,
    parent_id  INTEGER REFERENCES struktur_organisasi(id),
    level      INTEGER NOT NULL DEFAULT 1,
    urutan     INTEGER NOT NULL DEFAULT 0,
    foto       TEXT,
    is_active  INTEGER NOT NULL DEFAULT 1,
    created_at TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS profil_desa (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    nama_desa        TEXT,
    kecamatan        TEXT,
    kabupaten        TEXT,
    provinsi         TEXT,
    kode_pos         TEXT,
    alamat           TEXT,
    no_telp          TEXT,
    email            TEXT,
    website          TEXT,
    luas_wilayah     TEXT,
    jumlah_penduduk  INTEGER,
    jumlah_kk        INTEGER,
    jumlah_dusun     INTEGER,
    jumlah_rw        INTEGER,
    sejarah          TEXT,
    visi             TEXT,
    misi             TEXT,
    foto_kantor      TEXT,
    maps_embed       TEXT,
    maps_link        TEXT,
    facebook         TEXT,
    instagram        TEXT,
    youtube          TEXT,
    whatsapp         TEXT,
    jam_layanan      TEXT,
    jam_istirahat    TEXT,
    created_at       TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS layanan (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nama        TEXT    NOT NULL,
    slug        TEXT    NOT NULL UNIQUE,
    deskripsi   TEXT,
    icon        TEXT,
    persyaratan TEXT,
    prosedur    TEXT,
    is_active   INTEGER NOT NULL DEFAULT 1,
    urutan      INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

// Cek apakah superadmin sudah ada
const existing = db
  .prepare("SELECT id FROM admin WHERE role = 'superadmin'")
  .get();
if (existing) {
  console.log("✅ Superadmin sudah ada, skip seeding");
  db.close();
  process.exit(0);
}

// Buat superadmin
const password = process.env.SEED_PASSWORD || "Admin@1234";
const hashedPassword = bcrypt.hashSync(password, 12);

db.prepare(
  `
  INSERT INTO admin (nama, username, email, password, role, is_active)
  VALUES (?, ?, ?, ?, 'superadmin', 1)
`,
).run("Super Admin", "superadmin", "superadmin@persuratan.com", hashedPassword);

console.log("✅ Superadmin berhasil dibuat:");
console.log("   Username : superadmin");
console.log("   Password :", password);
console.log("   ⚠️  Segera ganti password setelah login pertama!");

// Seed klasifikasi surat awal
const existingKlasifikasi = db
  .prepare("SELECT id FROM klasifikasi_surat LIMIT 1")
  .get();
if (!existingKlasifikasi) {
  const insertKlasifikasi = db.prepare(
    `INSERT INTO klasifikasi_surat (kode, nama, keterangan) VALUES (?, ?, ?)`,
  );
  const klasifikasiData = [
    ["001", "Umum", "Surat-surat umum"],
    ["002", "Keuangan", "Surat terkait keuangan"],
    ["003", "Kepegawaian", "Surat terkait kepegawaian"],
    ["004", "Akademik", "Surat terkait akademik"],
    ["005", "Kemahasiswaan", "Surat terkait kemahasiswaan"],
  ];
  for (const [kode, nama, keterangan] of klasifikasiData) {
    insertKlasifikasi.run(kode, nama, keterangan);
  }
  console.log(
    "✅ Klasifikasi surat berhasil dibuat:",
    klasifikasiData.length,
    "data",
  );
}

db.close();
console.log("\n🎉 Seeding selesai! Jalankan: npm start");
