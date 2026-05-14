/* eslint-disable no-unused-vars */
// frontend/src/pages/public/Home/index.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  Users,
  MapPin,
  Phone,
  Star,
  ChevronRight,
  Building2,
  Clock,
  CheckCircle2,
  Leaf,
  Shield,
  Zap,
  Heart,
} from "lucide-react";

// ── Animasi counter ──
const useCounter = (target, duration = 1500, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start || !target) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, start, duration]);
  return count;
};

// ── Counter Card ──
const StatCard = ({
  value,
  suffix = "",
  label,
  icon: Icon,
  delay = 0,
  started,
}) => {
  const count = useCounter(value, 1400, started);
  return (
    <div
      style={{
        textAlign: "center",
        padding: "1.5rem",
        animation: `fadeUp 0.6s ease ${delay}ms both`,
      }}
    >
      <div
        style={{
          width: "3rem",
          height: "3rem",
          background: "rgba(255,255,255,0.15)",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 0.75rem",
        }}
      >
        <Icon size={22} color="white" />
      </div>
      <div
        style={{
          fontSize: "2.25rem",
          fontWeight: 700,
          color: "white",
          lineHeight: 1,
          fontFamily: "'Lora', serif",
        }}
      >
        {count.toLocaleString("id-ID")}
        {suffix}
      </div>
      <div
        style={{
          fontSize: "0.8rem",
          color: "#bbf7d0",
          marginTop: "0.375rem",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ── Service Card ──
const ServiceCard = ({ icon, title, desc, delay }) => (
  <div
    style={{
      background: "white",
      borderRadius: "16px",
      padding: "1.75rem",
      border: "1px solid #dcfce7",
      transition: "all 0.3s ease",
      cursor: "default",
      animation: `fadeUp 0.6s ease ${delay}ms both`,
      boxShadow: "0 2px 12px rgba(22,163,74,0.06)",
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 12px 32px rgba(22,163,74,0.15)";
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
        width: "3rem",
        height: "3rem",
        background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "1rem",
      }}
    >
      {icon}
    </div>
    <h3
      style={{
        fontFamily: "'Lora', serif",
        fontWeight: 600,
        fontSize: "1rem",
        color: "#14532d",
        marginBottom: "0.5rem",
      }}
    >
      {title}
    </h3>
    <p
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: "0.825rem",
        color: "#4b5563",
        lineHeight: 1.7,
      }}
    >
      {desc}
    </p>
  </div>
);

// ── Main ──
const HomePage = () => {
  const statsRef = useRef(null);
  const [statsStarted, setStatsStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsStarted(true);
      },
      { threshold: 0.3 },
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const services = [
    {
      icon: <FileText size={22} color="#16a34a" />,
      title: "Surat Pengantar",
      desc: "Layanan pembuatan surat pengantar untuk berbagai keperluan administratif warga desa.",
    },
    {
      icon: <Shield size={22} color="#16a34a" />,
      title: "Surat Keterangan",
      desc: "Penerbitan surat keterangan domisili, usaha, tidak mampu, dan berbagai keterangan lainnya.",
    },
    {
      icon: <Users size={22} color="#16a34a" />,
      title: "Layanan Kependudukan",
      desc: "Administrasi data kependudukan, KTP, KK, dan dokumen kependudukan lainnya.",
    },
    {
      icon: <Zap size={22} color="#16a34a" />,
      title: "Perizinan Cepat",
      desc: "Proses perizinan usaha mikro dan izin kegiatan masyarakat yang cepat dan transparan.",
    },
    {
      icon: <Heart size={22} color="#16a34a" />,
      title: "Bantuan Sosial",
      desc: "Administrasi dan verifikasi data penerima bantuan sosial dari berbagai program pemerintah.",
    },
    {
      icon: <Building2 size={22} color="#16a34a" />,
      title: "Aset & Infrastruktur",
      desc: "Pengelolaan dokumen aset desa dan laporan infrastruktur untuk kepentingan warga.",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Datang ke Kantor",
      desc: "Kunjungi kantor desa pada jam layanan yang tersedia.",
    },
    {
      num: "02",
      title: "Isi Formulir",
      desc: "Lengkapi formulir sesuai jenis layanan yang dibutuhkan.",
    },
    {
      num: "03",
      title: "Proses Dokumen",
      desc: "Petugas memproses dokumen Anda secara cepat dan tepat.",
    },
    {
      num: "04",
      title: "Terima Dokumen",
      desc: "Dokumen selesai dan siap diambil atau dikirim.",
    },
  ];

  return (
    <div>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 0.375rem;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          padding: 0.375rem 0.875rem;
          border-radius: 9999px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.75rem; font-weight: 500; color: white;
          margin-bottom: 1.5rem;
          backdrop-filter: blur(8px);
          animation: fadeUp 0.6s ease both;
        }
        .hero-float {
          animation: float 4s ease-in-out infinite;
        }
        .step-line::after {
          content: '';
          position: absolute;
          top: 1.25rem; left: calc(50% + 1.75rem);
          width: calc(100% - 3.5rem);
          height: 2px;
          background: linear-gradient(to right, #bbf7d0, transparent);
        }
      `}</style>

      {/* ── Hero ── */}
      <section
        style={{
          minHeight: "calc(100vh - 4rem)",
          background:
            "linear-gradient(135deg, #052e16 0%, #14532d 35%, #15803d 65%, #16a34a 100%)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(74,222,128,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-15%",
            left: "-10%",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "5rem 1.5rem",
            position: "relative",
            zIndex: 1,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4rem",
              alignItems: "center",
            }}
            className="hero-grid"
          >
            {/* Left */}
            <div>
              <div className="hero-badge">
                <Leaf size={12} />
                Pelayanan Publik Digital
              </div>
              <h1
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: "clamp(2rem, 4vw, 3.25rem)",
                  fontWeight: 700,
                  color: "white",
                  lineHeight: 1.2,
                  marginBottom: "1.25rem",
                  animation: "fadeUp 0.6s ease 0.1s both",
                }}
              >
                Layanan Desa
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #4ade80, #86efac)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Cepat & Transparan
                </span>
              </h1>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "1rem",
                  color: "#bbf7d0",
                  lineHeight: 1.8,
                  marginBottom: "2rem",
                  animation: "fadeUp 0.6s ease 0.2s both",
                  maxWidth: "420px",
                }}
              >
                Sistem persuratan digital Desa Maju hadir untuk memudahkan warga
                dalam mengurus administrasi dan layanan desa secara efisien.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "0.875rem",
                  flexWrap: "wrap",
                  animation: "fadeUp 0.6s ease 0.3s both",
                }}
              >
                <Link
                  to="/layanan"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.875rem 1.75rem",
                    background: "white",
                    color: "#15803d",
                    borderRadius: "9999px",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    textDecoration: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 28px rgba(0,0,0,0.25)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 20px rgba(0,0,0,0.2)";
                  }}
                >
                  Lihat Layanan <ArrowRight size={16} />
                </Link>
                <Link
                  to="/kontak"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.875rem 1.75rem",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    color: "white",
                    borderRadius: "9999px",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    textDecoration: "none",
                    backdropFilter: "blur(8px)",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.18)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  }}
                >
                  Hubungi Kami
                </Link>
              </div>

              {/* Trust badges */}
              <div
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  marginTop: "2.5rem",
                  animation: "fadeUp 0.6s ease 0.4s both",
                }}
              >
                {[
                  { icon: <CheckCircle2 size={14} />, text: "Terpercaya" },
                  { icon: <Clock size={14} />, text: "Proses Cepat" },
                  { icon: <Star size={14} />, text: "Pelayanan Prima" },
                ].map(({ icon, text }) => (
                  <div
                    key={text}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "0.75rem",
                      color: "#86efac",
                    }}
                  >
                    {icon} {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right – floating card illustration */}
            <div
              className="hero-float"
              style={{
                display: "flex",
                justifyContent: "center",
                animation: "float 5s ease-in-out infinite",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "24px",
                  padding: "2rem",
                  width: "100%",
                  maxWidth: "320px",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
                }}
              >
                <div
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    padding: "1.25rem",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.875rem",
                  }}
                >
                  <div
                    style={{
                      width: "2.75rem",
                      height: "2.75rem",
                      background: "linear-gradient(135deg, #4ade80, #22c55e)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={18} color="white" />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Lora', serif",
                        fontWeight: 600,
                        color: "white",
                        fontSize: "0.9rem",
                      }}
                    >
                      Surat Masuk
                    </div>
                    <div
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: "0.75rem",
                        color: "#86efac",
                      }}
                    >
                      Diproses hari ini
                    </div>
                  </div>
                </div>
                {[
                  {
                    label: "Total Surat Masuk",
                    val: "1,240",
                    color: "#4ade80",
                  },
                  { label: "Surat Keluar", val: "892", color: "#86efac" },
                  { label: "Sedang Diproses", val: "37", color: "#fbbf24" },
                  { label: "Selesai Bulan Ini", val: "156", color: "#34d399" },
                ].map(({ label, val, color }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.625rem 0",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    <span style={{ fontSize: "0.78rem", color: "#bbf7d0" }}>
                      {label}
                    </span>
                    <span
                      style={{ fontSize: "0.875rem", fontWeight: 700, color }}
                    >
                      {val}
                    </span>
                  </div>
                ))}
                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                  <span
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "0.7rem",
                      color: "#6ee7b7",
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: "6px",
                      padding: "0.25rem 0.75rem",
                    }}
                  >
                    ✦ Update Otomatis
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 60L1440 60L1440 20C1200 60 800 0 400 40C200 60 100 20 0 40L0 60Z"
              fill="#fefdf8"
            />
          </svg>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .hero-grid { grid-template-columns: 1fr !important; }
            .hero-grid > div:last-child { display: none !important; }
          }
        `}</style>
      </section>

      {/* ── Stats ── */}
      <section
        ref={statsRef}
        style={{
          background: "linear-gradient(135deg, #15803d, #16a34a)",
          padding: "3rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "0.5rem",
            }}
            className="stats-grid"
          >
            <StatCard
              value={5240}
              suffix="+"
              label="Total Warga Terlayani"
              icon={Users}
              delay={0}
              started={statsStarted}
            />
            <StatCard
              value={1240}
              label="Surat Diproses"
              icon={FileText}
              delay={100}
              started={statsStarted}
            />
            <StatCard
              value={12}
              label="Jenis Layanan"
              icon={Star}
              delay={200}
              started={statsStarted}
            />
            <StatCard
              value={99}
              suffix="%"
              label="Tingkat Kepuasan"
              icon={Heart}
              delay={300}
              started={statsStarted}
            />
          </div>
        </div>
        <style>{`
          @media (max-width: 640px) { .stats-grid { grid-template-columns: repeat(2,1fr) !important; } }
        `}</style>
      </section>

      {/* ── Layanan ── */}
      <section
        style={{ padding: "5rem 1.5rem", background: "#fefdf8" }}
        className="leaf-bg"
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span
              style={{
                display: "inline-block",
                background: "#dcfce7",
                color: "#15803d",
                padding: "0.25rem 0.875rem",
                borderRadius: "9999px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
                marginBottom: "0.875rem",
              }}
            >
              LAYANAN KAMI
            </span>
            <h2
              style={{
                fontFamily: "'Lora', serif",
                fontSize: "2rem",
                fontWeight: 700,
                color: "#14532d",
                marginBottom: "0.75rem",
              }}
            >
              Apa yang Bisa Kami Bantu?
            </h2>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.9rem",
                color: "#4b5563",
                maxWidth: "480px",
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Berbagai layanan administrasi dan persuratan yang siap membantu
              kebutuhan warga desa.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.25rem",
            }}
            className="services-grid"
          >
            {services.map((s, i) => (
              <ServiceCard key={s.title} {...s} delay={i * 80} />
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <Link
              to="/layanan"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.875rem 2rem",
                background: "#15803d",
                color: "white",
                borderRadius: "9999px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
                transition: "all 0.2s",
                boxShadow: "0 4px 14px rgba(22,163,74,0.3)",
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
              Lihat Semua Layanan <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) { .services-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 580px) { .services-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ── Cara Kerja ── */}
      <section style={{ padding: "5rem 1.5rem", background: "#f0fdf4" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span
              style={{
                display: "inline-block",
                background: "#dcfce7",
                color: "#15803d",
                padding: "0.25rem 0.875rem",
                borderRadius: "9999px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
                marginBottom: "0.875rem",
              }}
            >
              CARA KERJA
            </span>
            <h2
              style={{
                fontFamily: "'Lora', serif",
                fontSize: "2rem",
                fontWeight: 700,
                color: "#14532d",
                marginBottom: "0.75rem",
              }}
            >
              Proses yang Mudah & Cepat
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1.5rem",
            }}
            className="steps-grid"
          >
            {steps.map((s, i) => (
              <div
                key={s.num}
                style={{ textAlign: "center", position: "relative" }}
              >
                {i < steps.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "1.5rem",
                      left: "calc(50% + 2rem)",
                      width: "calc(100% - 4rem)",
                      height: "2px",
                      background: "linear-gradient(to right, #86efac, #dcfce7)",
                    }}
                  />
                )}
                <div
                  style={{
                    width: "3rem",
                    height: "3rem",
                    background: "linear-gradient(135deg, #15803d, #16a34a)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.25rem",
                    fontFamily: "'Lora', serif",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    color: "white",
                    boxShadow: "0 4px 14px rgba(22,163,74,0.3)",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {s.num}
                </div>
                <h3
                  style={{
                    fontFamily: "'Lora', serif",
                    fontWeight: 600,
                    color: "#14532d",
                    fontSize: "0.9rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "0.8rem",
                    color: "#4b5563",
                    lineHeight: 1.6,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 640px) { .steps-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        `}</style>
      </section>

      {/* ── CTA Banner ── */}
      <section
        style={{
          padding: "4rem 1.5rem",
          background:
            "linear-gradient(135deg, #052e16 0%, #14532d 50%, #15803d 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-30%",
            right: "-5%",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
          }}
        >
          <h2
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "2rem",
              fontWeight: 700,
              color: "white",
              marginBottom: "1rem",
            }}
          >
            Butuh Bantuan Layanan Desa?
          </h2>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "0.9rem",
              color: "#bbf7d0",
              lineHeight: 1.8,
              marginBottom: "2rem",
            }}
          >
            Tim kami siap membantu Anda dalam mengurus berbagai administrasi
            desa. Datangi kantor kami atau hubungi langsung via WhatsApp.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/kontak"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.875rem 1.75rem",
                background: "white",
                color: "#15803d",
                borderRadius: "9999px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: "0.875rem",
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <Phone size={16} /> Hubungi Kami
            </Link>
            <Link
              to="/layanan"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.875rem 1.75rem",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "white",
                borderRadius: "9999px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
              }}
            >
              <ChevronRight size={16} /> Lihat Layanan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
