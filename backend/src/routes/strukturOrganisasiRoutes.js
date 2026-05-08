const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  getAllStruktur,
  getStrukturById,
  createStruktur,
  updateStruktur,
  deleteStruktur,
  toggleActiveStruktur,
} = require("../controllers/strukturOrganisasiController");

const {
  strukturOrganisasiValidator,
} = require("../validators/strukturOrganisasiValidator");
const validateRequest = require("../middlewares/validateRequest");
const { authenticate } = require("../middlewares/auth");
const { mutateLimiter } = require("../middlewares/rateLimiter");

// ── Multer setup ──────────────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, "../uploads/struktur");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `struktur-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Format file tidak didukung. Gunakan JPG, PNG, atau WebP."));
    }
  },
});

// ── Routes ────────────────────────────────────────────────────────────────────
router.get("/", getAllStruktur);
router.get("/:id", getStrukturById);

router.post(
  "/",
  authenticate,
  mutateLimiter,
  upload.single("foto"), // ← multer dulu
  strukturOrganisasiValidator,
  validateRequest,
  createStruktur,
);

router.put(
  "/:id",
  authenticate,
  mutateLimiter,
  upload.single("foto"), // ← multer dulu
  strukturOrganisasiValidator,
  validateRequest,
  updateStruktur,
);

router.patch(
  "/:id/toggle-active",
  authenticate,
  mutateLimiter,
  toggleActiveStruktur,
);
router.delete("/:id", authenticate, mutateLimiter, deleteStruktur);

module.exports = router;
