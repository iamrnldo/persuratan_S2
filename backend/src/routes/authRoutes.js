const express = require("express");
const router = express.Router();
const {
  login, logout, refreshToken, getMe, changePassword,
  register, getAllAdmins, toggleActiveAdmin, deleteAdmin,
} = require("../controllers/authController");
const { authenticate, authorize } = require("../middlewares/auth");
const {
  loginValidator, registerValidator, changePasswordValidator,
} = require("../validators/authValidator");
const validateRequest = require("../middlewares/validateRequest");
const { authLimiter, mutateLimiter } = require("../middlewares/rateLimiter");

// ==================== Public Routes ====================
// POST /api/v1/auth/login - dengan authLimiter (5 requests/15min)
router.post("/login", authLimiter, loginValidator, validateRequest, login);

// POST /api/v1/auth/refresh-token
router.post("/refresh-token", refreshToken);

// ==================== Private Routes (semua admin) ====================
// POST /api/v1/auth/logout
router.post("/logout", authenticate, logout);

// GET /api/v1/auth/me
router.get("/me", authenticate, getMe);

// PUT /api/v1/auth/change-password
router.put(
  "/change-password",
  authenticate,
  mutateLimiter,
  changePasswordValidator,
  validateRequest,
  changePassword
);

// ==================== Superadmin Only Routes ====================
// GET /api/v1/auth/admins
router.get("/admins", authenticate, authorize("superadmin"), getAllAdmins);

// POST /api/v1/auth/register - dengan authLimiter
router.post(
  "/register",
  authenticate,
  authorize("superadmin"),
  authLimiter,
  registerValidator,
  validateRequest,
  register
);

// PATCH /api/v1/auth/admins/:id/toggle-active
router.patch(
  "/admins/:id/toggle-active",
  authenticate,
  authorize("superadmin"),
  mutateLimiter,
  toggleActiveAdmin
);

// DELETE /api/v1/auth/admins/:id
router.delete(
  "/admins/:id",
  authenticate,
  authorize("superadmin"),
  mutateLimiter,
  deleteAdmin
);

module.exports = router;
