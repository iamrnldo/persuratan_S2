const express = require("express");
const router = express.Router();
const {
  getAllGaleriKategori, getGaleriKategoriById,
  createGaleriKategori, updateGaleriKategori, deleteGaleriKategori,
} = require("../controllers/galeriKategoriController");
const { galeriKategoriValidator } = require("../validators/galeriKategoriValidator");
const validateRequest = require("../middlewares/validateRequest");
const { authenticate } = require("../middlewares/auth");
const { mutateLimiter } = require("../middlewares/rateLimiter");

// ✅ Public
router.get("/", getAllGaleriKategori);
router.get("/:id", getGaleriKategoriById);

// 🔒 Protected + Rate Limited
router.post("/", authenticate, mutateLimiter, galeriKategoriValidator, validateRequest, createGaleriKategori);
router.put("/:id", authenticate, mutateLimiter, galeriKategoriValidator, validateRequest, updateGaleriKategori);
router.delete("/:id", authenticate, mutateLimiter, deleteGaleriKategori);

module.exports = router;
