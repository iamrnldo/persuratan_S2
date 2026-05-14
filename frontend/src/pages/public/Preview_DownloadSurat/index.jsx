/* eslint-disable react-hooks/set-state-in-effect */
// src/pages/public/PreviewDownloadSurat.jsx  (index.jsx)
import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search, Download, FileText, CheckCircle, Clock, XCircle,
  AlertCircle, Eye, Hash, Printer, ChevronLeft, ChevronRight,
  Inbox, X, ZoomIn, ZoomOut, RotateCcw, Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import suratPublicService from "@/api/suratPublicService";

// ─── Konstanta ────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  selesai:    { label: "Selesai",    color: "green",  icon: CheckCircle },
  diproses:   { label: "Diproses",   color: "yellow", icon: Clock       },
  ditolak:    { label: "Ditolak",    color: "red",    icon: XCircle     },
  menunggu:   { label: "Menunggu",   color: "blue",   icon: AlertCircle },
  baru:       { label: "Baru",       color: "blue",   icon: AlertCircle },
  diarsipkan: { label: "Diarsipkan", color: "gray",   icon: FileText    },
};
const BADGE_COLOR = {
  green:  "bg-green-100  text-green-700  border-green-200",
  yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
  red:    "bg-red-100    text-red-700    border-red-200",
  blue:   "bg-blue-100   text-blue-700   border-blue-200",
  gray:   "bg-gray-100   text-gray-600   border-gray-200",
};

const getExt  = (name = "") => name.split(".").pop().toLowerCase();
const isPdf   = (name) => getExt(name) === "pdf";
const isImage = (name) => ["jpg","jpeg","png","webp","gif"].includes(getExt(name));
const fmtSize = (b) => {
  if (!b) return "";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
};
const fmtDate = (d, long = false) => {
  try {
    return format(new Date(d), long ? "dd MMMM yyyy" : "dd MMM yyyy", { locale: localeId });
  } catch { return "-"; }
};

// ─── StatusBadge ──────────────────────────────────────────────────────────────
function StatusBadge({ status, size = "md" }) {
  const cfg  = STATUS_CONFIG[status?.toLowerCase()] ?? STATUS_CONFIG.baru;
  const Icon = cfg.icon;
  const sz   = size === "sm"
    ? "px-2 py-0.5 text-[11px] gap-1"
    : "px-3 py-1 text-sm gap-1.5";
  return (
    <span className={`inline-flex items-center rounded-full font-semibold border ${sz} ${BADGE_COLOR[cfg.color]}`}>
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {cfg.label}
    </span>
  );
}

// ─── MetaRow (sidebar modal) ──────────────────────────────────────────────────
function MetaRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">{label}</span>
      <span className="text-sm text-gray-800 font-medium leading-snug">{value}</span>
    </div>
  );
}

// ─── PdfViewer ────────────────────────────────────────────────────────────────
function PdfViewer({ url, fileName }) {
  const [err, setErr] = useState(false);
  if (err) return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
      <AlertCircle className="w-12 h-12 opacity-40" />
      <p className="text-sm">PDF tidak dapat ditampilkan di browser ini.</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
        Buka di tab baru
      </a>
    </div>
  );
  return (
    <iframe
      src={`${url}#toolbar=1&navpanes=0&scrollbar=1`}
      title={fileName}
      className="w-full h-full rounded-lg"
      onError={() => setErr(true)}
    />
  );
}

