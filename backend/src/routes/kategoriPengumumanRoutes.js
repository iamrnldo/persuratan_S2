const express = require("express");
const router = express.Router();
const {
  getAllKategoriPengumuman, getKategoriPengumumanById,
  createKategoriPengumuman, updateKategoriPengumuman, deleteKategoriPengumuman,
} = require("../controllers/kategoriPengumumanController");
const { kategoriPengumumanValidator } = require("../validators/kategoriPengumumanValidator");
const validateRequest = require("../middlewares/validateRequest");
const { authenticate } = require("../middlewares/auth");
const { mutateLimiter } = require("../middlewares/rateLimiter");

// ✅ Public
router.get("/", getAllKategoriPengumuman);
router.get("/:id", getKategoriPengumumanById);

// 🔒 Protected + Rate Limited
router.post("/", authenticate, mutateLimiter, kategoriPengumumanValidator, validateRequest, createKategoriPengumuman);
router.put("/:id", authenticate, mutateLimiter, kategoriPengumumanValidator, validateRequest, updateKategoriPengumuman);
router.delete("/:id", authenticate, mutateLimiter, deleteKategoriPengumuman);

module.exports = router;
