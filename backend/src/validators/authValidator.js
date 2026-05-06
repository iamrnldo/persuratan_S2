const { body } = require("express-validator");

const loginValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username wajib diisi")
    .isString()
    .withMessage("Username harus berupa teks")
    .trim(),

  body("password")
    .notEmpty()
    .withMessage("Password wajib diisi")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter"),
];

const registerValidator = [
  body("nama")
    .notEmpty()
    .withMessage("Nama wajib diisi")
    .isLength({ max: 100 })
    .withMessage("Nama maksimal 100 karakter")
    .trim(),

  body("username")
    .notEmpty()
    .withMessage("Username wajib diisi")
    .isLength({ min: 4, max: 50 })
    .withMessage("Username 4-50 karakter")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username hanya boleh huruf, angka, dan underscore")
    .trim(),

  body("email")
    .notEmpty()
    .withMessage("Email wajib diisi")
    .isEmail()
    .withMessage("Format email tidak valid")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password wajib diisi")
    .isLength({ min: 8 })
    .withMessage("Password minimal 8 karakter")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password harus mengandung huruf besar, huruf kecil, dan angka",
    ),

  body("role")
    .optional()
    .isIn(["superadmin", "admin"])
    .withMessage("Role harus superadmin atau admin"),
];

const changePasswordValidator = [
  body("password_lama").notEmpty().withMessage("Password lama wajib diisi"),

  body("password_baru")
    .notEmpty()
    .withMessage("Password baru wajib diisi")
    .isLength({ min: 8 })
    .withMessage("Password minimal 8 karakter")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password harus mengandung huruf besar, huruf kecil, dan angka",
    ),

  body("konfirmasi_password")
    .notEmpty()
    .withMessage("Konfirmasi password wajib diisi")
    .custom((value, { req }) => {
      if (value !== req.body.password_baru) {
        throw new Error("Konfirmasi password tidak cocok");
      }
      return true;
    }),
];

module.exports = {
  loginValidator,
  registerValidator,
  changePasswordValidator,
};
