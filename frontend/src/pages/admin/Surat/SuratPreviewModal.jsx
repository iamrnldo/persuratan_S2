/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
// frontend/src/pages/admin/Surat/SuratPreviewModal.jsx
import { useEffect, useState, useCallback } from "react";
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ─── helpers ───────────────────────────────────────────────────────────────────
const getFileUrl = (filePath) => {
  if (!filePath) return null;
  if (filePath.startsWith("http://") || filePath.startsWith("https://"))
    return filePath;
  const base =
    import.meta.env.VITE_API_URL?.replace("/api/v1", "") ||
    "http://localhost:5000";
  // filePath bisa "uploads/surat/xxx.pdf" atau "/uploads/surat/xxx.pdf"
  const clean = filePath.startsWith("/") ? filePath : `/${filePath}`;
  return `${base}${clean}`;
};

const getFileExt = (fileName = "") => fileName.split(".").pop().toLowerCase();

const isPdf = (fileName) => getFileExt(fileName) === "pdf";
const isImage = (fileName) =>
  ["jpg", "jpeg", "png", "webp", "gif"].includes(getFileExt(fileName));
const isOffice = (fileName) =>
  ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(getFileExt(fileName));

const FILE_ICON_MAP = {
  pdf: { color: "text-red-500", bg: "bg-red-50", label: "PDF" },
  doc: { color: "text-blue-600", bg: "bg-blue-50", label: "Word" },
  docx: { color: "text-blue-600", bg: "bg-blue-50", label: "Word" },
  xls: { color: "text-emerald-600", bg: "bg-emerald-50", label: "Excel" },
  xlsx: { color: "text-emerald-600", bg: "bg-emerald-50", label: "Excel" },
  ppt: { color: "text-orange-500", bg: "bg-orange-50", label: "PowerPoint" },
  pptx: { color: "text-orange-500", bg: "bg-orange-50", label: "PowerPoint" },
};

const formatSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ─── sub-components ────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    baru: "bg-blue-100 text-blue-700",
    diproses: "bg-amber-100 text-amber-700",
    selesai: "bg-emerald-100 text-emerald-700",
    diarsipkan: "bg-red-100 text-red-700",
  };
  const label = {
    baru: "Baru",
    diproses: "Diproses",
    selesai: "Selesai",
    diarsipkan: "Diarsipkan",
  };
  return (
    <span
      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${map[status] ?? "bg-gray-100 text-gray-500"}`}
    >
      {label[status] ?? status}
    </span>
  );
};

const MetaRow = ({ label, value }) =>
  value ? (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
        {label}
      </span>
      <span className="text-sm text-gray-800 font-medium leading-snug">
        {value}
      </span>
    </div>
  ) : null;

// ─── PDF viewer ────────────────────────────────────────────────────────────────
const PdfViewer = ({ url, fileName }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
        <AlertCircle className="w-12 h-12 opacity-40" />
        <p className="text-sm">Tidak bisa menampilkan PDF di browser ini.</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <ExternalLink className="w-4 h-4" />
          Buka di tab baru
        </a>
      </div>
    );
  }

  return (
    <iframe
      src={`${url}#toolbar=1&navpanes=0&scrollbar=1`}
      title={fileName}
      className="w-full h-full rounded-lg"
      onError={() => setError(true)}
    />
  );
};

// ─── Image viewer ──────────────────────────────────────────────────────────────
const ImageViewer = ({ url, fileName, zoom, onZoomIn, onZoomOut, onReset }) => {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
        <AlertCircle className="w-12 h-12 opacity-40" />
        <p className="text-sm">Gambar tidak bisa dimuat.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Zoom controls */}
      <div className="flex items-center justify-center gap-1 mb-3 flex-shrink-0">
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
          <button
            onClick={onZoomOut}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={onReset}
            className="px-2 py-1 text-xs font-mono text-gray-600 hover:bg-gray-100 rounded min-w-[48px] text-center transition-colors"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={onZoomIn}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={onReset}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors"
            title="Reset zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Image canvas */}
      <div className="flex-1 overflow-auto flex items-start justify-center">
        <img
          src={url}
          alt={fileName}
          className="transition-transform duration-200 ease-out rounded-lg shadow-md"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            maxWidth: "100%",
          }}
          onError={() => setImgError(true)}
        />
      </div>
    </div>
  );
};

