/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Upload, X, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { strukturOrganisasiService } from "../../../api/strukturOrganisasiService";
import { Modal } from "../../../components/common/Modal";
import { Input } from "../../../components/common/Input";
import { Button } from "../../../components/common/Button";
import { getImageUrl } from "../../../utils/imageUrl";

export const StrukturOrganisasiModal = ({
  isOpen,
  onClose,
  onSuccess,
  struktur,
}) => {
  const isEdit = !!struktur;
  const [loading, setLoading] = useState(false);
  const [parentOptions, setParentOptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch parent options
  useEffect(() => {
    if (isOpen) {
      strukturOrganisasiService
        .getAll({ is_active: true })
        .then((res) => {
          const list = res.data ?? [];
          setParentOptions(
            isEdit ? list.filter((i) => i.id !== struktur.id) : list,
          );
        })
        .catch(() => setParentOptions([]));
    }
  }, [isOpen]);

  // Reset form & file state setiap buka modal
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setPreviewUrl(null);

      if (struktur) {
        reset({
          nama: struktur.nama,
          jabatan: struktur.jabatan,
          parent_id: struktur.parent_id ?? "",
          level: struktur.level,
          urutan: struktur.urutan,
          is_active: struktur.is_active,
        });
        // Tampilkan foto existing sebagai preview dengan URL absolut
        if (struktur.foto) setPreviewUrl(getImageUrl(struktur.foto));
      } else {
        reset({
          nama: "",
          jabatan: "",
          parent_id: "",
          level: 1,
          urutan: 0,
          is_active: true,
        });
      }
    }
  }, [isOpen, struktur]);

  // Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format file tidak didukung. Gunakan JPG, PNG, atau WebP.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    // Jika edit & ada foto existing, kembalikan preview ke foto existing
    setPreviewUrl(isEdit && struktur?.foto ? getImageUrl(struktur.foto) : null);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Submit
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("nama", data.nama);
      formData.append("jabatan", data.jabatan);
      formData.append("level", parseInt(data.level) || 1);
      formData.append("urutan", parseInt(data.urutan) || 0);
      formData.append(
        "is_active",
        data.is_active === true || data.is_active === "true",
      );
      formData.append(
        "parent_id",
        data.parent_id ? parseInt(data.parent_id) : "",
      );

      if (selectedFile) {
        formData.append("foto", selectedFile);
      }

      if (isEdit) {
        await strukturOrganisasiService.update(struktur.id, formData);
        toast.success("Struktur organisasi berhasil diupdate");
      } else {
        await strukturOrganisasiService.create(formData);
        toast.success("Struktur organisasi berhasil ditambahkan");
      }

      onSuccess();
    } catch (error) {
      const message = error.response?.data?.message || "Terjadi kesalahan";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Anggota Struktur" : "Tambah Anggota Struktur"}
      size="md"
      closeOnBackdrop={!loading}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Nama */}
        <Input
          label="Nama"
          required
          placeholder="Masukkan nama lengkap..."
          error={errors.nama?.message}
          {...register("nama", { required: "Nama wajib diisi" })}
        />

        {/* Jabatan */}
        <Input
          label="Jabatan"
          required
          placeholder="Masukkan jabatan..."
          error={errors.jabatan?.message}
          {...register("jabatan", { required: "Jabatan wajib diisi" })}
        />

        {/* Parent */}
        <div className="mb-4">
          <label className="label">
            Atasan / Parent{" "}
            <span className="text-gray-400 font-normal">(opsional)</span>
          </label>
          <select
            className={`input-field ${errors.parent_id ? "input-error" : ""}`}
            {...register("parent_id")}
          >
            <option value="">— Tidak ada (root) —</option>
            {parentOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama} — {item.jabatan}
              </option>
            ))}
          </select>
          {errors.parent_id && (
            <p className="text-xs text-red-500 mt-1">
              {errors.parent_id.message}
            </p>
          )}
        </div>

        {/* Level & Urutan */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Level"
            type="number"
            min="1"
            placeholder="1"
            error={errors.level?.message}
            {...register("level", {
              min: { value: 1, message: "Level minimal 1" },
            })}
          />
          <Input
            label="Urutan"
            type="number"
            min="0"
            placeholder="0"
            error={errors.urutan?.message}
            {...register("urutan")}
          />
        </div>

        {/* Upload Foto */}
        <div className="mb-4">
          <label className="label">
            Foto{" "}
            <span className="text-gray-400 font-normal">
              (JPG, PNG, WebP — maks. 2MB)
            </span>
          </label>

          {/* Preview */}
          {previewUrl && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 mb-3">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="flex-1 min-w-0">
                {selectedFile ? (
                  <>
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">Foto saat ini</p>
                )}
              </div>
              {/* Hapus pilihan file baru */}
              {selectedFile && (
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500
                    hover:bg-red-50 transition-colors flex-shrink-0"
                  title="Hapus pilihan"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Drop zone */}
          <label
            className="flex items-center gap-3 px-4 py-3 border-2 border-dashed
              border-gray-300 rounded-xl cursor-pointer
              hover:border-primary-400 hover:bg-primary-50 transition-colors group"
          >
            <div
              className="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-primary-100
              flex items-center justify-center flex-shrink-0 transition-colors"
            >
              {previewUrl ? (
                <ImageIcon className="w-4 h-4 text-gray-400 group-hover:text-primary-500" />
              ) : (
                <Upload className="w-4 h-4 text-gray-400 group-hover:text-primary-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 group-hover:text-primary-600">
                {selectedFile
                  ? "Ganti foto..."
                  : isEdit && struktur?.foto
                    ? "Ganti foto (opsional)..."
                    : "Pilih foto..."}
              </p>
              <p className="text-xs text-gray-400">JPG, PNG, WebP maks. 2MB</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="label">Status</label>
          <select
            className={`input-field ${errors.is_active ? "input-error" : ""}`}
            {...register("is_active")}
          >
            <option value={true}>Aktif</option>
            <option value={false}>Nonaktif</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {isEdit ? "Simpan Perubahan" : "Tambah Anggota"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
