// =============================================
// backend/src/routes/suratRoutes.js
// =============================================

const express = require("express");
const router = express.Router();
const {
  getAllSurat,
  getSuratById,
  createSurat,
  updateSurat,
  deleteSurat,
  updateStatusSurat,
  createDisposisi,
  updateDisposisi,
  deleteDisposisi,
  getStatistikSurat,
} = require("../controllers/suratController");
const {
  suratValidator,
  disposisiValidator,
  statusValidator,
} = require("../validators/suratValidator");
const validateRequest = require("../middlewares/validateRequest");
const { authenticate } = require("../middlewares/auth");
const { mutateLimiter } = require("../middlewares/rateLimiter");
const upload = require("../middlewares/upload");

// ✅ Public
router.get("/statistik", getStatistikSurat);
router.get("/", getAllSurat);
router.get("/:id", getSuratById);

// 🔒 Protected
router.post(
  "/",
  authenticate,
  mutateLimiter,
  upload.single("file"),
  suratValidator,
  validateRequest,
  createSurat,
);
router.put(
  "/:id",
  authenticate,
  mutateLimiter,
  upload.single("file"),
  suratValidator,
  validateRequest,
  updateSurat,
);
router.patch(
  "/:id/status",
  authenticate,
  mutateLimiter,
  statusValidator,
  validateRequest,
  updateStatusSurat,
);
router.delete("/:id", authenticate, mutateLimiter, deleteSurat);

// Disposisi routes
router.post(
  "/:surat_id/disposisi",
  authenticate,
  mutateLimiter,
  disposisiValidator,
  validateRequest,
  createDisposisi,
);
router.put(
  "/disposisi/:id",
  authenticate,
  mutateLimiter,
  disposisiValidator,
  validateRequest,
  updateDisposisi,
);
router.delete("/disposisi/:id", authenticate, mutateLimiter, deleteDisposisi);

module.exports = router;