// ─── Office / unsupported file fallback ───────────────────────────────────────
const OfficeFallback = ({ url, fileName, fileSize }) => {
  const ext = getFileExt(fileName);
  const meta = FILE_ICON_MAP[ext] ?? {
    color: "text-gray-500",
    bg: "bg-gray-100",
    label: ext.toUpperCase(),
  };

  // Try Microsoft Office Online viewer (works only if URL is publicly accessible)
  const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  const [useViewer, setUseViewer] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-5">
      {useViewer ? (
        <div className="w-full h-full flex flex-col gap-3">
          <div className="flex items-center justify-between px-2">
            <p className="text-xs text-gray-400">
              Menampilkan via Microsoft Office Online (butuh koneksi internet &
              URL publik)
            </p>
            <button
              onClick={() => setUseViewer(false)}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Tutup viewer
            </button>
          </div>
          <iframe
            src={officeViewerUrl}
            className="flex-1 w-full rounded-lg border border-gray-200"
            title={fileName}
          />
        </div>
      ) : (
        <>
          {/* File icon */}
          <div
            className={`w-20 h-20 rounded-2xl ${meta.bg} flex items-center justify-center shadow-sm`}
          >
            <FileText className={`w-10 h-10 ${meta.color}`} />
          </div>

          {/* File info */}
          <div className="text-center space-y-1">
            <p className="font-semibold text-gray-800">{fileName}</p>
            <p className="text-sm text-gray-400">
              {meta.label} · {formatSize(fileSize)}
            </p>
          </div>

          {/* Info note */}
          <div className="flex items-start gap-2 max-w-sm bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-left">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              File <strong>{meta.label}</strong> tidak dapat ditampilkan
              langsung di browser. Unduh file untuk membukanya, atau coba buka
              lewat Microsoft Office Online (membutuhkan URL yang dapat diakses
              publik).
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <a
              href={url}
              download={fileName}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white
                text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Unduh File
            </a>
            <button
              onClick={() => setUseViewer(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200
                text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Coba Office Viewer
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// ─── No-file fallback ──────────────────────────────────────────────────────────
const NoFile = () => (
  <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
    <FileText className="w-14 h-14 opacity-25" />
    <p className="text-sm">Tidak ada file terlampir pada surat ini.</p>
  </div>
);

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
/**
 * SuratPreviewModal
 *
 * Props:
 *   isOpen  – boolean
 *   onClose – () => void
 *   surat   – object dari suratService.getById (data surat lengkap)
 */
const SuratPreviewModal = ({ isOpen, onClose, surat }) => {
  const [zoom, setZoom] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fileUrl = getFileUrl(surat?.file_path);
  const fileName = surat?.file_name ?? "";
  const hasPdf = isPdf(fileName);
  const hasImage = isImage(fileName);
  const hasOffice = isOffice(fileName);
  const hasFile = !!(surat?.file_path && fileName);

  // Escape key
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Reset zoom on open
  useEffect(() => {
    if (isOpen) setZoom(1);
  }, [isOpen]);

  const zoomIn = useCallback(
    () => setZoom((z) => Math.min(+(z + 0.2).toFixed(1), 3)),
    [],
  );
  const zoomOut = useCallback(
    () => setZoom((z) => Math.max(+(z - 0.2).toFixed(1), 0.3)),
    [],
  );
  const resetZoom = useCallback(() => setZoom(1), []);

  if (!isOpen || !surat) return null;

  const jenisLabel = surat.jenis === "masuk" ? "Surat Masuk" : "Surat Keluar";
  const jenisBg =
    surat.jenis === "masuk"
      ? "bg-blue-100 text-blue-700"
      : "bg-purple-100 text-purple-700";

  const tanggalSurat = surat.tanggal_surat
    ? new Date(surat.tanggal_surat).toLocaleDateString("id-ID", {
        dateStyle: "long",
      })
    : null;
  const tanggalDokumen = surat.tanggal_dokumen
    ? new Date(surat.tanggal_dokumen).toLocaleDateString("id-ID", {
        dateStyle: "long",
      })
    : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 flex-shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-blue-50 rounded-xl flex-shrink-0">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-bold text-gray-800 text-base leading-tight">
                  Preview Surat
                </h2>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${jenisBg}`}
                >
                  {jenisLabel}
                </span>
                <StatusBadge status={surat.status} />
              </div>
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {surat.perihal || "Tanpa perihal"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Toggle sidebar */}
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className={`p-2 rounded-xl transition-colors text-sm font-medium ${
                sidebarOpen
                  ? "bg-primary-50 text-primary-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              title="Toggle detail surat"
            >
              {sidebarOpen ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>

            {/* Download */}
            {hasFile && (
              <a
                href={fileUrl}
                download={fileName}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm
                  font-medium text-blue-600 bg-blue-50 hover:bg-blue-100
                  transition-colors"
              >
                <Download className="w-4 h-4" />
                Unduh
              </a>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 overflow-hidden">
          {/* ── File viewer ── */}
          <div
            className="flex-1 overflow-hidden p-4"
            style={{
              background:
                "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              backgroundColor: "#f9fafb",
            }}
          >
            {!hasFile ? (
              <NoFile />
            ) : hasPdf ? (
              <PdfViewer url={fileUrl} fileName={fileName} />
            ) : hasImage ? (
              <ImageViewer
                url={fileUrl}
                fileName={fileName}
                zoom={zoom}
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
                onReset={resetZoom}
              />
            ) : (
              <OfficeFallback
                url={fileUrl}
                fileName={fileName}
                fileSize={surat?.file_size}
              />
            )}
          </div>

          {/* ── Sidebar detail ── */}
          {sidebarOpen && (
            <div className="w-64 flex-shrink-0 border-l border-gray-100 overflow-y-auto bg-gray-50/60">
              <div className="p-4 space-y-4">
                {/* Informasi Surat */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                    Informasi Surat
                  </p>
                  <div className="space-y-3">
                    <MetaRow label="Nomor Agenda" value={surat.nomor_agenda} />
                    <MetaRow label="Nomor Surat" value={surat.nomor_surat} />
                    <MetaRow label="Perihal" value={surat.perihal} />
                    <MetaRow
                      label={surat.jenis === "masuk" ? "Pengirim" : "Tujuan"}
                      value={surat.pengirim_tujuan}
                    />
                    <MetaRow label="Tanggal Surat" value={tanggalSurat} />
                    <MetaRow
                      label={
                        surat.jenis === "masuk"
                          ? "Tanggal Diterima"
                          : "Tanggal Dikirim"
                      }
                      value={tanggalDokumen}
                    />
                    <MetaRow
                      label="Klasifikasi"
                      value={
                        surat.klasifikasi_kode
                          ? `${surat.klasifikasi_kode} – ${surat.klasifikasi_nama}`
                          : null
                      }
                    />
                    <MetaRow label="Keterangan" value={surat.keterangan} />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200" />

                {/* File info */}
                {hasFile && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                      File Lampiran
                    </p>
                    <div className="bg-white border border-gray-200 rounded-xl p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-50 rounded-lg">
                          <FileText className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">
                            {fileName}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {formatSize(surat.file_size)}
                          </p>
                        </div>
                      </div>
                      <a
                        href={fileUrl}
                        download={fileName}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 w-full py-1.5 text-xs
                          text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg
                          font-medium transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Unduh File
                      </a>
                    </div>
                  </div>
                )}

                {/* Disposisi count */}
                {surat.disposisi?.length > 0 && (
                  <>
                    <div className="border-t border-gray-200" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                        Disposisi
                      </p>
                      <div className="space-y-2">
                        {surat.disposisi.map((d) => (
                          <div
                            key={d.id}
                            className="bg-white border border-gray-200 rounded-xl p-3"
                          >
                            <p className="text-xs font-semibold text-gray-700">
                              {d.dari}{" "}
                              <span className="text-gray-400 font-normal">
                                →
                              </span>{" "}
                              {d.kepada}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {d.instruksi}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-gray-100 bg-gray-50 flex-shrink-0">
          <p className="text-xs text-gray-400">
            {!hasFile
              ? "Tidak ada file terlampir"
              : hasPdf
                ? "File PDF · Gunakan toolbar PDF untuk zoom & navigasi halaman"
                : hasImage
                  ? "File Gambar · Gunakan kontrol zoom di atas gambar"
                  : `File ${getFileExt(fileName).toUpperCase()} · Tidak dapat ditampilkan langsung — unduh untuk membuka`}
          </p>
          <p className="text-xs text-gray-400 hidden sm:block">
            Tekan{" "}
            <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-500 font-mono text-[10px]">
              Esc
            </kbd>{" "}
            untuk menutup
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuratPreviewModal;