// ─── ImageViewer ──────────────────────────────────────────────────────────────
function ImageViewer({ url, fileName, zoom, onZoomIn, onZoomOut, onReset }) {
  const [err, setErr] = useState(false);
  if (err) return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
      <AlertCircle className="w-12 h-12 opacity-40" />
      <p className="text-sm">Gambar tidak dapat dimuat.</p>
    </div>
  );
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center mb-3 flex-shrink-0">
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
          <button onClick={onZoomOut} className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"><ZoomOut className="w-4 h-4" /></button>
          <button onClick={onReset}   className="px-2 py-1 text-xs font-mono text-gray-600 hover:bg-gray-100 rounded min-w-[48px] text-center">{Math.round(zoom * 100)}%</button>
          <button onClick={onZoomIn}  className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"><ZoomIn className="w-4 h-4" /></button>
          <button onClick={onReset}   className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors"><RotateCcw className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      <div className="flex-1 overflow-auto flex items-start justify-center">
        <img
          src={url} alt={fileName}
          className="transition-transform duration-200 ease-out rounded-lg shadow-md"
          style={{ transform: `scale(${zoom})`, transformOrigin: "top center", maxWidth: "100%" }}
          onError={() => setErr(true)}
        />
      </div>
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function SuratPublicModal({ isOpen, onClose, surat }) {
  const [zoom, setZoom]               = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const overlayRef = useRef(null);

  const fileUrl   = suratPublicService.getFileUrl(surat?.file_path);
  const fileName  = surat?.file_name ?? "";
  const hasFile   = !!(surat?.file_path && fileName);
  const hasPdf    = hasFile && isPdf(fileName);
  const hasImg    = hasFile && isImage(fileName);
  const isSelesai = surat?.status?.toLowerCase() === "selesai";

  // Escape key
  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose();
    if (isOpen) window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  // Reset on open / surat change
  useEffect(() => { if (isOpen) { setZoom(1); setSidebarOpen(true); } }, [isOpen, surat?.id]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const zoomIn    = useCallback(() => setZoom((z) => Math.min(+(z + 0.2).toFixed(1), 3)), []);
  const zoomOut   = useCallback(() => setZoom((z) => Math.max(+(z - 0.2).toFixed(1), 0.3)), []);
  const resetZoom = useCallback(() => setZoom(1), []);

  const handleDownload = async () => {
    setDownloading(true);
    const tid = toast.loading("Menyiapkan file...");
    try {
      const blob = await suratPublicService.downloadSurat(surat);
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `Surat_${surat.nomor_surat || surat.id}.pdf`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
      toast.success("Surat berhasil diunduh", { id: tid });
    } catch (err) {
      toast.error(err.message || "Gagal mengunduh", { id: tid });
    } finally {
      setDownloading(false);
    }
  };

  if (!isOpen || !surat) return null;

  const jenisLabel = surat.jenis === "masuk" ? "Surat Masuk" : "Surat Keluar";
  const jenisBg    = surat.jenis === "masuk"
    ? "bg-blue-100 text-blue-700"
    : "bg-purple-100 text-purple-700";

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 flex-shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-green-50 rounded-xl flex-shrink-0">
              <FileText className="w-4 h-4 text-green-600" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-bold text-gray-800 text-base leading-tight">Preview Surat</h2>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${jenisBg}`}>{jenisLabel}</span>
                <StatusBadge status={surat.status} size="sm" />
              </div>
              <p className="text-xs text-gray-400 truncate mt-0.5">{surat.perihal || "Tanpa perihal"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Toggle sidebar */}
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className={`p-2 rounded-xl transition-colors ${sidebarOpen ? "bg-green-50 text-green-600" : "text-gray-500 hover:bg-gray-100"}`}
              title="Toggle detail"
            >
              {sidebarOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Download */}
            {isSelesai && hasFile && (
              <button
                onClick={handleDownload} disabled={downloading}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 transition-colors disabled:opacity-60"
              >
                {downloading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Download className="w-4 h-4" />}
                Unduh
              </button>
            )}

            {/* Cetak */}
            <button onClick={() => window.print()} title="Cetak"
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
              <Printer className="w-4 h-4" />
            </button>

            {/* Close */}
            <button onClick={onClose}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* File viewer */}
          <div
            className="flex-1 overflow-hidden p-4"
            style={{
              background: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              backgroundColor: "#f9fafb",
            }}
          >
            {!hasFile ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
                <FileText className="w-14 h-14 opacity-25" />
                <p className="text-sm">Tidak ada file terlampir pada surat ini.</p>
              </div>
            ) : hasPdf ? (
              <PdfViewer url={fileUrl} fileName={fileName} />
            ) : hasImg ? (
              <ImageViewer url={fileUrl} fileName={fileName} zoom={zoom}
                onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetZoom} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">File tidak dapat ditampilkan langsung.</p>
                <a href={fileUrl} download={fileName} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors">
                  <Download className="w-4 h-4" /> Unduh File
                </a>
              </div>
            )}
          </div>

          {/* Sidebar */}
          {sidebarOpen && (
            <div className="w-60 flex-shrink-0 border-l border-gray-100 overflow-y-auto bg-gray-50/60">
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Informasi Surat</p>
                  <div className="space-y-3">
                    <MetaRow label="Nomor Agenda"    value={surat.nomor_agenda} />
                    <MetaRow label="Nomor Surat"     value={surat.nomor_surat} />
                    <MetaRow label="Perihal"          value={surat.perihal} />
                    <MetaRow label={surat.jenis === "masuk" ? "Pengirim" : "Tujuan"} value={surat.pengirim_tujuan} />
                    <MetaRow label="Tanggal Surat"   value={fmtDate(surat.tanggal_surat, true)} />
                    <MetaRow label="Tanggal Dokumen" value={fmtDate(surat.tanggal_dokumen, true)} />
                    <MetaRow label="Klasifikasi"     value={surat.klasifikasi_kode ? `${surat.klasifikasi_kode} – ${surat.klasifikasi_nama}` : surat.klasifikasi_nama} />
                    <MetaRow label="Keterangan"      value={surat.keterangan} />
                  </div>
                </div>

                {hasFile && (
                  <>
                    <div className="border-t border-gray-200" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">File Lampiran</p>
                      <div className="bg-white border border-gray-200 rounded-xl p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-green-50 rounded-lg">
                            <FileText className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">{fileName}</p>
                            <p className="text-[10px] text-gray-400">{fmtSize(surat.file_size)}</p>
                          </div>
                        </div>
                        {isSelesai && (
                          <button onClick={handleDownload} disabled={downloading}
                            className="flex items-center justify-center gap-1.5 w-full py-1.5 text-xs text-green-700 bg-green-50 hover:bg-green-100 rounded-lg font-medium transition-colors disabled:opacity-60">
                            {downloading
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : <Download className="w-3.5 h-3.5" />}
                            Unduh File
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-gray-100 bg-gray-50 flex-shrink-0">
          <p className="text-xs text-gray-400">
            {!hasFile    ? "Tidak ada file terlampir"
              : hasPdf   ? "PDF · Gunakan toolbar untuk navigasi halaman"
              : hasImg   ? "Gambar · Gunakan kontrol zoom di atas"
              :            "File tidak dapat ditampilkan — unduh untuk membuka"}
          </p>
          <p className="text-xs text-gray-400 hidden sm:block">
            Tekan{" "}
            <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-500 font-mono text-[10px]">Esc</kbd>
            {" "}untuk menutup
          </p>
        </div>
      </div>
    </div>
  );
}

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

  const [searchInput, setSearchInput] = useState(searchParams.get("nomor") || "");
  const [search, setSearch]           = useState(searchParams.get("nomor") || "");
  const [page, setPage]               = useState(1);
  const LIMIT = 10;

  const [suratList, setSuratList]   = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading]       = useState(false);

  const [selectedSurat, setSelectedSurat] = useState(null);
  const [modalOpen, setModalOpen]         = useState(false);

  // ── Fetch list ──
  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const { data, pagination: pg } = await suratPublicService.getAllSurat({
        page, limit: LIMIT, search,
      });
      setSuratList(data);
      setPagination(pg);
    } catch (err) {
      toast.error(err.message || "Gagal memuat data surat");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchList(); }, [fetchList]);

  // ── Handlers ──
  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchInput.trim();
    setPage(1);
    setSearch(q);
    q ? setSearchParams({ nomor: q }) : setSearchParams({});
  };

  const handleReset = () => {
    setSearchInput(""); setSearch(""); setPage(1); setSearchParams({});
  };

  const openModal = (surat) => { setSelectedSurat(surat); setModalOpen(true); };

  const handleDownloadRow = async (surat, e) => {
    e.stopPropagation();
    if (!surat.file_path) { toast.error("File belum tersedia"); return; }
    const tid = toast.loading("Menyiapkan file...");
    try {
      const blob = await suratPublicService.downloadSurat(surat);
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `Surat_${surat.nomor_surat || surat.id}.pdf`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
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

  // ── Render ──
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl mb-5 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Cek & Download Surat</h1>
          <p className="text-gray-500">
            Cari berdasarkan nomor surat atau telusuri semua surat yang tersedia.
          </p>
        </div>

        {/* Search card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-green-100/50 border border-green-100 p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">Nomor Surat</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Contoh: 001/SK/XII/2024"
                  className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none text-sm transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Search className="w-4 h-4" />}
                {loading ? "Mencari..." : "Cari"}
              </button>
              {search && (
                <button type="button" onClick={handleReset}
                  className="px-4 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-all">
                  Reset
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400">
              * Nomor surat dapat ditemukan pada tanda terima pengajuan Anda.
            </p>
          </form>

          {search && !loading && (
            <p className="mt-3 text-xs text-gray-400">
              Hasil untuk: <span className="font-semibold text-green-700">"{search}"</span>
              {pagination.total !== undefined && ` — ${pagination.total} surat ditemukan`}
            </p>
          )}
        </div>

        {/* List card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-green-100/50 border border-green-100 overflow-hidden">

          {/* List header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-700 text-sm">
              {search ? "Hasil Pencarian" : "Semua Surat"}
            </h2>
            {!loading && pagination.total !== undefined && (
              <span className="text-xs text-gray-400">{pagination.total} surat</span>
            )}
          </div>

          {/* Rows */}
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
          ) : suratList.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Inbox className="w-14 h-14 mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">Tidak ada surat ditemukan</p>
              {search && (
                <button onClick={handleReset} className="mt-2 text-xs text-green-600 underline">
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
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {surat.nomor_surat || `ID: ${surat.id}`}
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {surat.perihal || "-"}
                    <span className="mx-1.5">·</span>
                    {fmtDate(surat.tanggal_dokumen)}
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
                  {surat.status?.toLowerCase() === "selesai" && surat.file_path && (
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

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">Halaman {page} dari {totalPages}</p>
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
                    <span key={`dot-${idx}`} className="w-8 text-center text-gray-400 text-xs">…</span>
                  ) : (
                    <button
                      key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${p === page ? "bg-green-600 text-white shadow-sm" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                    >
                      {p}
                    </button>
                  )
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

      {/* Modal */}
      <SuratPublicModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        surat={selectedSurat}
      />
    </div>
  );
}