const express = require("express");
const router = express.Router();
const {
  getProfilDesa, upsertProfilDesa, updateProfilDesa,
} = require("../controllers/profilDesaController");
const { profilDesaValidator } = require("../validators/profilDesaValidator");
const validateRequest = require("../middlewares/validateRequest");
const { authenticate } = require("../middlewares/auth");
const { mutateLimiter } = require("../middlewares/rateLimiter");

// ✅ Public
router.get("/", getProfilDesa);

// 🔒 Protected + Rate Limited
router.post("/", authenticate, mutateLimiter, profilDesaValidator, validateRequest, upsertProfilDesa);
router.put("/:id", authenticate, mutateLimiter, updateProfilDesa);

module.exports = router;
