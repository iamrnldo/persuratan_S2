/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
// frontend/src/pages/admin/Surat/SuratDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Download,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  Archive,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { suratService } from "../../../api/suratService";
import { Button } from "../../../components/common/Button";
import { Badge } from "../../../components/common/Badge";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { DisposisiModal } from "./DisposisiModal";
import { formatDateTime } from "../../../utils/helpers";

const STATUS_CONFIG = {
  baru: { variant: "info", label: "Baru", icon: AlertCircle },
  diproses: { variant: "warning", label: "Diproses", icon: Clock },
  selesai: { variant: "success", label: "Selesai", icon: CheckCircle2 },
  diarsipkan: { variant: "danger", label: "Diarsipkan", icon: Archive },
};

const DISPOSISI_STATUS_CONFIG = {
  belum_ditindaklanjuti: { variant: "danger", label: "Belum Ditindaklanjuti" },
  sedang_diproses: { variant: "warning", label: "Sedang Diproses" },
  selesai: { variant: "success", label: "Selesai" },
};

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:gap-4 py-2.5 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-500 sm:w-44 flex-shrink-0">{label}</span>
    <span className="text-sm text-gray-900 font-medium mt-0.5 sm:mt-0">
      {value || <span className="text-gray-300 font-normal">—</span>}
    </span>
  </div>
);

const SuratDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [surat, setSurat] = useState(null);
  const [loading, setLoading] = useState(true);

  const [disposisiModal, setDisposisiModal] = useState({
    open: false,
    data: null,
  });
  const [deleteDisposisiDialog, setDeleteDisposisiDialog] = useState({
    open: false,
    id: null,
  });
  const [deleteDisposisiLoading, setDeleteDisposisiLoading] = useState(false);

  const fetchSurat = async () => {
    try {
      setLoading(true);
      const response = await suratService.getById(id);
      setSurat(response.data);
    } catch (error) {
      toast.error("Gagal memuat data surat");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurat();
  }, [id]);

  const handleDeleteDisposisi = async () => {
    setDeleteDisposisiLoading(true);
    try {
      await suratService.deleteDisposisi(deleteDisposisiDialog.id);
      toast.success("Disposisi berhasil dihapus");
      setDeleteDisposisiDialog({ open: false, id: null });
      fetchSurat();
    } catch (error) {
      toast.error("Gagal menghapus disposisi");
    } finally {
      setDeleteDisposisiLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      await suratService.updateStatus(surat.id, status);
      toast.success("Status berhasil diperbarui");
      fetchSurat();
    } catch (error) {
      toast.error("Gagal memperbarui status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-8 h-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (!surat) return null;

  const statusConfig = STATUS_CONFIG[surat.status] || STATUS_CONFIG.baru;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors mt-0.5"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900">Detail Surat</h1>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                surat.jenis === "masuk"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              Surat {surat.jenis === "masuk" ? "Masuk" : "Keluar"}
            </span>
            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
          </div>
          <p className="text-gray-500 text-sm mt-1">{surat.perihal}</p>
        </div>

        {/* Status Actions */}
        <div className="flex gap-2 flex-wrap">
          {surat.status !== "diproses" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleUpdateStatus("diproses")}
            >
              Tandai Diproses
            </Button>
          )}
          {surat.status !== "selesai" && (
            <Button
              variant="success"
              size="sm"
              onClick={() => handleUpdateStatus("selesai")}
            >
              Tandai Selesai
            </Button>
          )}
          {surat.status !== "diarsipkan" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleUpdateStatus("diarsipkan")}
            >
              Arsipkan
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detail Surat */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">
              Informasi Surat
            </h2>
            <InfoRow label="Nomor Agenda" value={surat.nomor_agenda} />
            <InfoRow label="Nomor Surat" value={surat.nomor_surat} />
            <InfoRow label="Perihal" value={surat.perihal} />
            <InfoRow
              label={surat.jenis === "masuk" ? "Pengirim" : "Tujuan"}
              value={surat.pengirim_tujuan}
            />
            <InfoRow
              label="Tanggal Surat"
              value={
                surat.tanggal_surat
                  ? new Date(surat.tanggal_surat).toLocaleDateString("id-ID", {
                      dateStyle: "long",
                    })
                  : null
              }
            />
            <InfoRow
              label={
                surat.jenis === "masuk" ? "Tanggal Diterima" : "Tanggal Dikirim"
              }
              value={
                surat.tanggal_dokumen
                  ? new Date(surat.tanggal_dokumen).toLocaleDateString(
                      "id-ID",
                      { dateStyle: "long" },
                    )
                  : null
              }
            />
            <InfoRow
              label="Klasifikasi"
              value={
                surat.klasifikasi_kode
                  ? `${surat.klasifikasi_kode} - ${surat.klasifikasi_nama}`
                  : null
              }
            />
            <InfoRow label="Keterangan" value={surat.keterangan} />
            <InfoRow label="Dibuat oleh" value={surat.created_by_nama} />
            <InfoRow
              label="Dibuat pada"
              value={formatDateTime(surat.created_at)}
            />
          </div>

          {/* File */}
          {surat.file_name && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">
                File Terlampir
              </h2>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="w-8 h-8 text-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {surat.file_name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {surat.file_size
                      ? (surat.file_size / 1024).toFixed(1) + " KB"
                      : ""}
                  </p>
                </div>
                <a
                  href={`${import.meta.env.VITE_API_URL?.replace("/api/v1", "")}/${surat.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Unduh
                </a>
              </div>
            </div>
          )}

          {/* Disposisi */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-800">
                Disposisi
                {surat.disposisi?.length > 0 && (
                  <span className="ml-2 text-xs font-normal bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {surat.disposisi.length}
                  </span>
                )}
              </h2>
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => setDisposisiModal({ open: true, data: null })}
              >
                Tambah
              </Button>
            </div>

            {surat.disposisi?.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">
                Belum ada disposisi
              </p>
            ) : (
              <div className="space-y-3">
                {surat.disposisi?.map((d) => {
                  const dStatus =
                    DISPOSISI_STATUS_CONFIG[d.status] ||
                    DISPOSISI_STATUS_CONFIG.belum_ditindaklanjuti;
                  return (
                    <div
                      key={d.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-sm font-semibold text-gray-800">
                              {d.dari}
                            </span>
                            <span className="text-gray-400 text-xs">→</span>
                            <span className="text-sm font-semibold text-gray-800">
                              {d.kepada}
                            </span>
                            <Badge variant={dStatus.variant}>
                              {dStatus.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">
                            {d.instruksi}
                          </p>
                          {d.catatan && (
                            <p className="text-xs text-gray-500 mt-1 italic">
                              {d.catatan}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            {d.tanggal_disposisi
                              ? new Date(
                                  d.tanggal_disposisi,
                                ).toLocaleDateString("id-ID", {
                                  dateStyle: "long",
                                })
                              : ""}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() =>
                              setDisposisiModal({ open: true, data: d })
                            }
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteDisposisiDialog({ open: true, id: d.id })
                            }
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Status Surat
            </h3>
            <div className="space-y-2">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={key}
                    onClick={() => handleUpdateStatus(key)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                      surat.status === key
                        ? "bg-primary-50 text-primary-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {config.label}
                    {surat.status === key && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-primary-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Disposisi Modal */}
      <DisposisiModal
        isOpen={disposisiModal.open}
        onClose={() => setDisposisiModal({ open: false, data: null })}
        onSuccess={() => {
          setDisposisiModal({ open: false, data: null });
          fetchSurat();
        }}
        suratId={id}
        disposisi={disposisiModal.data}
      />

      {/* Delete Disposisi */}
      <ConfirmDialog
        isOpen={deleteDisposisiDialog.open}
        onClose={() => setDeleteDisposisiDialog({ open: false, id: null })}
        onConfirm={handleDeleteDisposisi}
        loading={deleteDisposisiLoading}
        message="Apakah Anda yakin ingin menghapus disposisi ini?"
      />
    </div>
  );
};

export default SuratDetail;
