// backend/src/validators/suratValidator.js
const { body } = require("express-validator");

const suratValidator = [
  body("jenis")
    .notEmpty()
    .withMessage("Jenis surat wajib diisi")
    .isIn(["masuk", "keluar"])
    .withMessage("Jenis harus masuk atau keluar"),

  body("perihal")
    .notEmpty()
    .withMessage("Perihal wajib diisi")
    .isLength({ max: 500 })
    .withMessage("Perihal maksimal 500 karakter")
    .trim(),

  body("nomor_agenda")
    .optional({ nullable: true })
    .isLength({ max: 50 })
    .withMessage("Nomor agenda maksimal 50 karakter")
    .trim(),

  body("nomor_surat")
    .optional({ nullable: true })
    .isLength({ max: 100 })
    .withMessage("Nomor surat maksimal 100 karakter")
    .trim(),

  body("tanggal_surat")
    .optional({ nullable: true })
    .isDate()
    .withMessage("Format tanggal surat tidak valid"),

  body("tanggal_dokumen")
    .optional({ nullable: true })
    .isDate()
    .withMessage("Format tanggal tidak valid"),

  body("pengirim_tujuan")
    .optional({ nullable: true })
    .isLength({ max: 255 })
    .withMessage("Pengirim/tujuan maksimal 255 karakter")
    .trim(),

  body("klasifikasi_id")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage("Klasifikasi tidak valid"),

  body("status")
    .optional({ nullable: true })
    .isIn(["baru", "diproses", "selesai", "diarsipkan"])
    .withMessage("Status tidak valid"),

  body("keterangan")
    .optional({ nullable: true })
    .isString()
    .withMessage("Keterangan harus berupa teks"),
];

const disposisiValidator = [
  body("dari")
    .notEmpty()
    .withMessage("Dari wajib diisi")
    .isLength({ max: 100 })
    .withMessage("Maksimal 100 karakter")
    .trim(),

  body("kepada")
    .notEmpty()
    .withMessage("Kepada wajib diisi")
    .isLength({ max: 100 })
    .withMessage("Maksimal 100 karakter")
    .trim(),

  body("instruksi")
    .notEmpty()
    .withMessage("Instruksi wajib diisi")
    .isString()
    .withMessage("Instruksi harus berupa teks"),

  body("catatan")
    .optional({ nullable: true })
    .isString()
    .withMessage("Catatan harus berupa teks"),

  body("tanggal_disposisi")
    .optional({ nullable: true })
    .isDate()
    .withMessage("Format tanggal tidak valid"),

  body("status")
    .optional({ nullable: true })
    .isIn(["belum_ditindaklanjuti", "sedang_diproses", "selesai"])
    .withMessage("Status disposisi tidak valid"),
];

const statusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status wajib diisi")
    .isIn(["baru", "diproses", "selesai", "diarsipkan"])
    .withMessage("Status tidak valid"),
];

module.exports = { suratValidator, disposisiValidator, statusValidator };
