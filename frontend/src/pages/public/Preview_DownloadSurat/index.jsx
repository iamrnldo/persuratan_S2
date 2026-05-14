// src/pages/public/Preview_DownloadSurat/index.jsx
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Download,
  FileText,
  Eye,
  Hash,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Loader2,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import suratPublicService from "@/api/suratPublicService";

import SuratPublicModal, { StatusBadge, fmtDate } from "./ModalPreview";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 animate-pulse">
      <div className="w-10 h-10 bg-gray-200 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
      </div>
      <div className="h-5 w-20 bg-gray-200 rounded-full" />
      <div className="h-8 w-8 bg-gray-100 rounded-lg" />
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function PreviewDownloadSurat() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Input state (belum di-commit) ──
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const [jenisInput, setJenisInput] = useState(searchParams.get("jenis") || "");
  const [klasifikasiInput, setKlasifikasiInput] = useState(
    searchParams.get("klasifikasi_id") || "",
  );

  // ── Committed filter (dipakai fetch) ──
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [jenis, setJenis] = useState(searchParams.get("jenis") || "");
  const [klasifikasiId, setKlasifikasiId] = useState(
    searchParams.get("klasifikasi_id") || "",
  );

  const [page, setPage] = useState(1);
  const LIMIT = 10;

  const [suratList, setSuratList] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [klasifikasiList, setKlasifikasiList] = useState([]);

  const [selectedSurat, setSelectedSurat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // ── Fetch klasifikasi dropdown ──
  useEffect(() => {
    suratPublicService
      .getKlasifikasi?.()
      .then(setKlasifikasiList)
      .catch(() => {});
  }, []);

  // ── Fetch list ──
  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const { data, pagination: pg } = await suratPublicService.getAllSurat({
        page,
        limit: LIMIT,
        search,
        jenis,
        klasifikasi_id: klasifikasiId,
      });
      setSuratList(data);
      setPagination(pg);
    } catch (err) {
      toast.error(err.message || "Gagal memuat data surat");
    } finally {
      setLoading(false);
    }
  }, [page, search, jenis, klasifikasiId]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // ── Submit filter ──
  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchInput.trim();
    const j = jenisInput;
    const kl = klasifikasiInput;
    setPage(1);
    setSearch(q);
    setJenis(j);
    setKlasifikasiId(kl);
    const params = {};
    if (q) params.search = q;
    if (j) params.jenis = j;
    if (kl) params.klasifikasi_id = kl;
    setSearchParams(params);
  };

  const hasFilter = !!(search || jenis || klasifikasiId);

  const handleReset = () => {
    setSearchInput("");
    setJenisInput("");
    setKlasifikasiInput("");
    setSearch("");
    setJenis("");
    setKlasifikasiId("");
    setPage(1);
    setSearchParams({});
  };

  const openModal = (surat) => {
    setSelectedSurat(surat);
    setModalOpen(true);
  };

  const handleDownloadRow = async (surat, e) => {
    e.stopPropagation();
    if (!surat.file_path) {
      toast.error("File belum tersedia");
      return;
    }
    const tid = toast.loading("Menyiapkan file...");
    try {
      const blob = await suratPublicService.downloadSurat(surat);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Surat_${surat.nomor_surat || surat.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Berhasil diunduh", { id: tid });
    } catch (err) {
      toast.error(err.message || "Gagal mengunduh", { id: tid });
    }
  };

  const totalPages = pagination.totalPages || 1;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce((acc, p, idx, arr) => {
      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  const activeFilterLabel = [
    search && `"${search}"`,
    jenis && (jenis === "masuk" ? "Surat Masuk" : "Surat Keluar"),
    klasifikasiId &&
      klasifikasiList.find((k) => String(k.id) === String(klasifikasiId))?.nama,
  ]
    .filter(Boolean)
    .join(" · ");

  // ── Render ──
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl mb-5 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Cek & Download Surat
          </h1>
          <p className="text-gray-500">
            Cari berdasarkan nomor surat, klasifikasi, atau jenis surat.
          </p>
        </div>

        {/* Search card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-green-100/50 border border-green-100 p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Input teks */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cari Surat
              </label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Nomor surat, perihal, pengirim..."
                  className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none text-sm transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Dropdown filter */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Jenis Surat
                </label>
                <select
                  value={jenisInput}
                  onChange={(e) => setJenisInput(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition-all duration-200 text-gray-700"
                >
                  <option value="">Semua Jenis</option>
                  <option value="masuk">Surat Masuk</option>
                  <option value="keluar">Surat Keluar</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Klasifikasi
                </label>
                <select
                  value={klasifikasiInput}
                  onChange={(e) => setKlasifikasiInput(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition-all duration-200 text-gray-700"
                >
                  <option value="">Semua Klasifikasi</option>
                  {klasifikasiList.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.kode ? `${k.kode} – ${k.nama}` : k.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tombol */}
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {loading ? "Mencari..." : "Cari"}
              </button>
              {(searchInput || jenisInput || klasifikasiInput) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Reset Filter
                </button>
              )}
            </div>

            <p className="text-xs text-gray-400">
              * Nomor surat dapat ditemukan pada tanda terima pengajuan Anda.
            </p>
          </form>

          {/* Ringkasan filter aktif */}
          {hasFilter && !loading && (
            <div className="mt-3 flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-green-600 shrink-0" />
              <p className="text-xs text-gray-500">
                Filter aktif:{" "}
                <span className="font-semibold text-green-700">
                  {activeFilterLabel}
                </span>
                {pagination.total !== undefined && (
                  <span className="text-gray-400">
                    {" "}
                    — {pagination.total} surat ditemukan
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* List card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-green-100/50 border border-green-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-700 text-sm">
              {hasFilter ? "Hasil Pencarian" : "Semua Surat"}
            </h2>
            {!loading && pagination.total !== undefined && (
              <span className="text-xs text-gray-400">
                {pagination.total} surat
              </span>
            )}
          </div>

          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
          ) : suratList.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Inbox className="w-14 h-14 mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">Tidak ada surat ditemukan</p>
              {hasFilter && (
                <button
                  onClick={handleReset}
                  className="mt-2 text-xs text-green-600 underline"
                >
                  Tampilkan semua surat
                </button>
              )}
            </div>
          ) : (
            suratList.map((surat) => (
              <div
                key={surat.id}
                onClick={() => openModal(surat)}
                className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-green-50/50 cursor-pointer transition-colors group"
              >
                <div className="w-10 h-10 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {surat.nomor_surat || `ID: ${surat.id}`}
                    </p>
                    <span
                      className={`hidden sm:inline-flex shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        surat.jenis === "masuk"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {surat.jenis === "masuk" ? "Masuk" : "Keluar"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {surat.perihal || "-"}
                    <span className="mx-1.5">·</span>
                    {fmtDate(surat.tanggal_dokumen)}
                    {surat.klasifikasi_nama && (
                      <>
                        <span className="mx-1.5">·</span>
                        {surat.klasifikasi_nama}
                      </>
                    )}
                  </p>
                </div>

                <StatusBadge status={surat.status} size="sm" />

                <div
                  className="flex items-center gap-1 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => openModal(surat)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-100 transition-colors"
                    title="Lihat detail"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {surat.status?.toLowerCase() === "selesai" &&
                    surat.file_path && (
                      <button
                        onClick={(e) => handleDownloadRow(surat, e)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-100 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                </div>
              </div>
            ))
          )}

          {!loading && totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Halaman {page} dari {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {pageNumbers.map((p, idx) =>
                  p === "..." ? (
                    <span
                      key={`dot-${idx}`}
                      className="w-8 text-center text-gray-400 text-xs"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${p === page ? "bg-green-600 text-white shadow-sm" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <SuratPublicModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        surat={selectedSurat}
      />
    </div>
  );
}
