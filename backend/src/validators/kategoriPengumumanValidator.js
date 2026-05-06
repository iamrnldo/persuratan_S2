const { body } = require("express-validator");

const kategoriPengumumanValidator = [
  body("nama")
    .notEmpty()
    .withMessage("Nama kategori wajib diisi")
    .isLength({ max: 50 })
    .withMessage("Nama maksimal 50 karakter")
    .trim(),

  body("slug")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Slug maksimal 50 karakter"),

  body("icon")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Icon maksimal 50 karakter")
    .trim(),
];

module.exports = { kategoriPengumumanValidator };
