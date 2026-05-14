// backend/src/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllAdmin,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  toggleActiveAdmin,
  resetPassword,
} = require("../controllers/adminController");
const {
  createAdminValidator,
  updateAdminValidator,
  resetPasswordValidator,
} = require("../validators/adminValidator");
const validateRequest = require("../middlewares/validateRequest");
const { authenticate, authorize } = require("../middlewares/auth");
const { mutateLimiter } = require("../middlewares/rateLimiter");

// 🔒 Semua route butuh login + hanya superadmin
router.use(authenticate, authorize("superadmin"));

router.get("/", getAllAdmin);
router.get("/:id", getAdminById);
router.post(
  "/",
  mutateLimiter,
  createAdminValidator,
  validateRequest,
  createAdmin,
);
router.put(
  "/:id",
  mutateLimiter,
  updateAdminValidator,
  validateRequest,
  updateAdmin,
);
router.patch("/:id/toggle-active", mutateLimiter, toggleActiveAdmin);
router.patch(
  "/:id/reset-password",
  mutateLimiter,
  resetPasswordValidator,
  validateRequest,
  resetPassword,
);
router.delete("/:id", mutateLimiter, deleteAdmin);

module.exports = router;
