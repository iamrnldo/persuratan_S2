// frontend/src/pages/public/ProfilDesa/index.jsx
import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Users,
  Building2,
  Map,
  ChevronRight,
  Leaf,
  Target,
  BookOpen,
  BarChart3,
} from "lucide-react";

const FacebookIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const InstagramIcon = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const YoutubeIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);

// Dummy data (replace with: profilDesaService.get())
const PROFIL = {
  nama_desa: "Desa Maju Bersama",
  kecamatan: "Kecamatan Sejahtera",
  kabupaten: "Kabupaten Makmur",
  provinsi: "Jawa Timur",
  kode_pos: "61254",
  alamat: "Jl. Raya Desa Maju No. 1, Kecamatan Sejahtera",
  no_telp: "(031) 123-4567",
  whatsapp: "081234567890",
  email: "info@desamaju.go.id",
  website: "https://desamaju.go.id",
  facebook: "#",
  instagram: "#",
  youtube: "#",
  luas_wilayah: 125.5,
  jumlah_penduduk: 5240,
  jumlah_kk: 1420,
  jumlah_dusun: 4,
  jumlah_rw: 8,
  jam_layanan: "Senin – Jumat, 08.00 – 15.00 WIB",
  jam_istirahat: "12.00 – 13.00 WIB",
  visi: "Terwujudnya Desa Maju Bersama yang sejahtera, mandiri, dan berdaya saing berbasis kearifan lokal dengan tata kelola pemerintahan yang baik, transparan, dan akuntabel.",
  misi: "1. Meningkatkan kualitas pelayanan publik yang cepat, mudah, dan transparan.\n2. Mengembangkan potensi ekonomi lokal berbasis UMKM dan pertanian.\n3. Memperkuat infrastruktur desa yang merata dan berkelanjutan.\n4. Meningkatkan partisipasi masyarakat dalam pembangunan desa.",
  sejarah:
    "Desa Maju Bersama berdiri sejak tahun 1945, bersamaan dengan kemerdekaan Republik Indonesia. Awalnya merupakan sebuah perkampungan kecil yang kemudian berkembang menjadi desa yang maju dan mandiri. Seiring berjalannya waktu, desa ini terus berkembang dengan berbagai inovasi dalam bidang pertanian, pendidikan, dan pelayanan publik.",
  foto_kantor: null,
  maps_embed: null,
};

const Tab = ({ tabs, active, onChange }) => (
  <div
    style={{
      display: "flex",
      gap: "0.25rem",
      background: "#f0fdf4",
      borderRadius: "12px",
      padding: "0.375rem",
      flexWrap: "wrap",
    }}
  >
    {tabs.map((t) => (
      <button
        key={t.id}
        onClick={() => onChange(t.id)}
        style={{
          padding: "0.5rem 1.125rem",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "0.825rem",
          fontWeight: active === t.id ? 600 : 400,
          background: active === t.id ? "white" : "transparent",
          color: active === t.id ? "#15803d" : "#4b5563",
          boxShadow:
            active === t.id ? "0 2px 8px rgba(22,163,74,0.12)" : "none",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          gap: "0.375rem",
        }}
      >
        {t.icon} {t.label}
      </button>
    ))}
  </div>
);

const InfoRow = ({ label, value, icon: Icon }) =>
  value ? (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.875rem",
        padding: "0.875rem 0",
        borderBottom: "1px solid #f0fdf4",
      }}
    >
      <div
        style={{
          width: "2rem",
          height: "2rem",
          background: "#f0fdf4",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: "2px",
        }}
      >
        <Icon size={14} color="#16a34a" />
      </div>
      <div>
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "0.7rem",
            color: "#9ca3af",
            fontWeight: 500,
            marginBottom: "0.2rem",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "0.875rem",
            color: "#1f2937",
            fontWeight: 500,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  ) : null;

const StatBox = ({ label, value, unit = "", icon: Icon }) => (
  <div
    style={{
      background: "white",
      borderRadius: "16px",
      padding: "1.5rem",
      border: "1px solid #dcfce7",
      boxShadow: "0 2px 8px rgba(22,163,74,0.06)",
      textAlign: "center",
      transition: "all 0.3s",
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.boxShadow = "0 8px 24px rgba(22,163,74,0.14)";
      e.currentTarget.style.transform = "translateY(-3px)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.boxShadow = "0 2px 8px rgba(22,163,74,0.06)";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    <div
      style={{
        width: "2.75rem",
        height: "2.75rem",
        background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 0.875rem",
      }}
    >
      <Icon size={20} color="#16a34a" />
    </div>
    <div
      style={{
        fontFamily: "'Lora', serif",
        fontSize: "1.75rem",
        fontWeight: 700,
        color: "#14532d",
        lineHeight: 1,
      }}
    >
      {typeof value === "number" ? value.toLocaleString("id-ID") : value}
      <span
        style={{
          fontSize: "0.875rem",
          fontWeight: 400,
          color: "#16a34a",
          marginLeft: "0.25rem",
        }}
      >
        {unit}
      </span>
    </div>
    <div
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: "0.775rem",
        color: "#6b7280",
        marginTop: "0.375rem",
      }}
    >
      {label}
    </div>
  </div>
);

