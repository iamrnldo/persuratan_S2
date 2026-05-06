const express = require("express");
const router = express.Router();
const {
  getAllKlasifikasiSurat, getKlasifikasiSuratById,
  createKlasifikasiSurat, updateKlasifikasiSurat, deleteKlasifikasiSurat,
} = require("../controllers/klasifikasiSuratController");
const { klasifikasiSuratValidator } = require("../validators/klasifikasiSuratValidator");
const validateRequest = require("../middlewares/validateRequest");
const { authenticate } = require("../middlewares/auth");
const { mutateLimiter } = require("../middlewares/rateLimiter");

// ✅ Public
router.get("/", getAllKlasifikasiSurat);
router.get("/:id", getKlasifikasiSuratById);

// 🔒 Protected + Rate Limited
router.post("/", authenticate, mutateLimiter, klasifikasiSuratValidator, validateRequest, createKlasifikasiSurat);
router.put("/:id", authenticate, mutateLimiter, klasifikasiSuratValidator, validateRequest, updateKlasifikasiSurat);
router.delete("/:id", authenticate, mutateLimiter, deleteKlasifikasiSurat);

module.exports = router;
