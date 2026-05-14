import { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Download,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Eye,
  Calendar,
  User,
  Hash,
  Printer,
} from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import suratPublicService from "@/api/suratPublicService";

const statusConfig = {
  selesai: { label: "Selesai", color: "green", icon: CheckCircle },
  diproses: { label: "Diproses", color: "yellow", icon: Clock },
  ditolak: { label: "Ditolak", color: "red", icon: XCircle },
  menunggu: { label: "Menunggu", color: "blue", icon: AlertCircle },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status?.toLowerCase()] || statusConfig.menunggu;
  const colorMap = {
    green: "bg-green-100 text-green-700 border-green-200",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
    red: "bg-red-100 text-red-700 border-red-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${colorMap[cfg.color]}`}
    >
      <cfg.icon className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
}

export default function PreviewDownloadSurat() {
  const [searchParams] = useSearchParams();
  const [nomorSurat, setNomorSurat] = useState(searchParams.get("nomor") || "");
  const [loading, setLoading] = useState(false);
  const [surat, setSurat] = useState(null);
  const [error, setError] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const inputRef = useRef(null);

  const handleCari = async (e) => {
    e?.preventDefault();
    const q = nomorSurat.trim();
    if (!q) {
      toast.error("Masukkan nomor surat terlebih dahulu");
      return;
    }

    setLoading(true);
    setError("");
    setSurat(null);

    try {
      const data = await suratPublicService.getSuratByNomor(q);
      setSurat(data);
      toast.success("Surat ditemukan");
    } catch (err) {
      const msg = err.message || "Surat tidak ditemukan";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!surat) return;

    const toastId = toast.loading("Menyiapkan file...");

    try {
      const blob = await suratPublicService.downloadSurat(surat.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Surat_${surat.nomor_surat || surat.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Surat berhasil diunduh", { id: toastId });
    } catch (err) {
      toast.error(err.message || "Gagal mengunduh surat", { id: toastId });
    }
  };

  const formatDate = (d) => {
    try {
      return format(new Date(d), "dd MMMM yyyy", { locale: localeId });
    } catch {
      return d || "-";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl mb-5 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Cek & Download Surat
          </h1>
          <p className="text-gray-500">
            Masukkan nomor surat untuk melihat status dan mengunduh dokumen
            Anda.
          </p>
        </div>

        {/* search card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-green-100/50 border border-green-100 p-8 mb-8">
          <form onSubmit={handleCari} className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nomor Surat
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={nomorSurat}
                  onChange={(e) => setNomorSurat(e.target.value)}
                  placeholder="Contoh: 001/SK/XII/2024"
                  className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none text-sm transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? (
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {loading ? "Mencari..." : "Cari"}
              </button>
            </div>
            <p className="text-xs text-gray-400">
              * Nomor surat dapat ditemukan pada tanda terima pengajuan Anda.
            </p>
          </form>
        </div>

        {/* error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4 mb-6">
            <XCircle className="w-8 h-8 text-red-500 shrink-0" />
            <div>
              <p className="font-semibold text-red-800">
                Surat Tidak Ditemukan
              </p>
              <p className="text-sm text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* result */}
        {surat && !loading && (
          <div className="bg-white rounded-3xl shadow-xl shadow-green-100/50 border border-green-100 overflow-hidden">
            {/* result header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-green-200 text-sm mb-1">Nomor Surat</p>
                  <p className="text-white font-bold text-lg">
                    {surat.nomor_surat || "-"}
                  </p>
                </div>
                <StatusBadge status={surat.status} />
              </div>
            </div>

            {/* detail rows */}
            <div className="p-8 space-y-4">
              {[
                {
                  icon: FileText,
                  label: "Jenis Surat",
                  value: surat.jenis_surat || surat.klasifikasi?.nama || "-",
                },
                {
                  icon: User,
                  label: "Nama Pemohon",
                  value: surat.nama_pemohon || "-",
                },
                {
                  icon: Calendar,
                  label: "Tanggal Pengajuan",
                  value: formatDate(surat.created_at),
                },
                {
                  icon: Calendar,
                  label: "Tanggal Selesai",
                  value:
                    surat.status === "selesai"
                      ? formatDate(surat.updated_at)
                      : "-",
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {value}
                    </p>
                  </div>
                </div>
              ))}

              {/* catatan */}
              {surat.catatan && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-yellow-700 mb-1">
                    Catatan Petugas
                  </p>
                  <p className="text-sm text-yellow-800">{surat.catatan}</p>
                </div>
              )}

              {/* actions */}
              <div className="flex flex-wrap gap-3 pt-2">
                {surat.status?.toLowerCase() === "selesai" && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:-translate-y-0.5 transform flex-1 sm:flex-none justify-center"
                  >
                    <Download className="w-4 h-4" />
                    Download Surat
                  </button>
                )}
                {surat.file_url && (
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="flex items-center gap-2 border-2 border-green-600 text-green-700 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-green-50 transition-all duration-200 flex-1 sm:flex-none justify-center"
                  >
                    <Eye className="w-4 h-4" />
                    {previewMode ? "Tutup Preview" : "Preview"}
                  </button>
                )}
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-3 rounded-xl text-sm hover:bg-gray-50 transition-all duration-200"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Cetak</span>
                </button>
              </div>

              {/* preview iframe */}
              {previewMode && surat.file_url && (
                <div className="mt-4 rounded-2xl overflow-hidden border border-green-100 shadow-inner">
                  <iframe
                    src={suratPublicService.getFileUrl(surat.file_url)}
                    className="w-full h-[600px]"
                    title="Preview Surat"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* empty state */}
        {!surat && !error && !loading && (
          <div className="text-center py-12 text-gray-400">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-sm">
              Masukkan nomor surat untuk melihat informasi
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
