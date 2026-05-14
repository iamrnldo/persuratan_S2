/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Building,
  Leaf,
  Clock,
} from "lucide-react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function Section({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const defaultProfil = {
  nama_desa: "Desa Sukamaju",
  kecamatan: "Kecamatan Maju",
  kabupaten: "Kabupaten Jaya",
  provinsi: "Jawa Barat",
  kode_pos: "12345",
  telepon: "(0264) 123-4567",
  email: "info@desa-sukamaju.go.id",
  website: "www.desa-sukamaju.go.id",
  sejarah:
    "Desa Sukamaju merupakan salah satu desa yang terletak di Kecamatan Maju, Kabupaten Jaya, Jawa Barat. Desa ini telah berdiri sejak tahun 1945 dan memiliki sejarah panjang dalam perkembangan wilayahnya. Dengan semangat gotong royong yang kuat, warga Desa Sukamaju terus membangun dan mengembangkan potensi desa untuk kesejahteraan bersama.",
  visi: "Menjadikan Desa Sukamaju yang Mandiri, Sejahtera, dan Berdaya Saing Berbasis Potensi Lokal.",
  misi: "1. Meningkatkan kualitas pelayanan publik\n2. Mengembangkan ekonomi berbasis potensi lokal\n3. Meningkatkan kualitas SDM warga desa\n4. Menjaga kelestarian lingkungan dan budaya",
  embed_maps: "",
  jumlah_penduduk: "4,521",
  luas_wilayah: "12.5 km²",
  jumlah_rt: "24",
  jumlah_rw: "6",
};

const infoCards = [
  {
    icon: Users,
    label: "Jumlah Penduduk",
    key: "jumlah_penduduk",
    suffix: " jiwa",
  },
  { icon: Globe, label: "Luas Wilayah", key: "luas_wilayah", suffix: "" },
  { icon: Building, label: "Jumlah RW", key: "jumlah_rw", suffix: " RW" },
  { icon: MapPin, label: "Jumlah RT", key: "jumlah_rt", suffix: " RT" },
];

export default function ProfilDesaPage() {
  const [profil, setProfil] = useState(defaultProfil);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("sejarah");

  useEffect(() => {
    axios
      .get(`${API}/profil-desa`)
      .then(({ data }) => {
        const d = data.data || data;
        if (d) setProfil({ ...defaultProfil, ...d });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const tabs = [
    { id: "sejarah", label: "Sejarah" },
    { id: "visi-misi", label: "Visi & Misi" },
    { id: "kontak", label: "Kontak" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* hero */}
      <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-600/20 rounded-full" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur rounded-3xl mb-6 border border-white/30">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
            {profil.nama_desa}
          </h1>
          <p className="text-green-100 text-lg mb-2">
            {profil.kecamatan}, {profil.kabupaten}
          </p>
          <p className="text-green-200/70 text-sm">
            {profil.provinsi} {profil.kode_pos}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-gray-50">
            <path d="M0,30 C360,0 1080,60 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* stat cards */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {infoCards.map((c, i) => (
            <Section key={c.key} delay={i * 80}>
              <div className="bg-white rounded-2xl shadow-lg shadow-green-100/40 p-5 text-center border border-green-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <c.icon className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-xl font-extrabold text-green-700 mb-0.5">
                  {profil[c.key]}
                  {c.suffix}
                </p>
                <p className="text-xs text-gray-500">{c.label}</p>
              </div>
            </Section>
          ))}
        </div>
      </div>

      {/* main content */}
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-12">
        {/* tabs */}
        <Section>
          <div className="bg-white rounded-3xl shadow-sm border border-green-100 overflow-hidden">
            {/* tab bar */}
            <div className="flex border-b border-gray-100 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-max py-4 px-6 text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-green-700 border-b-2 border-green-600 bg-green-50"
                      : "text-gray-500 hover:text-green-600 hover:bg-green-50/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* tab content */}
            <div className="p-8">
              {activeTab === "sejarah" && (
                <div className="prose prose-green max-w-none">
                  <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                    {profil.sejarah || "Informasi sejarah belum tersedia."}
                  </p>
                </div>
              )}

              {activeTab === "visi-misi" && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-700 font-bold text-sm">
                          V
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900">Visi</h3>
                    </div>
                    <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
                      <p className="text-gray-700 text-sm leading-relaxed italic">
                        "{profil.visi}"
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <span className="text-emerald-700 font-bold text-sm">
                          M
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900">Misi</h3>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                        {profil.misi}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "kontak" && (
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    {
                      icon: MapPin,
                      label: "Alamat",
                      value: `${profil.nama_desa}, ${profil.kecamatan}, ${profil.kabupaten}, ${profil.provinsi} ${profil.kode_pos}`,
                    },
                    { icon: Phone, label: "Telepon", value: profil.telepon },
                    { icon: Mail, label: "Email", value: profil.email },
                    { icon: Globe, label: "Website", value: profil.website },
                    {
                      icon: Clock,
                      label: "Jam Pelayanan",
                      value: "Senin – Jumat, 08.00 – 16.00 WIB",
                    },
                  ].map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* Google Maps embed */}
        <Section delay={200}>
          <div className="bg-white rounded-3xl shadow-sm border border-green-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-gray-900">Lokasi Desa</h3>
            </div>
            <div
              className="relative bg-gray-100"
              style={{ paddingBottom: "56.25%" }}
            >
              {profil.embed_maps ? (
                <iframe
                  src={profil.embed_maps}
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Desa Sukamaju"
                />
              ) : (
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d126748!2d107.6191!3d-6.9175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Desa"
                />
              )}
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
