const { body } = require("express-validator");

const layananValidator = [
  body("nama")
    .notEmpty()
    .withMessage("Nama layanan wajib diisi")
    .isLength({ max: 100 })
    .withMessage("Nama maksimal 100 karakter")
    .trim(),

  body("slug")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Slug maksimal 100 karakter"),

  body("deskripsi")
    .optional()
    .isString()
    .withMessage("Deskripsi harus berupa teks"),

  body("icon")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Icon maksimal 50 karakter"),

  body("persyaratan")
    .optional()
    .isString()
    .withMessage("Persyaratan harus berupa teks"),

  body("prosedur")
    .optional()
    .isString()
    .withMessage("Prosedur harus berupa teks"),

  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active harus berupa boolean"),

  body("urutan")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Urutan harus berupa angka positif"),
];

module.exports = { layananValidator };
