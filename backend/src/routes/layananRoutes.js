const express = require("express");
const router = express.Router();
const {
  getAllLayanan, getLayananById, getLayananBySlug,
  createLayanan, updateLayanan, deleteLayanan, toggleActiveLayanan,
} = require("../controllers/layananController");
const { layananValidator } = require("../validators/layananValidator");
const validateRequest = require("../middlewares/validateRequest");
const { authenticate } = require("../middlewares/auth");
const { mutateLimiter } = require("../middlewares/rateLimiter");

// ✅ Public
router.get("/", getAllLayanan);
router.get("/slug/:slug", getLayananBySlug);
router.get("/:id", getLayananById);

// 🔒 Protected + Rate Limited
router.post("/", authenticate, mutateLimiter, layananValidator, validateRequest, createLayanan);
router.put("/:id", authenticate, mutateLimiter, layananValidator, validateRequest, updateLayanan);
router.patch("/:id/toggle-active", authenticate, mutateLimiter, toggleActiveLayanan);
router.delete("/:id", authenticate, mutateLimiter, deleteLayanan);

module.exports = router;
