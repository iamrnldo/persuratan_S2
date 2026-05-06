const { body } = require("express-validator");

const faqValidator = [
  body("pertanyaan")
    .notEmpty()
    .withMessage("Pertanyaan wajib diisi")
    .isString()
    .withMessage("Pertanyaan harus berupa teks")
    .trim(),

  body("jawaban")
    .notEmpty()
    .withMessage("Jawaban wajib diisi")
    .isString()
    .withMessage("Jawaban harus berupa teks")
    .trim(),

  body("urutan")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Urutan harus berupa angka positif"),

  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active harus berupa boolean"),
];

module.exports = { faqValidator };
