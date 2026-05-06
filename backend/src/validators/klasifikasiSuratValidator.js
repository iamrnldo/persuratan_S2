const { body } = require("express-validator");

const klasifikasiSuratValidator = [
  body("kode")
    .notEmpty()
    .withMessage("Kode wajib diisi")
    .isLength({ max: 20 })
    .withMessage("Kode maksimal 20 karakter")
    .trim(),

  body("nama")
    .notEmpty()
    .withMessage("Nama wajib diisi")
    .isLength({ max: 100 })
    .withMessage("Nama maksimal 100 karakter")
    .trim(),

  body("keterangan")
    .optional()
    .isString()
    .withMessage("Keterangan harus berupa teks")
    .trim(),
];

module.exports = { klasifikasiSuratValidator };
