// frontend/src/pages/public/Kontak/index.jsx
import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  Globe,
} from "lucide-react";

const FacebookIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const InstagramIcon = ({ size = 16 }) => (
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
const YoutubeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);

const CONTACT_INFO = [
  {
    icon: MapPin,
    title: "Alamat Kantor",
    lines: [
      "Jl. Raya Desa Maju No. 1",
      "Kecamatan Sejahtera, Kabupaten Makmur",
      "Jawa Timur 61254",
    ],
    color: "#16a34a",
    bg: "#f0fdf4",
  },
  {
    icon: Phone,
    title: "Telepon & WhatsApp",
    lines: ["(031) 123-4567", "WhatsApp: 081234567890"],
    color: "#0284c7",
    bg: "#f0f9ff",
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["info@desamaju.go.id", "admin@desamaju.go.id"],
    color: "#7c3aed",
    bg: "#faf5ff",
  },
  {
    icon: Clock,
    title: "Jam Layanan",
    lines: [
      "Senin – Jumat: 08.00 – 15.00",
      "Istirahat: 12.00 – 13.00",
      "Sabtu & Minggu: Tutup",
    ],
    color: "#d97706",
    bg: "#fffbeb",
  },
];

const InputStyle = {
  width: "100%",
  padding: "0.875rem 1rem",
  border: "1.5px solid #e5e7eb",
  borderRadius: "12px",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontSize: "0.875rem",
  color: "#1f2937",
  background: "white",
  transition: "all 0.2s",
  outline: "none",
  boxSizing: "border-box",
};

const Label = ({ children, required }) => (
  <label
    style={{
      display: "block",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: "0.8rem",
      fontWeight: 600,
      color: "#374151",
      marginBottom: "0.5rem",
    }}
  >
    {children} {required && <span style={{ color: "#ef4444" }}>*</span>}
  </label>
);

