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
    .optional({ nullable: true, checkFalsy: true }) // ← checkFalsy: "" dianggap kosong
    .isInt({ min: 1 })
    .withMessage("Parent ID harus berupa angka positif"),

  body("level")
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage("Level harus berupa angka positif"),

  body("urutan")
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage("Urutan harus berupa angka positif"),

  // foto sudah jadi file upload — tidak perlu validasi body
  // body("foto") → dihapus

  body("is_active")
    .optional({ checkFalsy: true })
    .isIn(["true", "false", true, false])
    .withMessage("is_active harus berupa boolean"),
];

module.exports = { strukturOrganisasiValidator };
