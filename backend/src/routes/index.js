const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");                          // ← NEW
const faqRoutes = require("./faqRoutes");
const galeriKategoriRoutes = require("./galeriKategoriRoutes");
const kategoriPengumumanRoutes = require("./kategoriPengumumanRoutes");
const klasifikasiSuratRoutes = require("./klasifikasiSuratRoutes");
const layananRoutes = require("./layananRoutes");
const profilDesaRoutes = require("./profilDesaRoutes");
const strukturOrganisasiRoutes = require("./strukturOrganisasiRoutes");

const { authenticate } = require("../middlewares/auth");             // ← NEW

router.use("/auth", authRoutes);                                     // ← NEW (public)
router.use("/faq", faqRoutes);                                       // GET public
router.use("/galeri-kategori", galeriKategoriRoutes);
router.use("/kategori-pengumuman", kategoriPengumumanRoutes);
router.use("/klasifikasi-surat", klasifikasiSuratRoutes);
router.use("/layanan", layananRoutes);
router.use("/profil-desa", profilDesaRoutes);
router.use("/struktur-organisasi", strukturOrganisasiRoutes);

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Sistem Persuratan Desa",
    version: "1.0.0",
    endpoints: {
      auth: "/api/v1/auth",
      faq: "/api/v1/faq",
      galeriKategori: "/api/v1/galeri-kategori",
      kategoriPengumuman: "/api/v1/kategori-pengumuman",
      klasifikasiSurat: "/api/v1/klasifikasi-surat",
      layanan: "/api/v1/layanan",
      profilDesa: "/api/v1/profil-desa",
      strukturOrganisasi: "/api/v1/struktur-organisasi",
    },
  });
});

module.exports = router;