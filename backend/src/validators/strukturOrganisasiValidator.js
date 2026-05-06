const { body } = require("express-validator");

const strukturOrganisasiValidator = [
  body("nama")
    .notEmpty()
    .withMessage("Nama wajib diisi")
    .isLength({ max: 100 })
    .withMessage("Nama maksimal 100 karakter")
    .trim(),

  body("jabatan")
    .notEmpty()
    .withMessage("Jabatan wajib diisi")
    .isLength({ max: 100 })
    .withMessage("Jabatan maksimal 100 karakter")
    .trim(),

  body("parent_id")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage("Parent ID harus berupa angka positif"),

  body("level")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Level harus berupa angka positif"),

  body("urutan")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Urutan harus berupa angka positif"),

  body("foto")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Foto maksimal 255 karakter"),

  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active harus berupa boolean"),
];

module.exports = { strukturOrganisasiValidator };
