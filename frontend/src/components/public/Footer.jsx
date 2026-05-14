/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import {
  Leaf,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Heart,
  Share2,
  // Remove Youtube from here
  MessageCircle,
} from "lucide-react";

const footerLinks = {
  layanan: [
    { label: "Surat Keterangan Domisili", path: "/layanan" },
    { label: "Surat Keterangan Usaha", path: "/layanan" },
    { label: "Surat Pengantar KTP", path: "/layanan" },
    { label: "Surat Keterangan Tidak Mampu", path: "/layanan" },
    { label: "Cek Status Surat", path: "/cek-surat" },
  ],
  informasi: [
    { label: "Beranda", path: "/" },
    { label: "Profil Desa", path: "/profil-desa" },
    { label: "Struktur Organisasi", path: "/struktur-organisasi" },
    { label: "FAQ", path: "/faq" },
    { label: "Kontak Kami", path: "/kontak" },
  ],
};

const socials = [
  {
    label: "Facebook",
    href: "#",
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: () => (
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 fill-none stroke-current"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon
          points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
          fill="white"
        />
      </svg>
    ),
  },
];

const contacts = [
  {
    icon: MapPin,
    text: "Jl. Desa Sukamaju No.1, Kec. Maju, Kab. Jaya, Jawa Barat 12345",
  },
  { icon: Phone, text: "(0264) 123-4567" },
  { icon: Mail, text: "info@desa-sukamaju.go.id" },
  { icon: Clock, text: "Senin – Jumat: 08.00 – 16.00 WIB" },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white">
      {/* wave top */}
      <div className="w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" className="w-full h-10 fill-gray-50">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center border border-white/20">
                <Leaf className="w-6 h-6 text-green-300" />
              </div>
              <div>
                <p className="font-bold text-white text-base">Desa Sukamaju</p>
                <p className="text-green-300 text-xs">Sistem Persuratan Desa</p>
              </div>
            </div>
            <p className="text-green-200/80 text-sm leading-relaxed">
              Mewujudkan pelayanan publik yang transparan, mudah, dan dapat
              diakses oleh seluruh warga desa Sukamaju.
            </p>

            {/* socials */}
            <div className="flex items-center gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-white/10 hover:bg-green-500 border border-white/20 hover:border-green-400 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:-translate-y-0.5 text-white"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Layanan
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.layanan.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-green-200/75 hover:text-white text-sm group transition-colors duration-150"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 group-hover:ml-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informasi */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Informasi
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.informasi.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-green-200/75 hover:text-white text-sm group transition-colors duration-150"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 group-hover:ml-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Kontak
            </h4>
            <ul className="space-y-3">
              {contacts.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-green-700/60 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5 text-green-300" />
                  </div>
                  <span className="text-green-200/75 text-sm leading-snug">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* divider */}
        <div className="my-8 border-t border-white/10" />

        {/* bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-green-300/60">
          <p>
            © {new Date().getFullYear()} Desa Sukamaju. Hak Cipta Dilindungi.
          </p>
          <p className="flex items-center gap-1">
            Dibuat dengan{" "}
            <Heart className="w-3 h-3 text-red-400 mx-0.5 fill-current" /> untuk
            warga Desa Sukamaju
          </p>
        </div>
      </div>
    </footer>
  );
}
