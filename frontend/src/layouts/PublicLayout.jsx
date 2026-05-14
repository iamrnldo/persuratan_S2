/* eslint-disable react-hooks/set-state-in-effect */
// frontend/src/layouts/PublicLayout.jsx
import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Menu, X, MapPin, Phone, Mail, ChevronUp, Leaf } from "lucide-react";

// Social icons — lucide-react tidak menyediakan brand icons
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

const NAV_LINKS = [
  { to: "/", label: "Beranda" },
  { to: "/profil-desa", label: "Profil Desa" },
  { to: "/layanan", label: "Layanan" },
  { to: "/kontak", label: "Kontak" },
];

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "'Lora', 'Georgia', serif" }}
    >
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --green-50: #f0fdf4;
          --green-100: #dcfce7;
          --green-200: #bbf7d0;
          --green-400: #4ade80;
          --green-500: #22c55e;
          --green-600: #16a34a;
          --green-700: #15803d;
          --green-800: #166534;
          --green-900: #14532d;
          --green-950: #052e16;
          --gold: #d4a843;
          --cream: #fefdf8;
        }

        body { background: var(--cream); color: #1a2e1a; }

        .pub-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: all 0.4s ease;
        }
        .pub-nav.scrolled {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #dcfce7;
          box-shadow: 0 2px 20px rgba(22,163,74,0.08);
        }
        .pub-nav.top {
          background: transparent;
        }

        .nav-link {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          color: inherit;
          text-decoration: none;
          padding: 0.5rem 0;
          position: relative;
          transition: color 0.2s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: var(--green-600);
          transform: scaleX(0);
          transition: transform 0.25s ease;
        }
        .nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); }
        .nav-link.active { color: var(--green-700); font-weight: 600; }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          background: var(--green-600);
          color: white;
          border-radius: 9999px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          border: none; cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(22,163,74,0.3);
        }
        .btn-primary:hover {
          background: var(--green-700);
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(22,163,74,0.4);
        }

        .pub-footer {
          background: var(--green-950);
          color: #a7f3d0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .footer-link {
          color: #6ee7b7;
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s;
        }
        .footer-link:hover { color: white; }

        .back-top {
          position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 99;
          width: 2.5rem; height: 2.5rem;
          background: var(--green-600);
          color: white;
          border: none; border-radius: 9999px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(22,163,74,0.4);
          transition: all 0.3s;
          opacity: 0; pointer-events: none;
        }
        .back-top.visible { opacity: 1; pointer-events: auto; }
        .back-top:hover { background: var(--green-700); transform: translateY(-2px); }

        /* Decorative leaf pattern bg */
        .leaf-bg {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316a34a' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav className={`pub-nav ${scrolled ? "scrolled" : "top"}`}>
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "4rem",
            }}
          >
            {/* Logo */}
            <Link
              to="/"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
              }}
            >
              <div
                style={{
                  width: "2.25rem",
                  height: "2.25rem",
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(22,163,74,0.3)",
                }}
              >
                <Leaf size={18} color="white" />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Lora', serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: scrolled ? "#14532d" : "#14532d",
                    lineHeight: 1.2,
                  }}
                >
                  Desa Maju
                </div>
                <div
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "0.65rem",
                    color: scrolled ? "#16a34a" : "#16a34a",
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                  }}
                >
                  PERSURATAN DIGITAL
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <div
              style={{ display: "flex", alignItems: "center", gap: "2rem" }}
              className="desktop-nav"
            >
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`nav-link ${isActive(l.to) ? "active" : ""}`}
                  style={{ color: scrolled ? "#1a2e1a" : "#1a2e1a" }}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/admin/login"
                className="btn-primary"
                style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }}
              >
                Admin Login
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#14532d",
                display: "none",
              }}
              className="mobile-menu-btn"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            style={{
              background: "white",
              borderTop: "1px solid #dcfce7",
              padding: "1rem 1.5rem",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  display: "block",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid #f0fdf4",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: isActive(l.to) ? 600 : 400,
                  color: isActive(l.to) ? "#16a34a" : "#1a2e1a",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/admin/login"
              className="btn-primary"
              style={{ marginTop: "0.75rem", display: "inline-flex" }}
            >
              Admin Login
            </Link>
          </div>
        )}

        <style>{`
          @media (max-width: 768px) {
            .desktop-nav { display: none !important; }
            .mobile-menu-btn { display: block !important; }
          }
        `}</style>
      </nav>

      {/* ── Page Content ── */}
      <main style={{ flex: 1, paddingTop: "4rem" }}>
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="pub-footer">
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "3rem 1.5rem 1.5rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2rem",
              marginBottom: "2rem",
            }}
          >
            {/* Brand */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    width: "2rem",
                    height: "2rem",
                    background: "#16a34a",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Leaf size={14} color="white" />
                </div>
                <span
                  style={{
                    fontFamily: "'Lora', serif",
                    fontWeight: 700,
                    color: "white",
                    fontSize: "1.1rem",
                  }}
                >
                  Desa Maju
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.8rem",
                  lineHeight: 1.8,
                  color: "#6ee7b7",
                  maxWidth: "220px",
                }}
              >
                Sistem Persuratan Digital untuk pelayanan warga yang lebih cepat
                dan transparan.
              </p>
              <div
                style={{ display: "flex", gap: "0.625rem", marginTop: "1rem" }}
              >
                {[FacebookIcon, InstagramIcon, YoutubeIcon].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    style={{
                      width: "2rem",
                      height: "2rem",
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6ee7b7",
                      transition: "all 0.2s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#16a34a";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.08)";
                      e.currentTarget.style.color = "#6ee7b7";
                    }}
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigasi */}
            <div>
              <h4
                style={{
                  color: "white",
                  fontFamily: "'Lora', serif",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                }}
              >
                Navigasi
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {NAV_LINKS.map((l) => (
                  <Link key={l.to} to={l.to} className="footer-link">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Kontak */}
            <div>
              <h4
                style={{
                  color: "white",
                  fontFamily: "'Lora', serif",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                }}
              >
                Kontak Kami
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.625rem",
                }}
              >
                {[
                  { Icon: MapPin, text: "Jl. Raya Desa No. 1, Kecamatan Maju" },
                  { Icon: Phone, text: "(031) 123-4567" },
                  { Icon: Mail, text: "info@desamaju.go.id" },
                ].map(({ Icon, text }, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <Icon
                      size={14}
                      style={{
                        color: "#4ade80",
                        marginTop: "2px",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#6ee7b7",
                        lineHeight: 1.5,
                      }}
                    >
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Jam Layanan */}
            <div>
              <h4
                style={{
                  color: "white",
                  fontFamily: "'Lora', serif",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                }}
              >
                Jam Layanan
              </h4>
              <div
                style={{ fontSize: "0.8rem", color: "#6ee7b7", lineHeight: 2 }}
              >
                <div>Senin – Jumat</div>
                <div style={{ color: "#4ade80", fontWeight: 600 }}>
                  08.00 – 15.00 WIB
                </div>
                <div style={{ marginTop: "0.5rem" }}>Istirahat</div>
                <div style={{ color: "#4ade80", fontWeight: 600 }}>
                  12.00 – 13.00 WIB
                </div>
                <div style={{ marginTop: "0.5rem", color: "#f87171" }}>
                  Sabtu & Minggu Libur
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: "1.25rem",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: "0.5rem",
            }}
          >
            <p style={{ fontSize: "0.75rem", color: "#4ade80" }}>
              © {new Date().getFullYear()} Desa Maju. Semua hak dilindungi.
            </p>
            <p style={{ fontSize: "0.75rem", color: "#6ee7b7" }}>
              Sistem Persuratan Digital
            </p>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <button
        className={`back-top ${showTop ? "visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ChevronUp size={18} />
      </button>
    </div>
  );
}