const KontakPage = () => {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    whatsapp: "",
    topik: "",
    pesan: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState("");

  const validate = () => {
    const e = {};
    if (!form.nama.trim()) e.nama = "Nama wajib diisi";
    if (!form.email.trim()) e.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Format email tidak valid";
    if (!form.pesan.trim()) e.pesan = "Pesan wajib diisi";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    // TODO: integrate with API
    setSubmitted(true);
  };

  const handleChange = (field, val) => {
    setForm((f) => ({ ...f, [field]: val }));
    if (errors[field])
      setErrors((e) => {
        const n = { ...e };
        delete n[field];
        return n;
      });
  };

  const focusStyle = (field) =>
    focused === field
      ? { borderColor: "#16a34a", boxShadow: "0 0 0 3px rgba(22,163,74,0.12)" }
      : {};
  const errorStyle = (field) =>
    errors[field] ? { borderColor: "#ef4444" } : {};

  return (
    <div>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* ── Hero ── */}
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
            HUBUNGI KAMI
          </span>
          <h1
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: "white",
              marginBottom: "0.875rem",
            }}
          >
            Kami Siap Membantu Anda
          </h1>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "0.9rem",
              color: "#bbf7d0",
              lineHeight: 1.8,
              maxWidth: "440px",
              margin: "0 auto",
            }}
          >
            Punya pertanyaan atau butuh bantuan? Jangan ragu untuk menghubungi
            kami melalui formulir di bawah atau kunjungi kantor desa kami.
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

      {/* ── Info Cards ── */}
      <section style={{ padding: "3.5rem 1.5rem 0", background: "#fefdf8" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1.25rem",
            }}
            className="contact-cards"
          >
            {CONTACT_INFO.map(({ icon: Icon, title, lines, color, bg }, i) => (
              <div
                key={title}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                  transition: "all 0.3s",
                  animation: `fadeUp 0.5s ease ${i * 80}ms both`,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 28px rgba(0,0,0,0.1)";
                  e.currentTarget.style.borderColor = "#dcfce7";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 10px rgba(0,0,0,0.04)";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              >
                <div
                  style={{
                    width: "2.75rem",
                    height: "2.75rem",
                    background: bg,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <Icon size={18} color={color} />
                </div>
                <h3
                  style={{
                    fontFamily: "'Lora', serif",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: "#14532d",
                    marginBottom: "0.625rem",
                  }}
                >
                  {title}
                </h3>
                {lines.map((line, j) => (
                  <p
                    key={j}
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "0.78rem",
                      color: j === 0 ? "#374151" : "#6b7280",
                      lineHeight: 1.6,
                      fontWeight: j === 0 ? 500 : 400,
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
          <style>{`
            @media (max-width: 900px) { .contact-cards { grid-template-columns: repeat(2, 1fr) !important; } }
            @media (max-width: 480px) { .contact-cards { grid-template-columns: 1fr !important; } }
          `}</style>
        </div>
      </section>

      {/* ── Form & WhatsApp ── */}
      <section style={{ padding: "3.5rem 1.5rem 5rem", background: "#fefdf8" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 380px",
              gap: "2rem",
              alignItems: "start",
            }}
            className="form-grid"
          >
            {/* Form */}
            <div
              style={{
                background: "white",
                borderRadius: "24px",
                padding: "2.5rem",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}
            >
              {submitted ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "3rem 0",
                    animation: "scaleIn 0.4s ease both",
                  }}
                >
                  <div
                    style={{
                      width: "5rem",
                      height: "5rem",
                      background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1.25rem",
                    }}
                  >
                    <CheckCircle size={36} color="#16a34a" />
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Lora', serif",
                      fontWeight: 700,
                      color: "#14532d",
                      fontSize: "1.25rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Pesan Terkirim!
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      lineHeight: 1.7,
                      maxWidth: "320px",
                      margin: "0 auto 1.5rem",
                    }}
                  >
                    Terima kasih telah menghubungi kami. Tim kami akan segera
                    merespons pesan Anda.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        nama: "",
                        email: "",
                        whatsapp: "",
                        topik: "",
                        pesan: "",
                      });
                    }}
                    style={{
                      padding: "0.625rem 1.5rem",
                      background: "#f0fdf4",
                      color: "#16a34a",
                      border: "1.5px solid #dcfce7",
                      borderRadius: "9999px",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      cursor: "pointer",
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
                    Kirim Pesan Lagi
                  </button>
                </div>
              ) : (
                <>
                  <h2
                    style={{
                      fontFamily: "'Lora', serif",
                      fontWeight: 700,
                      color: "#14532d",
                      fontSize: "1.375rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Kirim Pesan
                  </h2>
                  <p
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "0.825rem",
                      color: "#6b7280",
                      marginBottom: "2rem",
                    }}
                  >
                    Isi formulir di bawah dan kami akan merespons dalam 1×24 jam
                    kerja.
                  </p>

                  <form
                    onSubmit={handleSubmit}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.25rem",
                    }}
                  >
                    {/* Nama & Email */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "1rem",
                      }}
                      className="form-row"
                    >
                      <div>
                        <Label required>Nama Lengkap</Label>
                        <input
                          type="text"
                          placeholder="Ahmad Santoso"
                          value={form.nama}
                          onChange={(e) => handleChange("nama", e.target.value)}
                          onFocus={() => setFocused("nama")}
                          onBlur={() => setFocused("")}
                          style={{
                            ...InputStyle,
                            ...focusStyle("nama"),
                            ...errorStyle("nama"),
                          }}
                        />
                        {errors.nama && (
                          <p
                            style={{
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                              fontSize: "0.72rem",
                              color: "#ef4444",
                              marginTop: "0.3rem",
                            }}
                          >
                            {errors.nama}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label required>Email</Label>
                        <input
                          type="email"
                          placeholder="email@contoh.com"
                          value={form.email}
                          onChange={(e) =>
                            handleChange("email", e.target.value)
                          }
                          onFocus={() => setFocused("email")}
                          onBlur={() => setFocused("")}
                          style={{
                            ...InputStyle,
                            ...focusStyle("email"),
                            ...errorStyle("email"),
                          }}
                        />
                        {errors.email && (
                          <p
                            style={{
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                              fontSize: "0.72rem",
                              color: "#ef4444",
                              marginTop: "0.3rem",
                            }}
                          >
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* WhatsApp & Topik */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "1rem",
                      }}
                      className="form-row"
                    >
                      <div>
                        <Label>No. WhatsApp</Label>
                        <input
                          type="tel"
                          placeholder="08xxxxxxxxxx"
                          value={form.whatsapp}
                          onChange={(e) =>
                            handleChange("whatsapp", e.target.value)
                          }
                          onFocus={() => setFocused("whatsapp")}
                          onBlur={() => setFocused("")}
                          style={{ ...InputStyle, ...focusStyle("whatsapp") }}
                        />
                      </div>
                      <div>
                        <Label>Topik</Label>
                        <select
                          value={form.topik}
                          onChange={(e) =>
                            handleChange("topik", e.target.value)
                          }
                          onFocus={() => setFocused("topik")}
                          onBlur={() => setFocused("")}
                          style={{
                            ...InputStyle,
                            ...focusStyle("topik"),
                            cursor: "pointer",
                          }}
                        >
                          <option value="">— Pilih topik —</option>
                          <option value="surat-pengantar">
                            Surat Pengantar
                          </option>
                          <option value="surat-keterangan">
                            Surat Keterangan
                          </option>
                          <option value="kependudukan">
                            Layanan Kependudukan
                          </option>
                          <option value="pengaduan">Pengaduan</option>
                          <option value="lainnya">Lainnya</option>
                        </select>
                      </div>
                    </div>

                    {/* Pesan */}
                    <div>
                      <Label required>Pesan</Label>
                      <textarea
                        rows={5}
                        placeholder="Tuliskan pesan atau pertanyaan Anda..."
                        value={form.pesan}
                        onChange={(e) => handleChange("pesan", e.target.value)}
                        onFocus={() => setFocused("pesan")}
                        onBlur={() => setFocused("")}
                        style={{
                          ...InputStyle,
                          resize: "vertical",
                          ...focusStyle("pesan"),
                          ...errorStyle("pesan"),
                        }}
                      />
                      {errors.pesan && (
                        <p
                          style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: "0.72rem",
                            color: "#ef4444",
                            marginTop: "0.3rem",
                          }}
                        >
                          {errors.pesan}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        padding: "0.875rem",
                        background: "linear-gradient(135deg, #15803d, #16a34a)",
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 4px 14px rgba(22,163,74,0.3)",
                        transition: "all 0.2s",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 24px rgba(22,163,74,0.4)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 14px rgba(22,163,74,0.3)";
                      }}
                    >
                      <Send size={16} /> Kirim Pesan
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {/* WhatsApp CTA */}
              <div
                style={{
                  background: "linear-gradient(135deg, #15803d, #16a34a)",
                  borderRadius: "20px",
                  padding: "1.75rem",
                  boxShadow: "0 8px 24px rgba(22,163,74,0.25)",
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
                    marginBottom: "1rem",
                  }}
                >
                  <MessageCircle size={22} color="white" />
                </div>
                <h3
                  style={{
                    fontFamily: "'Lora', serif",
                    fontWeight: 700,
                    color: "white",
                    fontSize: "1.1rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  Chat via WhatsApp
                </h3>
                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "0.8rem",
                    color: "#bbf7d0",
                    lineHeight: 1.7,
                    marginBottom: "1.25rem",
                  }}
                >
                  Respon lebih cepat melalui WhatsApp. Tim kami aktif pada jam
                  kerja.
                </p>
                <a
                  href="https://wa.me/6281234567890?text=Halo%20admin%20Desa%20Maju%2C%20saya%20ingin%20bertanya..."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.75rem",
                    background: "white",
                    color: "#15803d",
                    borderRadius: "10px",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.15)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <MessageCircle size={16} /> Mulai Chat WhatsApp
                </a>
              </div>

              {/* Sosial Media */}
              <div
                style={{
                  background: "white",
                  borderRadius: "20px",
                  padding: "1.5rem",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
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
                  Ikuti Sosial Media Kami
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.625rem",
                  }}
                >
                  {[
                    {
                      icon: FacebookIcon,
                      label: "Facebook",
                      handle: "@DesMaju",
                      color: "#1877f2",
                      bg: "#eff6ff",
                    },
                    {
                      icon: InstagramIcon,
                      label: "Instagram",
                      handle: "@desamaju.official",
                      color: "#e1306c",
                      bg: "#fdf2f8",
                    },
                    {
                      icon: YoutubeIcon,
                      label: "YouTube",
                      handle: "Desa Maju TV",
                      color: "#ff0000",
                      bg: "#fff5f5",
                    },
                    {
                      icon: Globe,
                      label: "Website",
                      handle: "desamaju.go.id",
                      color: "#16a34a",
                      bg: "#f0fdf4",
                    },
                  ].map(({ icon: Icon, label, handle, color, bg }) => (
                    <a
                      key={label}
                      href="#"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.625rem 0.875rem",
                        borderRadius: "10px",
                        background: bg,
                        textDecoration: "none",
                        transition: "all 0.2s",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateX(3px)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      <Icon size={16} color={color} style={{ flexShrink: 0 }} />
                      <div>
                        <div
                          style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: "0.72rem",
                            color: "#9ca3af",
                            fontWeight: 500,
                          }}
                        >
                          {label}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: "0.8rem",
                            color,
                            fontWeight: 600,
                          }}
                        >
                          {handle}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <style>{`
            @media (max-width: 800px) {
              .form-grid { grid-template-columns: 1fr !important; }
              .form-row { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </section>
    </div>
  );
};

export default KontakPage;
