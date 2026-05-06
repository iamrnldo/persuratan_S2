const express = require("express");
const router = express.Router();
const {
  getAllStruktur, getStrukturById, createStruktur,
  updateStruktur, deleteStruktur, toggleActiveStruktur,
} = require("../controllers/strukturOrganisasiController");
const { strukturOrganisasiValidator } = require("../validators/strukturOrganisasiValidator");
const validateRequest = require("../middlewares/validateRequest");
const { authenticate } = require("../middlewares/auth");
const { mutateLimiter } = require("../middlewares/rateLimiter");

// ✅ Public (query: is_active, tree=true untuk tree view)
router.get("/", getAllStruktur);
router.get("/:id", getStrukturById);

// 🔒 Protected + Rate Limited
router.post("/", authenticate, mutateLimiter, strukturOrganisasiValidator, validateRequest, createStruktur);
router.put("/:id", authenticate, mutateLimiter, strukturOrganisasiValidator, validateRequest, updateStruktur);
router.patch("/:id/toggle-active", authenticate, mutateLimiter, toggleActiveStruktur);
router.delete("/:id", authenticate, mutateLimiter, deleteStruktur);

module.exports = router;
