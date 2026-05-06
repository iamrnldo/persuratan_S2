const { body } = require("express-validator");

const galeriKategoriValidator = [
  body("nama")
    .notEmpty()
    .withMessage("Nama kategori wajib diisi")
    .isString()
    .withMessage("Nama harus berupa teks")
    .isLength({ max: 100 })
    .withMessage("Nama maksimal 100 karakter")
    .trim(),

  body("slug")
    .optional()
    .isSlug()
    .withMessage("Slug tidak valid (gunakan huruf kecil dan tanda -)")
    .isLength({ max: 100 })
    .withMessage("Slug maksimal 100 karakter"),
];

module.exports = { galeriKategoriValidator };
