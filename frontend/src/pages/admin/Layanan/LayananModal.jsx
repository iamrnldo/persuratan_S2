import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Modal } from "../../../components/common/Modal";
import { Input } from "../../../components/common/Input";
import { Textarea } from "../../../components/common/Textarea";
import { Select } from "../../../components/common/Select";
import { Button } from "../../../components/common/Button";
import { layananService } from "../../../api/layananService";

export const LayananModal = ({ isOpen, onClose, onSuccess, layanan }) => {
  const isEdit = !!layanan;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      nama: "",
      slug: "",
      deskripsi: "",
      icon: "",
      persyaratan: "",
      prosedur: "",
      urutan: 0,
      is_active: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (layanan) {
        reset({
          nama: layanan.nama || "",
          slug: layanan.slug || "",
          deskripsi: layanan.deskripsi || "",
          icon: layanan.icon || "",
          persyaratan: layanan.persyaratan || "",
          prosedur: layanan.prosedur || "",
          urutan: layanan.urutan ?? 0,
          is_active: layanan.is_active ?? true,
        });
      } else {
        reset({
          nama: "",
          slug: "",
          deskripsi: "",
          icon: "",
          persyaratan: "",
          prosedur: "",
          urutan: 0,
          is_active: true,
        });
      }
    }
  }, [isOpen, layanan, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        urutan: parseInt(data.urutan) || 0,
        is_active: data.is_active === true || data.is_active === "true",
        slug: data.slug || undefined,
      };

      if (isEdit) {
        await layananService.update(layanan.id, payload);
        toast.success("Layanan berhasil diperbarui");
      } else {
        await layananService.create(payload);
        toast.success("Layanan berhasil ditambahkan");
      }
      onSuccess();
    } catch (error) {
      const message = error.response?.data?.message || "Terjadi kesalahan";
      toast.error(message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Layanan" : "Tambah Layanan"}
      size="lg"
      closeOnBackdrop={!isSubmitting}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          {/* Nama */}
          <div className="sm:col-span-2">
            <Input
              label="Nama Layanan"
              required
              error={errors.nama?.message}
              placeholder="Contoh: Surat Keterangan Domisili"
              {...register("nama", {
                required: "Nama layanan wajib diisi",
                maxLength: { value: 100, message: "Maksimal 100 karakter" },
              })}
            />
          </div>

          {/* Slug */}
          <div className="sm:col-span-2">
            <Input
              label="Slug"
              error={errors.slug?.message}
              placeholder="Otomatis dari nama jika dikosongkan"
              {...register("slug", {
                maxLength: { value: 100, message: "Maksimal 100 karakter" },
              })}
            />
          </div>

          {/* Icon */}
          <Input
            label="Icon"
            error={errors.icon?.message}
            placeholder="Contoh: FileText"
            {...register("icon", {
              maxLength: { value: 50, message: "Maksimal 50 karakter" },
            })}
          />

          {/* Urutan */}
          <Input
            label="Urutan"
            type="number"
            error={errors.urutan?.message}
            placeholder="0"
            {...register("urutan", {
              min: { value: 0, message: "Urutan minimal 0" },
            })}
          />

          {/* Status */}
          <div className="sm:col-span-2">
            <Select
              label="Status"
              options={[
                { value: "true", label: "Aktif" },
                { value: "false", label: "Nonaktif" },
              ]}
              {...register("is_active")}
            />
          </div>

          {/* Deskripsi */}
          <div className="sm:col-span-2">
            <Textarea
              label="Deskripsi"
              rows={3}
              error={errors.deskripsi?.message}
              placeholder="Deskripsi singkat layanan..."
              {...register("deskripsi")}
            />
          </div>

          {/* Persyaratan */}
          <div className="sm:col-span-2">
            <Textarea
              label="Persyaratan"
              rows={4}
              error={errors.persyaratan?.message}
              placeholder="Daftar persyaratan yang dibutuhkan..."
              {...register("persyaratan")}
            />
          </div>

          {/* Prosedur */}
          <div className="sm:col-span-2">
            <Textarea
              label="Prosedur"
              rows={4}
              error={errors.prosedur?.message}
              placeholder="Langkah-langkah prosedur pengajuan..."
              {...register("prosedur")}
            />
          </div>
        </div>

        {/* Actions */}
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
            {isEdit ? "Simpan Perubahan" : "Tambah Layanan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
