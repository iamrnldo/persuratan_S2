/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ArrowRight,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function useInView() {
  const {
    useRef,
    useState: useS,
    useEffect: useE,
  } = require !== undefined
    ? {
        useRef: window.React?.useRef,
        useState: window.React?.useState,
        useEffect: window.React?.useEffect,
      }
    : {};
  // fallback handled below
}

const colorVariants = [
  "from-green-400 to-green-600",
  "from-emerald-400 to-emerald-600",
  "from-teal-400 to-teal-600",
  "from-green-500 to-emerald-700",
];

const requirements = [
  "Fotokopi KTP",
  "Fotokopi KK",
  "Surat pengantar RT/RW",
  "Dokumen pendukung (sesuai jenis surat)",
];

export default function LayananPage() {
  const [layanan, setLayanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/layanan`)
      .then(({ data }) => {
        const list = data.data || data || [];
        setLayanan(list);
        // stagger reveal
        list.forEach((_, i) => {
          setTimeout(() => setVisible((prev) => [...prev, i]), i * 100);
        });
      })
      .catch(() => setLayanan([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = layanan.filter(
    (l) =>
      l.nama?.toLowerCase().includes(search.toLowerCase()) ||
      l.deskripsi?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* hero */}
      <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-emerald-600 py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1 bg-white/20 text-white rounded-full text-sm font-medium mb-4">
            Portal Layanan
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Layanan Desa Sukamaju
          </h1>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            Temukan berbagai layanan surat menyurat yang kami sediakan untuk
            memenuhi kebutuhan administrasi warga.
          </p>
          {/* search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari layanan..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-lg text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-400 text-sm"
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-gray-50">
            <path d="M0,30 C360,0 1080,60 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm animate-pulse"
              >
                <div className="w-14 h-14 bg-gray-200 rounded-2xl mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                <div className="h-3 bg-gray-200 rounded mb-1 w-full" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">
              {search
                ? `Tidak ada layanan untuk "${search}"`
                : "Belum ada layanan"}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((l, i) => (
              <div
                key={l.id}
                className={`group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:shadow-green-100/50 hover:-translate-y-2 transition-all duration-300 ${
                  visible.includes(i)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${colorVariants[i % colorVariants.length]} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors text-base">
                  {l.nama}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3">
                  {l.deskripsi || "Layanan surat resmi dari Desa Sukamaju."}
                </p>

                {/* meta */}
                <div className="flex items-center gap-4 mb-5 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-green-500" />
                    {l.estimasi || "1-3 Hari"}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    Gratis
                  </span>
                </div>

                <Link
                  to="/kontak"
                  className="inline-flex items-center gap-1.5 text-green-600 text-sm font-semibold hover:gap-3 transition-all duration-200 group-hover:text-green-700"
                >
                  Ajukan Sekarang <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* requirements section */}
        <div className="mt-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold mb-3">
                Persyaratan Umum
              </span>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-3">
                Dokumen yang Diperlukan
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Untuk mempercepat proses pengurusan surat, siapkan dokumen
                berikut sebelum datang ke kantor desa atau menghubungi petugas.
              </p>
            </div>
            <ul className="space-y-3">
              {requirements.map((req) => (
                <li
                  key={req}
                  className="flex items-center gap-3 bg-white rounded-xl p-3.5 shadow-sm border border-green-100"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="text-sm text-gray-700 font-medium">
                    {req}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-2xl px-6 py-4">
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">Informasi:</span> Jam pelayanan
              Senin–Jumat pukul 08.00–16.00 WIB.{" "}
              <Link
                to="/kontak"
                className="text-green-700 font-semibold hover:underline"
              >
                Hubungi kami
              </Link>{" "}
              untuk informasi lebih lanjut.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