const ProfilDesaPage = () => {
  const [activeTab, setActiveTab] = useState("identitas");
  const p = PROFIL;

  const tabs = [
    { id: "identitas", label: "Identitas", icon: <Building2 size={13} /> },
    { id: "statistik", label: "Statistik", icon: <BarChart3 size={13} /> },
    { id: "visi-misi", label: "Visi & Misi", icon: <Target size={13} /> },
    { id: "sejarah", label: "Sejarah", icon: <BookOpen size={13} /> },
    { id: "lokasi", label: "Lokasi", icon: <Map size={13} /> },
  ];

  return (
    <div>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tab-content { animation: fadeUp 0.35s ease both; }
      `}</style>

      {/* ── Header ── */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #052e16 0%, #14532d 50%, #15803d 100%)",
          padding: "5rem 1.5rem 4rem",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              width: "5rem",
              height: "5rem",
              background: "rgba(255,255,255,0.12)",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Leaf size={32} color="#4ade80" />
          </div>
          <h1
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: "white",
              marginBottom: "0.75rem",
            }}
          >
            {p.nama_desa}
          </h1>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "0.9rem",
              color: "#86efac",
              lineHeight: 1.7,
            }}
          >
            {p.kecamatan} · {p.kabupaten} · {p.provinsi}
          </p>
        </div>

        <svg
          style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
          viewBox="0 0 1440 50"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0 50L1440 50L1440 25C1100 50 700 0 350 30C150 45 60 15 0 30L0 50Z"
            fill="#fefdf8"
          />
        </svg>
      </section>

      {/* ── Content ── */}
      <section style={{ padding: "3rem 1.5rem 5rem", background: "#fefdf8" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          {/* Tabs */}
          <div style={{ marginBottom: "2.5rem" }}>
            <Tab tabs={tabs} active={activeTab} onChange={setActiveTab} />
          </div>

          {/* Tab Content */}
          <div className="tab-content" key={activeTab}>
            {/* ── Identitas ── */}
            {activeTab === "identitas" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "2rem",
                }}
                className="profil-grid"
              >
                <div>
                  <h2
                    style={{
                      fontFamily: "'Lora', serif",
                      fontWeight: 700,
                      color: "#14532d",
                      fontSize: "1.25rem",
                      marginBottom: "1.25rem",
                    }}
                  >
                    Informasi Umum
                  </h2>
                  <div
                    style={{
                      background: "white",
                      borderRadius: "16px",
                      padding: "1.25rem",
                      border: "1px solid #dcfce7",
                    }}
                  >
                    <InfoRow
                      label="Nama Desa"
                      value={p.nama_desa}
                      icon={Building2}
                    />
                    <InfoRow
                      label="Kecamatan"
                      value={p.kecamatan}
                      icon={MapPin}
                    />
                    <InfoRow
                      label="Kabupaten"
                      value={p.kabupaten}
                      icon={MapPin}
                    />
                    <InfoRow
                      label="Provinsi"
                      value={p.provinsi}
                      icon={MapPin}
                    />
                    <InfoRow
                      label="Kode Pos"
                      value={p.kode_pos}
                      icon={MapPin}
                    />
                    <InfoRow label="Alamat" value={p.alamat} icon={MapPin} />
                  </div>
                </div>

                <div>
                  <h2
                    style={{
                      fontFamily: "'Lora', serif",
                      fontWeight: 700,
                      color: "#14532d",
                      fontSize: "1.25rem",
                      marginBottom: "1.25rem",
                    }}
                  >
                    Kontak & Sosial Media
                  </h2>
                  <div
                    style={{
                      background: "white",
                      borderRadius: "16px",
                      padding: "1.25rem",
                      border: "1px solid #dcfce7",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <InfoRow label="Telepon" value={p.no_telp} icon={Phone} />
                    <InfoRow label="WhatsApp" value={p.whatsapp} icon={Phone} />
                    <InfoRow label="Email" value={p.email} icon={Mail} />
                    <InfoRow label="Website" value={p.website} icon={Globe} />
                  </div>

                  <div
                    style={{
                      background: "white",
                      borderRadius: "16px",
                      padding: "1.25rem",
                      border: "1px solid #dcfce7",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "'Lora', serif",
                        fontWeight: 600,
                        color: "#14532d",
                        fontSize: "0.9rem",
                        marginBottom: "1rem",
                      }}
                    >
                      Jam Operasional
                    </h3>
                    <InfoRow
                      label="Jam Layanan"
                      value={p.jam_layanan}
                      icon={Clock}
                    />
                    <InfoRow
                      label="Jam Istirahat"
                      value={p.jam_istirahat}
                      icon={Clock}
                    />
                  </div>

                  {/* Social */}
                  <div
                    style={{
                      marginTop: "1.25rem",
                      display: "flex",
                      gap: "0.75rem",
                    }}
                  >
                    {[
                      {
                        Icon: FacebookIcon,
                        href: p.facebook,
                        label: "Facebook",
                      },
                      {
                        Icon: InstagramIcon,
                        href: p.instagram,
                        label: "Instagram",
                      },
                      { Icon: YoutubeIcon, href: p.youtube, label: "YouTube" },
                    ]
                      .filter(({ href }) => href)
                      .map(({ Icon, href, label }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.5rem 0.875rem",
                            background: "#f0fdf4",
                            borderRadius: "9999px",
                            color: "#16a34a",
                            textDecoration: "none",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: "0.78rem",
                            fontWeight: 500,
                            border: "1px solid #dcfce7",
                            transition: "all 0.2s",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = "#15803d";
                            e.currentTarget.style.color = "white";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = "#f0fdf4";
                            e.currentTarget.style.color = "#16a34a";
                          }}
                        >
                          <Icon size={14} /> {label}
                        </a>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Statistik ── */}
            {activeTab === "statistik" && (
              <div>
                <h2
                  style={{
                    fontFamily: "'Lora', serif",
                    fontWeight: 700,
                    color: "#14532d",
                    fontSize: "1.25rem",
                    marginBottom: "1.75rem",
                  }}
                >
                  Data Kependudukan & Wilayah
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1.25rem",
                  }}
                  className="stats-grid2"
                >
                  <StatBox
                    label="Total Penduduk"
                    value={p.jumlah_penduduk}
                    unit="jiwa"
                    icon={Users}
                  />
                  <StatBox
                    label="Jumlah KK"
                    value={p.jumlah_kk}
                    unit="KK"
                    icon={Building2}
                  />
                  <StatBox
                    label="Luas Wilayah"
                    value={p.luas_wilayah}
                    unit="Ha"
                    icon={Map}
                  />
                  <StatBox
                    label="Jumlah Dusun"
                    value={p.jumlah_dusun}
                    unit="dusun"
                    icon={MapPin}
                  />
                  <StatBox
                    label="Jumlah RW"
                    value={p.jumlah_rw}
                    unit="RW"
                    icon={MapPin}
                  />
                  <StatBox
                    label="Jenis Layanan"
                    value={12}
                    unit="layanan"
                    icon={ChevronRight}
                  />
                </div>
                <style>{`
                  @media (max-width: 640px) { .stats-grid2 { grid-template-columns: repeat(2, 1fr) !important; } }
                `}</style>
              </div>
            )}

            {/* ── Visi Misi ── */}
            {activeTab === "visi-misi" && (
              <div style={{ display: "grid", gap: "1.5rem" }}>
                <div
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    padding: "2rem",
                    border: "1px solid #dcfce7",
                    borderLeft: "4px solid #16a34a",
                    boxShadow: "0 2px 12px rgba(22,163,74,0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <div
                      style={{
                        width: "2.25rem",
                        height: "2.25rem",
                        background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Target size={16} color="#16a34a" />
                    </div>
                    <h2
                      style={{
                        fontFamily: "'Lora', serif",
                        fontWeight: 700,
                        color: "#14532d",
                        fontSize: "1.2rem",
                      }}
                    >
                      Visi
                    </h2>
                  </div>
                  <blockquote
                    style={{
                      fontFamily: "'Lora', serif",
                      fontSize: "1rem",
                      color: "#1f2937",
                      lineHeight: 1.8,
                      fontStyle: "italic",
                      borderLeft: "none",
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    "{p.visi}"
                  </blockquote>
                </div>

                <div
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    padding: "2rem",
                    border: "1px solid #dcfce7",
                    borderLeft: "4px solid #22c55e",
                    boxShadow: "0 2px 12px rgba(22,163,74,0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <div
                      style={{
                        width: "2.25rem",
                        height: "2.25rem",
                        background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Leaf size={16} color="#16a34a" />
                    </div>
                    <h2
                      style={{
                        fontFamily: "'Lora', serif",
                        fontWeight: 700,
                        color: "#14532d",
                        fontSize: "1.2rem",
                      }}
                    >
                      Misi
                    </h2>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.875rem",
                    }}
                  >
                    {p.misi.split("\n").map((line, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: "0.75rem",
                          alignItems: "flex-start",
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: "0.875rem",
                          color: "#374151",
                          lineHeight: 1.7,
                        }}
                      >
                        <span
                          style={{
                            width: "1.5rem",
                            height: "1.5rem",
                            background:
                              "linear-gradient(135deg, #15803d, #16a34a)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            fontSize: "0.65rem",
                            color: "white",
                            fontWeight: 700,
                            marginTop: "1px",
                          }}
                        >
                          {i + 1}
                        </span>
                        {line.replace(/^\d+\.\s*/, "")}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Sejarah ── */}
            {activeTab === "sejarah" && (
              <div
                style={{
                  background: "white",
                  borderRadius: "20px",
                  padding: "2.5rem",
                  border: "1px solid #dcfce7",
                  boxShadow: "0 2px 12px rgba(22,163,74,0.06)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <BookOpen size={18} color="#16a34a" />
                  </div>
                  <h2
                    style={{
                      fontFamily: "'Lora', serif",
                      fontWeight: 700,
                      color: "#14532d",
                      fontSize: "1.25rem",
                    }}
                  >
                    Sejarah {p.nama_desa}
                  </h2>
                </div>

                <div
                  style={{
                    borderLeft: "3px solid #bbf7d0",
                    paddingLeft: "1.5rem",
                    marginLeft: "0.5rem",
                  }}
                >
                  {p.sejarah
                    .split("\n")
                    .filter(Boolean)
                    .map((para, i) => (
                      <p
                        key={i}
                        style={{
                          fontFamily: "'Lora', serif",
                          fontSize: "0.95rem",
                          color: "#374151",
                          lineHeight: 1.9,
                          marginBottom: "1rem",
                        }}
                      >
                        {para}
                      </p>
                    ))}
                </div>
              </div>
            )}

            {/* ── Lokasi ── */}
            {activeTab === "lokasi" && (
              <div style={{ display: "grid", gap: "1.5rem" }}>
                <div
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    padding: "1.75rem",
                    border: "1px solid #dcfce7",
                    boxShadow: "0 2px 12px rgba(22,163,74,0.06)",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "'Lora', serif",
                      fontWeight: 700,
                      color: "#14532d",
                      fontSize: "1.1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    Alamat Kantor
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "flex-start",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "0.875rem",
                      color: "#374151",
                    }}
                  >
                    <MapPin
                      size={18}
                      color="#16a34a"
                      style={{ flexShrink: 0, marginTop: 2 }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                        {p.nama_desa}
                      </div>
                      <div style={{ color: "#6b7280", lineHeight: 1.6 }}>
                        {p.alamat}
                      </div>
                      <div style={{ color: "#6b7280" }}>
                        {p.kecamatan}, {p.kabupaten}
                      </div>
                      <div style={{ color: "#6b7280" }}>
                        {p.provinsi} {p.kode_pos}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Maps embed placeholder */}
                <div
                  style={{
                    background: "#f0fdf4",
                    borderRadius: "20px",
                    border: "2px dashed #86efac",
                    height: "360px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.875rem",
                    color: "#16a34a",
                  }}
                >
                  <Map size={40} style={{ opacity: 0.4 }} />
                  <div
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "0.875rem",
                      color: "#4b5563",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 600,
                        color: "#15803d",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Peta Google Maps
                    </p>
                    <p style={{ fontSize: "0.8rem" }}>
                      Embed peta akan ditampilkan di sini
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#9ca3af",
                        marginTop: "0.5rem",
                      }}
                    >
                      Konfigurasikan Maps Embed di halaman admin → Profil Desa
                    </p>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(p.alamat)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      padding: "0.5rem 1rem",
                      background: "#16a34a",
                      color: "white",
                      borderRadius: "9999px",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    <MapPin size={12} /> Buka di Google Maps
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) { .profil-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>
    </div>
  );
};

export default ProfilDesaPage;
