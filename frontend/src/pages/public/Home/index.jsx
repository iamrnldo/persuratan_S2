import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  Users,
  Shield,
  Clock,
  CheckCircle,
  Star,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";

/* ── hook: intersection observer ── */
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { threshold: 0.15, ...options },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ── counter animation ── */
function Counter({ target, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return (
    <span ref={ref}>
      {count.toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}

const stats = [
  { icon: FileText, label: "Surat Diproses", value: 1240, suffix: "+" },
  { icon: Users, label: "Warga Terlayani", value: 3500, suffix: "+" },
  { icon: Clock, label: "Rata-rata Proses", value: 24, suffix: " Jam" },
  { icon: Award, label: "Kepuasan Warga", value: 98, suffix: "%" },
];

const services = [
  {
    title: "Surat Keterangan Domisili",
    desc: "Dokumen resmi keterangan tempat tinggal warga yang diakui pemerintah.",
    icon: "🏠",
    color: "from-green-400 to-green-600",
  },
  {
    title: "Surat Keterangan Usaha",
    desc: "Legalitas usaha mikro dan kecil untuk keperluan administrasi bisnis.",
    icon: "💼",
    color: "from-emerald-400 to-emerald-600",
  },
  {
    title: "Surat Pengantar KTP",
    desc: "Surat pengantar pembuatan atau perpanjangan Kartu Tanda Penduduk.",
    icon: "🪪",
    color: "from-teal-400 to-teal-600",
  },
  {
    title: "Surat Keterangan Tidak Mampu",
    desc: "Dokumen resmi keterangan kondisi ekonomi untuk berbagai bantuan.",
    icon: "📋",
    color: "from-green-500 to-emerald-700",
  },
];

const steps = [
  {
    step: "01",
    title: "Ajukan Permohonan",
    desc: "Kunjungi kantor desa atau hubungi petugas untuk mengajukan permohonan surat.",
  },
  {
    step: "02",
    title: "Verifikasi Data",
    desc: "Petugas memverifikasi kelengkapan data dan dokumen pendukung Anda.",
  },
  {
    step: "03",
    title: "Proses Surat",
    desc: "Surat diproses oleh perangkat desa dalam waktu 1×24 jam kerja.",
  },
  {
    step: "04",
    title: "Ambil / Download",
    desc: "Surat siap diambil atau diunduh secara digital sesuai kebutuhan.",
  },
];

const testimonials = [
  {
    name: "Budi Santoso",
    role: "Warga RT 03",
    text: "Prosesnya sangat cepat dan mudah. Tidak perlu antri lama, surat langsung jadi dalam sehari!",
    rating: 5,
  },
  {
    name: "Siti Aminah",
    role: "Pelaku UMKM",
    text: "Surat keterangan usaha bisa saya urus dengan mudah. Pelayanannya ramah dan profesional.",
    rating: 5,
  },
  {
    name: "Andi Pratama",
    role: "Warga RW 02",
    text: "Sistem digitalnya memudahkan sekali. Bisa cek status surat dari rumah tanpa harus datang.",
    rating: 5,
  },
];

function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center bg-gradient-to-br from-green-50 via-white to-emerald-50 overflow-hidden">
        {/* bg decor */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200/30 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-100/20 rounded-full blur-3xl" />
          {/* floating dots */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-green-300/50 rounded-full animate-bounce"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + i * 0.2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* left */}
            <div
              className={`transition-all duration-1000 ${
                heroVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12"
              }`}
            >
              {/* badge */}
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-green-200">
                <Sparkles className="w-3.5 h-3.5" />
                Pelayanan Digital Terpadu
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Layanan Surat{" "}
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                    Desa Mudah
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 8"
                    fill="none"
                  >
                    <path
                      d="M0 4 Q100 8 200 4"
                      stroke="url(#ug)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <defs>
                      <linearGradient
                        id="ug"
                        x1="0"
                        y1="0"
                        x2="200"
                        y2="0"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#16a34a" />
                        <stop offset="1" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>{" "}
                & Cepat
              </h1>

              <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg">
                Urus berbagai keperluan administrasi surat menyurat Desa
                Sukamaju secara mudah, transparan, dan dapat diakses kapan saja.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/layanan"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3.5 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-green-300/50 hover:-translate-y-1 transform text-sm"
                >
                  Lihat Layanan
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/cek-surat"
                  className="inline-flex items-center gap-2 border-2 border-green-600 text-green-700 px-6 py-3.5 rounded-xl font-semibold hover:bg-green-50 transition-all duration-200 hover:-translate-y-1 transform text-sm"
                >
                  <FileText className="w-4 h-4" />
                  Cek Surat Saya
                </Link>
              </div>

              {/* trust badges */}
              <div className="flex flex-wrap items-center gap-5 mt-10">
                {[
                  { icon: Shield, label: "Terpercaya" },
                  { icon: Zap, label: "Proses Cepat" },
                  { icon: CheckCircle, label: "Resmi & Sah" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 text-sm text-gray-500"
                  >
                    <Icon className="w-4 h-4 text-green-500" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* right: visual card */}
            <div
              className={`transition-all duration-1000 delay-300 ${
                heroVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-12"
              }`}
            >
              <div className="relative">
                {/* main card */}
                <div className="relative bg-white rounded-3xl shadow-2xl shadow-green-200/50 p-8 border border-green-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        Portal Persuratan
                      </p>
                      <p className="text-sm text-gray-500">Desa Sukamaju</p>
                    </div>
                    <span className="ml-auto px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      AKTIF
                    </span>
                  </div>

                  {/* status items */}
                  <div className="space-y-3">
                    {[
                      {
                        label: "Surat Domisili",
                        status: "Selesai",
                        color: "green",
                      },
                      {
                        label: "Surat Usaha",
                        status: "Diproses",
                        color: "yellow",
                      },
                      {
                        label: "Pengantar KTP",
                        status: "Menunggu",
                        color: "blue",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors duration-150"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              item.color === "green"
                                ? "bg-green-500"
                                : item.color === "yellow"
                                  ? "bg-yellow-500"
                                  : "bg-blue-500"
                            } animate-pulse`}
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {item.label}
                          </span>
                        </div>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            item.color === "green"
                              ? "bg-green-100 text-green-700"
                              : item.color === "yellow"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/cek-surat"
                    className="mt-5 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl text-sm font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200"
                  >
                    Cek Status Surat Anda
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* floating badge top-right */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-2 border border-green-100 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-bold text-green-700">
                    98% Puas
                  </span>
                </div>

                {/* floating badge bottom-left */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg px-4 py-2 border border-green-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-bold text-green-700">
                    ≤ 24 Jam Proses
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-gray-50">
            <path d="M0,30 C360,0 1080,60 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════
          STATS
      ══════════════════════════════════ */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 100}>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-green-50 hover:shadow-md hover:border-green-200 transition-all duration-300 group hover:-translate-y-1">
                  <div className="w-12 h-12 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                    <s.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-3xl font-extrabold text-green-700 mb-1">
                    <Counter target={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-sm text-gray-500 font-medium">{s.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          SERVICES
      ══════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
                Layanan Kami
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                Berbagai Kebutuhan Surat
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Kami menyediakan berbagai layanan surat menyurat resmi untuk
                memenuhi kebutuhan administrasi warga desa.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <FadeIn key={s.title} delay={i * 100}>
                <div className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-green-100/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {s.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm leading-snug group-hover:text-green-700 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">
                    {s.desc}
                  </p>
                  <Link
                    to="/layanan"
                    className="inline-flex items-center gap-1 text-green-600 text-xs font-semibold hover:gap-2 transition-all duration-200"
                  >
                    Selengkapnya <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="text-center mt-10">
              <Link
                to="/layanan"
                className="inline-flex items-center gap-2 border-2 border-green-600 text-green-700 px-6 py-3 rounded-xl font-semibold hover:bg-green-600 hover:text-white transition-all duration-200 text-sm"
              >
                Lihat Semua Layanan <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
                Cara Kerja
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                Proses Pengajuan Mudah
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Hanya 4 langkah sederhana untuk mendapatkan surat yang Anda
                butuhkan.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* connector line (desktop) */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-green-300 via-green-400 to-green-300" />

            {steps.map((step, i) => (
              <FadeIn key={step.step} delay={i * 150}>
                <div className="relative bg-white rounded-2xl p-6 shadow-sm border border-green-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-5 text-white font-extrabold text-lg shadow-lg shadow-green-200 relative z-10">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
                Testimoni
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                Kata Warga Kami
              </h2>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 100}>
                <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex mb-3">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {t.name}
                      </p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          CTA BANNER
      ══════════════════════════════════ */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-800 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full" />
        </div>
        <FadeIn>
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Butuh Surat? Kami Siap Membantu!
            </h2>
            <p className="text-green-100 mb-8 max-w-2xl mx-auto">
              Hubungi kantor desa atau manfaatkan sistem digital kami untuk
              keperluan administrasi surat menyurat yang cepat dan mudah.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/layanan"
                className="inline-flex items-center gap-2 bg-white text-green-700 px-6 py-3.5 rounded-xl font-bold hover:bg-green-50 transition-all duration-200 shadow-lg hover:-translate-y-1 transform text-sm"
              >
                Mulai Sekarang <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/kontak"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-white hover:text-green-700 transition-all duration-200 hover:-translate-y-1 transform text-sm"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
