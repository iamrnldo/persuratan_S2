import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Modal } from "../../../components/common/Modal";
import { Input } from "../../../components/common/Input";
import { Button } from "../../../components/common/Button";
import { galeriKategoriService } from "../../../api/galerikategoriService";

export const GaleriKategoriModal = ({
  isOpen,
  onClose,
  onSuccess,
  kategori,
}) => {
  const isEdit = !!kategori;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      nama: "",
      slug: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (kategori) {
        reset({
          nama: kategori.nama || "",
          slug: kategori.slug || "",
        });
      } else {
        reset({ nama: "", slug: "" });
      }
    }
  }, [isOpen, kategori, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        nama: data.nama,
        ...(data.slug ? { slug: data.slug } : {}),
      };

      if (isEdit) {
        await galeriKategoriService.update(kategori.id, payload);
        toast.success("Kategori galeri berhasil diperbarui");
      } else {
        await galeriKategoriService.create(payload);
        toast.success("Kategori galeri berhasil ditambahkan");
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
      title={isEdit ? "Edit Kategori Galeri" : "Tambah Kategori Galeri"}
      size="sm"
      closeOnBackdrop={!isSubmitting}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Nama Kategori"
          required
          error={errors.nama?.message}
          placeholder="Contoh: Kegiatan Desa"
          {...register("nama", {
            required: "Nama kategori wajib diisi",
            maxLength: { value: 100, message: "Maksimal 100 karakter" },
          })}
        />

        <Input
          label="Slug"
          error={errors.slug?.message}
          placeholder="Otomatis dari nama jika dikosongkan"
          {...register("slug", {
            maxLength: { value: 100, message: "Maksimal 100 karakter" },
            pattern: {
              value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
              message: "Slug tidak valid (gunakan huruf kecil dan tanda -)",
            },
          })}
        />

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
            {isEdit ? "Simpan Perubahan" : "Tambah Kategori"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
