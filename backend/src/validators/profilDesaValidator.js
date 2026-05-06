const { body } = require("express-validator");

const profilDesaValidator = [
  body("nama_desa")
    .notEmpty()
    .withMessage("Nama desa wajib diisi")
    .isLength({ max: 100 })
    .withMessage("Nama desa maksimal 100 karakter")
    .trim(),

  body("kecamatan")
    .optional({ nullable: true })
    .isLength({ max: 100 })
    .withMessage("Kecamatan maksimal 100 karakter")
    .trim(),

  body("kabupaten")
    .optional({ nullable: true })
    .isLength({ max: 100 })
    .withMessage("Kabupaten maksimal 100 karakter")
    .trim(),

  body("provinsi")
    .optional({ nullable: true })
    .isLength({ max: 100 })
    .withMessage("Provinsi maksimal 100 karakter")
    .trim(),

  body("kode_pos")
    .optional({ nullable: true })
    .isLength({ max: 10 })
    .withMessage("Kode pos maksimal 10 karakter"),

  body("email")
    .optional({ nullable: true })
    .isEmail()
    .withMessage("Format email tidak valid")
    .isLength({ max: 100 })
    .withMessage("Email maksimal 100 karakter"),

  body("website")
    .optional({ nullable: true })
    .isURL()
    .withMessage("Format website tidak valid"),

  body("luas_wilayah")
    .optional({ nullable: true })
    .isNumeric()
    .withMessage("Luas wilayah harus berupa angka"),

  body("jumlah_penduduk")
    .optional({ nullable: true })
    .isNumeric()
    .withMessage("Jumlah penduduk harus berupa angka"),

  body("jumlah_kk")
    .optional({ nullable: true })
    .isNumeric()
    .withMessage("Jumlah KK harus berupa angka"),

  body("jumlah_dusun")
    .optional({ nullable: true })
    .isNumeric()
    .withMessage("Jumlah dusun harus berupa angka"),

  body("jumlah_rw")
    .optional({ nullable: true })
    .isNumeric()
    .withMessage("Jumlah RW harus berupa angka"),

  body("whatsapp")
    .optional({ nullable: true })
    .isLength({ max: 20 })
    .withMessage("WhatsApp maksimal 20 karakter"),

  body("no_telp")
    .optional({ nullable: true })
    .isLength({ max: 20 })
    .withMessage("No telp maksimal 20 karakter"),
];

module.exports = { profilDesaValidator };
