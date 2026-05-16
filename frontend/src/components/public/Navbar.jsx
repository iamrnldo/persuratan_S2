/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Leaf,
  FileText,
  Home,
  Info,
  Phone,
  HelpCircle,
  Users,
  Layers,
} from "lucide-react";

import { profilDesaService } from "../../api/profilDesaService";

const navLinks = [
  { label: "Beranda", path: "/", icon: Home },
  { label: "Profil Desa", path: "/profil-desa", icon: Info },
  {
    label: "Layanan",
    path: "/layanan",
    icon: Layers,
    children: [
      { label: "Semua Layanan", path: "/layanan" },
      { label: "Cek & Download Surat", path: "/cek-surat" },
    ],
  },
  { label: "Struktur Organisasi", path: "/struktur-organisasi", icon: Users },
  { label: "FAQ", path: "/faq", icon: HelpCircle },
  { label: "Kontak", path: "/kontak", icon: Phone },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [namaDesa, setNamaDesa] = useState("Desa Sukamaju");
  const location = useLocation();
  const navRef = useRef(null);

  /* ── fetch nama desa ── */
  useEffect(() => {
    profilDesaService
      .get()
      .then((res) => {
        const nama = res?.data?.nama_desa || res?.nama_desa;
        if (nama) setNamaDesa(nama);
      })
      .catch(() => {
        // silently fall back to default
      });
  }, []);

  /* ── scroll effect ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── close mobile on route change ── */
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
    setMobileExpanded(null);
  }, [location]);

  /* ── close dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── lock body scroll when mobile open ── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg shadow-green-100/50"
            : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        {/* top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-green-400 via-green-600 to-green-400" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="relative w-10 h-10 overflow-hidden group-hover:shadow-green-300 transition-shadow duration-300 group-hover:scale-105 transform">
                <img
                  src="/src/assets/logo.png"
                  alt={`Logo ${namaDesa}`}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-green-800 leading-tight group-hover:text-green-600 transition-colors">
                  {namaDesa}
                </p>
                <p className="text-xs text-green-500 leading-tight font-medium">
                  Sistem Persuratan
                </p>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.path}
                  className="relative"
                  onMouseEnter={() =>
                    link.children && setActiveDropdown(link.label)
                  }
                  onMouseLeave={() => link.children && setActiveDropdown(null)}
                >
                  {link.children ? (
                    <>
                      <button
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                          isActive(link.path)
                            ? "bg-green-50 text-green-700"
                            : "text-gray-600 hover:text-green-700 hover:bg-green-50"
                        }`}
                      >
                        {link.label}
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            activeDropdown === link.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Dropdown */}
                      <div
                        className={`absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl shadow-green-100/60 border border-green-100 overflow-hidden transition-all duration-200 origin-top ${
                          activeDropdown === link.label
                            ? "opacity-100 scale-y-100 translate-y-0"
                            : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"
                        }`}
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors duration-150 ${
                              isActive(child.path)
                                ? "bg-green-50 text-green-700 font-medium"
                                : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      to={link.path}
                      className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive(link.path)
                          ? "bg-green-50 text-green-700"
                          : "text-gray-600 hover:text-green-700 hover:bg-green-50"
                      }`}
                    >
                      {link.label}
                      {isActive(link.path) && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-green-500 rounded-full" />
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* ── CTA Button (desktop) ── */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/cek-surat"
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-green-300/50 hover:-translate-y-0.5 transform"
              >
                <FileText className="w-4 h-4" />
                Cek Surat
              </Link>
            </div>

            {/* ── Hamburger ── */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={isOpen}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl text-green-700 hover:bg-green-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <span
                className={`absolute transition-all duration-300 ${
                  isOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
                }`}
              >
                <X className="w-5 h-5" />
              </span>
              <span
                className={`absolute transition-all duration-300 ${
                  isOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"
                }`}
              >
                <Menu className="w-5 h-5" />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Overlay ── */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        {/* backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-[min(85vw,320px)] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* drawer header */}
          <div className="h-1 w-full bg-gradient-to-r from-green-400 via-green-600 to-green-400" />
          <div className="flex items-center justify-between px-5 py-4 border-b border-green-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-green-800">{namaDesa}</p>
                <p className="text-xs text-green-500">Sistem Persuratan</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* drawer links */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {navLinks.map((link, idx) => (
              <div key={link.path}>
                {link.children ? (
                  <>
                    <button
                      onClick={() =>
                        setMobileExpanded(
                          mobileExpanded === link.label ? null : link.label,
                        )
                      }
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive(link.path)
                          ? "bg-green-50 text-green-700"
                          : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                      }`}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <link.icon className="w-4 h-4 shrink-0" />
                        {link.label}
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                          mobileExpanded === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        mobileExpanded === link.label
                          ? "max-h-40 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="ml-4 mt-1 space-y-1 pl-4 border-l-2 border-green-100">
                        {link.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 ${
                              isActive(child.path)
                                ? "bg-green-50 text-green-700 font-medium"
                                : "text-gray-500 hover:text-green-700 hover:bg-green-50"
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive(link.path)
                        ? "bg-green-50 text-green-700"
                        : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    <link.icon className="w-4 h-4 shrink-0" />
                    {link.label}
                    {isActive(link.path) && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500" />
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* drawer footer CTA */}
          <div className="p-4 border-t border-green-100">
            <Link
              to="/cek-surat"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl text-sm font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md"
            >
              <FileText className="w-4 h-4" />
              Cek & Download Surat
            </Link>
          </div>
        </div>
      </div>

      {/* spacer */}
      <div className="h-[calc(1rem+4rem)] lg:h-[calc(1rem+4.5rem)]" />
    </>
  );
}
