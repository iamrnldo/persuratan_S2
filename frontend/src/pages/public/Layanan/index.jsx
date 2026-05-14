/* eslint-disable no-unused-vars */
// frontend/src/pages/public/Layanan/index.jsx
import { useState, useEffect } from "react";
import {
  Search,
  ChevronRight,
  Loader2,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

// ── Ikon lucide fallback by slug/name ──
const getIcon = (iconName) => {
  const icons = {
    "file-text": <FileText size={24} color="#16a34a" />,
    users: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#16a34a"
        strokeWidth="2"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    home: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#16a34a"
        strokeWidth="2"
      >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    shield: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#16a34a"
        strokeWidth="2"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    zap: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#16a34a"
        strokeWidth="2"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    heart: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#16a34a"
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  };
  return icons[iconName] || <FileText size={24} color="#16a34a" />;
};

// Dummy data (replace with API call: layananService.getAll({ is_active: true }))
const DUMMY_LAYANAN = [
  {
    id: 1,
    nama: "Surat Pengantar",
    slug: "surat-pengantar",
    deskripsi:
      "Layanan pembuatan surat pengantar untuk berbagai keperluan administratif warga desa seperti pembuatan KTP, KK, rekening bank, dan lainnya.",
    icon: "file-text",
    urutan: 1,
  },
  {
    id: 2,
    nama: "Surat Keterangan Domisili",
    slug: "surat-keterangan-domisili",
    deskripsi:
      "Penerbitan surat keterangan domisili yang dibutuhkan untuk berbagai keperluan administratif dan resmi.",
    icon: "home",
    urutan: 2,
  },
  {
    id: 3,
    nama: "Surat Keterangan Usaha",
    slug: "surat-keterangan-usaha",
    deskripsi:
      "Penerbitan surat keterangan usaha untuk UMKM dan wirausaha warga desa.",
    icon: "zap",
    urutan: 3,
  },
  {
    id: 4,
    nama: "Layanan Kependudukan",
    slug: "layanan-kependudukan",
    deskripsi:
      "Administrasi data kependudukan, pembuatan KTP, KK, akta kelahiran, dan dokumen kependudukan lainnya.",
    icon: "users",
    urutan: 4,
  },
  {
    id: 5,
    nama: "Surat Keterangan Tidak Mampu",
    slug: "sktm",
    deskripsi:
      "Penerbitan surat keterangan tidak mampu untuk keperluan beasiswa, bantuan kesehatan, dan program sosial lainnya.",
    icon: "heart",
    urutan: 5,
  },
  {
    id: 6,
    nama: "Perizinan & Rekomendasi",
    slug: "perizinan-rekomendasi",
    deskripsi:
      "Proses perizinan usaha mikro, izin kegiatan masyarakat, dan surat rekomendasi dari desa.",
    icon: "shield",
    urutan: 6,
  },
];

const LayananCard = ({ layanan, index }) => (
  <div
    style={{
      background: "white",
      borderRadius: "20px",
      padding: "2rem",
      border: "1px solid #dcfce7",
      boxShadow: "0 2px 12px rgba(22,163,74,0.06)",
      transition: "all 0.3s ease",
      cursor: "default",
      animation: `fadeUp 0.5s ease ${index * 80}ms both`,
      display: "flex",
      flexDirection: "column",
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = "translateY(-6px)";
      e.currentTarget.style.boxShadow = "0 16px 40px rgba(22,163,74,0.15)";
      e.currentTarget.style.borderColor = "#86efac";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 2px 12px rgba(22,163,74,0.06)";
      e.currentTarget.style.borderColor = "#dcfce7";
    }}
  >
    <div
      style={{
        width: "3.5rem",
        height: "3.5rem",
        background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
        borderRadius: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "1.25rem",
      }}
    >
      {getIcon(layanan.icon)}
    </div>

    <div style={{ flex: 1 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
        }}
      >
        <h3
          style={{
            fontFamily: "'Lora', serif",
            fontWeight: 600,
            fontSize: "1.05rem",
            color: "#14532d",
          }}
        >
          {layanan.nama}
        </h3>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "0.65rem",
            color: "#16a34a",
            background: "#f0fdf4",
            padding: "0.2rem 0.5rem",
            borderRadius: "9999px",
            fontWeight: 500,
          }}
        >
          #{layanan.urutan.toString().padStart(2, "0")}
        </span>
      </div>
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "0.825rem",
          color: "#6b7280",
          lineHeight: 1.7,
        }}
      >
        {layanan.deskripsi}
      </p>
    </div>

    <div
      style={{
        marginTop: "1.25rem",
        paddingTop: "1rem",
        borderTop: "1px solid #f0fdf4",
      }}
    >
      <Link
        to="/kontak"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.375rem",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "#16a34a",
          textDecoration: "none",
          transition: "gap 0.2s",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.gap = "0.625rem";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.gap = "0.375rem";
        }}
      >
        Ajukan Layanan <ChevronRight size={14} />
      </Link>
    </div>
  </div>
);

