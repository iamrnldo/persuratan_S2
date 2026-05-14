// backend/src/validators/adminValidator.js
const { body } = require("express-validator");

const createAdminValidator = [
  body("nama")
    .notEmpty()
    .withMessage("Nama wajib diisi")
    .isLength({ max: 100 })
    .withMessage("Nama maksimal 100 karakter")
    .trim(),

  body("username")
    .notEmpty()
    .withMessage("Username wajib diisi")
    .isLength({ min: 3, max: 50 })
    .withMessage("Username 3–50 karakter")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username hanya boleh huruf, angka, dan underscore")
    .trim(),

  body("email")
    .notEmpty()
    .withMessage("Email wajib diisi")
    .isEmail()
    .withMessage("Format email tidak valid")
    .isLength({ max: 100 })
    .withMessage("Email maksimal 100 karakter")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password wajib diisi")
    .isLength({ min: 8 })
    .withMessage("Password minimal 8 karakter"),

  body("role")
    .optional()
    .isIn(["superadmin", "admin"])
    .withMessage("Role harus superadmin atau admin"),

  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active harus berupa boolean"),
];

const updateAdminValidator = [
  body("nama")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Nama maksimal 100 karakter")
    .trim(),

  body("username")
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username 3–50 karakter")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username hanya boleh huruf, angka, dan underscore")
    .trim(),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Format email tidak valid")
    .isLength({ max: 100 })
    .withMessage("Email maksimal 100 karakter")
    .normalizeEmail(),

  body("role")
    .optional()
    .isIn(["superadmin", "admin"])
    .withMessage("Role harus superadmin atau admin"),

  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active harus berupa boolean"),
];

const resetPasswordValidator = [
  body("new_password")
    .notEmpty()
    .withMessage("Password baru wajib diisi")
    .isLength({ min: 8 })
    .withMessage("Password minimal 8 karakter"),
];

module.exports = {
  createAdminValidator,
  updateAdminValidator,
  resetPasswordValidator,
};
