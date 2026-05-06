import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Upload, X, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "../../../components/common/Modal";
import { Input } from "../../../components/common/Input";
import { Textarea } from "../../../components/common/Textarea";
import { Select } from "../../../components/common/Select";
import { Button } from "../../../components/common/Button";
import { suratService } from "../../../api/suratService";
import { klasifikasiSuratService } from "../../../api/klasifikasiSuratService";

const JENIS_OPTIONS = [
  { value: "masuk", label: "Surat Masuk" },
  { value: "keluar", label: "Surat Keluar" },
];

const STATUS_OPTIONS = [
  { value: "baru", label: "Baru" },
  { value: "diproses", label: "Diproses" },
  { value: "selesai", label: "Selesai" },
  { value: "diarsipkan", label: "Diarsipkan" },
];

export const SuratModal = ({ isOpen, onClose, onSuccess, surat }) => {
  const isEdit = !!surat;
  const [klasifikasiOptions, setKlasifikasiOptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      jenis: "masuk",
      nomor_agenda: "",
      nomor_surat: "",
      tanggal_surat: "",
      tanggal_dokumen: "",
      pengirim_tujuan: "",
      perihal: "",
      klasifikasi_id: "",
      status: "baru",
      keterangan: "",
    },
  });

  const jenis = watch("jenis");

  useEffect(() => {
    const fetchKlasifikasi = async () => {
      try {
        const response = await klasifikasiSuratService.getAll({ limit: 100 });
        setKlasifikasiOptions(
          response.data.map((k) => ({
            value: k.id,
            label: `${k.kode} - ${k.nama}`,
          })),
        );
      } catch (error) {
        console.error("Failed to load klasifikasi:", error);
      }
    };
    if (isOpen) fetchKlasifikasi();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      if (surat) {
        reset({
          jenis: surat.jenis || "masuk",
          nomor_agenda: surat.nomor_agenda || "",
          nomor_surat: surat.nomor_surat || "",
          tanggal_surat: surat.tanggal_surat?.split("T")[0] || "",
          tanggal_dokumen: surat.tanggal_dokumen?.split("T")[0] || "",
          pengirim_tujuan: surat.pengirim_tujuan || "",
          perihal: surat.perihal || "",
          klasifikasi_id: surat.klasifikasi_id || "",
          status: surat.status || "baru",
          keterangan: surat.keterangan || "",
        });
      } else {
        reset({
          jenis: "masuk",
          nomor_agenda: "",
          nomor_surat: "",
          tanggal_surat: "",
          tanggal_dokumen: "",
          pengirim_tujuan: "",
          perihal: "",
          klasifikasi_id: "",
          status: "baru",
          keterangan: "",
        });
      }
    }
  }, [isOpen, surat, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([k, v]) => {
        if (v !== "" && v !== null && v !== undefined) {
          formData.append(k, v);
        }
      });

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      if (isEdit) {
        await suratService.update(surat.id, formData);
        toast.success("Surat berhasil diperbarui");
      } else {
        await suratService.create(formData);
        toast.success("Surat berhasil ditambahkan");
      }
      onSuccess();
    } catch (error) {
      const message = error.response?.data?.message || "Terjadi kesalahan";
      toast.error(message);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Surat" : "Tambah Surat"}
      size="lg"
      closeOnBackdrop={!isSubmitting}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          {/* Jenis */}
          <div className="sm:col-span-2">
            <Select
              label="Jenis Surat"
              required
              options={JENIS_OPTIONS}
              error={errors.jenis?.message}
              {...register("jenis", { required: "Jenis surat wajib dipilih" })}
            />
          </div>

          {/* Nomor Agenda */}
          <Input
            label="Nomor Agenda"
            error={errors.nomor_agenda?.message}
            placeholder="Contoh: 001/2026"
            {...register("nomor_agenda")}
          />

          {/* Nomor Surat */}
          <Input
            label="Nomor Surat"
            error={errors.nomor_surat?.message}
            placeholder="Nomor surat asli"
            {...register("nomor_surat")}
          />

          {/* Tanggal Surat */}
          <Input
            label="Tanggal Surat"
            type="date"
            error={errors.tanggal_surat?.message}
            {...register("tanggal_surat")}
          />

          {/* Tanggal Diterima/Dikirim */}
          <Input
            label={jenis === "masuk" ? "Tanggal Diterima" : "Tanggal Dikirim"}
            type="date"
            error={errors.tanggal_dokumen?.message}
            {...register("tanggal_dokumen")}
          />

          {/* Pengirim/Tujuan */}
          <div className="sm:col-span-2">
            <Input
              label={jenis === "masuk" ? "Pengirim" : "Tujuan"}
              error={errors.pengirim_tujuan?.message}
              placeholder={
                jenis === "masuk"
                  ? "Nama instansi/perorangan pengirim"
                  : "Nama instansi/perorangan tujuan"
              }
              {...register("pengirim_tujuan")}
            />
          </div>

          {/* Perihal */}
          <div className="sm:col-span-2">
            <Textarea
              label="Perihal"
              required
              rows={2}
              error={errors.perihal?.message}
              placeholder="Perihal / isi ringkas surat..."
              {...register("perihal", { required: "Perihal wajib diisi" })}
            />
          </div>

          {/* Klasifikasi */}
          <Select
            label="Klasifikasi Surat"
            options={klasifikasiOptions}
            placeholder="Pilih klasifikasi..."
            error={errors.klasifikasi_id?.message}
            {...register("klasifikasi_id")}
          />

          {/* Status */}
          <Select
            label="Status"
            options={STATUS_OPTIONS}
            error={errors.status?.message}
            {...register("status")}
          />

          {/* Keterangan */}
          <div className="sm:col-span-2">
            <Textarea
              label="Keterangan"
              rows={2}
              error={errors.keterangan?.message}
              placeholder="Keterangan tambahan..."
              {...register("keterangan")}
            />
          </div>

          {/* Upload File */}
          <div className="sm:col-span-2 mb-4">
            <label className="label">
              File Surat
              <span className="text-gray-400 font-normal ml-1">
                (PDF, DOC, DOCX, JPG, PNG — maks. 10MB)
              </span>
            </label>

            {/* Existing file info */}
            {isEdit && surat?.file_name && !selectedFile && (
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg mb-2 text-sm">
                <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-blue-700 truncate">
                  {surat.file_name}
                </span>
                <span className="text-blue-400 text-xs ml-auto">
                  {surat.file_size ? formatFileSize(surat.file_size) : ""}
                </span>
              </div>
            )}

            {/* Selected file preview */}
            {selectedFile && (
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg mb-2 text-sm">
                <FileText className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-green-700 truncate">
                  {selectedFile.name}
                </span>
                <span className="text-green-400 text-xs">
                  {formatFileSize(selectedFile.size)}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="ml-auto text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
              <Upload className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">
                {selectedFile
                  ? "Ganti file..."
                  : isEdit && surat?.file_name
                    ? "Ganti file (opsional)..."
                    : "Pilih file..."}
              </span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => setSelectedFile(e.target.files[0] || null)}
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 mt-2">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
            type="button"
          >
            Batal
          </Button>
          <Button variant="primary" type="submit" loading={isSubmitting}>
            {isEdit ? "Simpan Perubahan" : "Tambah Surat"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