const LayananPage = () => {
  const [layanan] = useState(DUMMY_LAYANAN);
  const [search, setSearch] = useState("");
  const [loading] = useState(false);

  const filtered = layanan.filter(
    (l) =>
      l.nama.toLowerCase().includes(search.toLowerCase()) ||
      l.deskripsi.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .search-input:focus { outline: none; border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.12); }
      `}</style>

      {/* ── Page Hero ── */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #052e16 0%, #14532d 50%, #15803d 100%)",
          padding: "5rem 1.5rem 6rem",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "300px",
            background:
              "radial-gradient(ellipse, rgba(74,222,128,0.1) 0%, transparent 70%)",
          }}
        />
        <div style={{ position: "relative" }}>
          <span
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#86efac",
              padding: "0.375rem 1rem",
              borderRadius: "9999px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            LAYANAN DESA
          </span>
          <h1
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: "white",
              marginBottom: "1rem",
            }}
          >
            Layanan Administrasi Desa
          </h1>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "0.95rem",
              color: "#bbf7d0",
              lineHeight: 1.8,
              maxWidth: "480px",
              margin: "0 auto 2rem",
            }}
          >
            Temukan layanan yang Anda butuhkan dan kunjungi kantor desa kami
            untuk mendapatkan bantuan.
          </p>

          {/* Search */}
          <div
            style={{
              position: "relative",
              maxWidth: "440px",
              margin: "0 auto",
            }}
          >
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#16a34a",
              }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari layanan..."
              className="search-input"
              style={{
                width: "100%",
                padding: "0.875rem 1rem 0.875rem 2.75rem",
                borderRadius: "9999px",
                border: "2px solid transparent",
                background: "white",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.875rem",
                color: "#1a2e1a",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                transition: "all 0.2s",
              }}
            />
          </div>
        </div>

        <svg
          style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
          viewBox="0 0 1440 50"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0 50L1440 50L1440 20C1100 50 700 0 350 30C150 45 60 15 0 30L0 50Z"
            fill="#fefdf8"
          />
        </svg>
      </section>

      {/* ── Layanan Grid ── */}
      <section style={{ padding: "4rem 1.5rem", background: "#fefdf8" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "4rem 0",
              }}
            >
              <Loader2
                size={32}
                color="#16a34a"
                style={{ animation: "spin 1s linear infinite" }}
              />
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 0",
                color: "#6b7280",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              <FileText
                size={48}
                style={{
                  margin: "0 auto 1rem",
                  opacity: 0.3,
                  display: "block",
                }}
              />
              <p>
                Tidak ada layanan yang ditemukan untuk "
                <strong>{search}</strong>"
              </p>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "2rem",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "0.875rem",
                    color: "#6b7280",
                  }}
                >
                  Menampilkan{" "}
                  <strong style={{ color: "#15803d" }}>
                    {filtered.length}
                  </strong>{" "}
                  layanan
                  {search && ` untuk "${search}"`}
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "1.5rem",
                }}
                className="layanan-grid"
              >
                {filtered.map((l, i) => (
                  <LayananCard key={l.id} layanan={l} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
        <style>{`
          @media (max-width: 900px) { .layanan-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 580px) { .layanan-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ── CTA Info ── */}
      <section
        style={{
          padding: "3.5rem 1.5rem",
          background: "#f0fdf4",
          borderTop: "1px solid #dcfce7",
        }}
      >
        <div
          style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}
        >
          <h2
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#14532d",
              marginBottom: "0.75rem",
            }}
          >
            Tidak Menemukan yang Anda Cari?
          </h2>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "0.875rem",
              color: "#4b5563",
              lineHeight: 1.7,
              marginBottom: "1.5rem",
            }}
          >
            Hubungi petugas desa kami secara langsung. Kami siap membantu
            menjelaskan jenis layanan yang sesuai dengan kebutuhan Anda.
          </p>
          <Link
            to="/kontak"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.875rem 1.75rem",
              background: "#15803d",
              color: "white",
              borderRadius: "9999px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: "0.875rem",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(22,163,74,0.3)",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#14532d";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#15803d";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Hubungi Kami <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LayananPage;
