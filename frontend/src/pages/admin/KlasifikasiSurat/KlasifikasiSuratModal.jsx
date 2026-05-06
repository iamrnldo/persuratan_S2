import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Modal } from "../../../components/common/Modal";
import { Input } from "../../../components/common/Input";
import { Textarea } from "../../../components/common/Textarea";
import { Button } from "../../../components/common/Button";
import { klasifikasiSuratService } from "../../../api/klasifikasiSuratService";

export const KlasifikasiSuratModal = ({
  isOpen,
  onClose,
  onSuccess,
  klasifikasi,
}) => {
  const isEdit = !!klasifikasi;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { kode: "", nama: "", keterangan: "" },
  });

  useEffect(() => {
    if (isOpen) {
      reset(
        klasifikasi
          ? {
              kode: klasifikasi.kode || "",
              nama: klasifikasi.nama || "",
              keterangan: klasifikasi.keterangan || "",
            }
          : { kode: "", nama: "", keterangan: "" },
      );
    }
  }, [isOpen, klasifikasi, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        kode: data.kode,
        nama: data.nama,
        keterangan: data.keterangan || null,
      };

      if (isEdit) {
        await klasifikasiSuratService.update(klasifikasi.id, payload);
        toast.success("Klasifikasi surat berhasil diperbarui");
      } else {
        await klasifikasiSuratService.create(payload);
        toast.success("Klasifikasi surat berhasil ditambahkan");
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
      title={isEdit ? "Edit Klasifikasi Surat" : "Tambah Klasifikasi Surat"}
      size="sm"
      closeOnBackdrop={!isSubmitting}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Kode"
          required
          error={errors.kode?.message}
          placeholder="Contoh: 001"
          {...register("kode", {
            required: "Kode wajib diisi",
            maxLength: { value: 20, message: "Maksimal 20 karakter" },
          })}
        />

        <Input
          label="Nama Klasifikasi"
          required
          error={errors.nama?.message}
          placeholder="Contoh: Surat Keterangan"
          {...register("nama", {
            required: "Nama wajib diisi",
            maxLength: { value: 100, message: "Maksimal 100 karakter" },
          })}
        />

        <Textarea
          label="Keterangan"
          rows={3}
          error={errors.keterangan?.message}
          placeholder="Keterangan tambahan (opsional)..."
          {...register("keterangan")}
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
            {isEdit ? "Simpan Perubahan" : "Tambah Klasifikasi"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
