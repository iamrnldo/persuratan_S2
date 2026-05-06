import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Modal } from "../../../components/common/Modal";
import { Input } from "../../../components/common/Input";
import { Textarea } from "../../../components/common/Textarea";
import { Select } from "../../../components/common/Select";
import { Button } from "../../../components/common/Button";
import { suratService } from "../../../api/suratService";

const STATUS_OPTIONS = [
  { value: "belum_ditindaklanjuti", label: "Belum Ditindaklanjuti" },
  { value: "sedang_diproses", label: "Sedang Diproses" },
  { value: "selesai", label: "Selesai" },
];

export const DisposisiModal = ({
  isOpen,
  onClose,
  onSuccess,
  suratId,
  disposisi,
}) => {
  const isEdit = !!disposisi;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      dari: "",
      kepada: "",
      instruksi: "",
      catatan: "",
      tanggal_disposisi: new Date().toISOString().split("T")[0],
      status: "belum_ditindaklanjuti",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset(
        disposisi
          ? {
              dari: disposisi.dari || "",
              kepada: disposisi.kepada || "",
              instruksi: disposisi.instruksi || "",
              catatan: disposisi.catatan || "",
              tanggal_disposisi:
                disposisi.tanggal_disposisi?.split("T")[0] ||
                new Date().toISOString().split("T")[0],
              status: disposisi.status || "belum_ditindaklanjuti",
            }
          : {
              dari: "",
              kepada: "",
              instruksi: "",
              catatan: "",
              tanggal_disposisi: new Date().toISOString().split("T")[0],
              status: "belum_ditindaklanjuti",
            },
      );
    }
  }, [isOpen, disposisi, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        catatan: data.catatan || null,
      };

      if (isEdit) {
        await suratService.updateDisposisi(disposisi.id, payload);
        toast.success("Disposisi berhasil diperbarui");
      } else {
        await suratService.createDisposisi(suratId, payload);
        toast.success("Disposisi berhasil ditambahkan");
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
      title={isEdit ? "Edit Disposisi" : "Tambah Disposisi"}
      size="md"
      closeOnBackdrop={!isSubmitting}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Input
            label="Dari"
            required
            error={errors.dari?.message}
            placeholder="Jabatan/nama pemberi disposisi"
            {...register("dari", { required: "Dari wajib diisi" })}
          />
          <Input
            label="Kepada"
            required
            error={errors.kepada?.message}
            placeholder="Jabatan/nama penerima disposisi"
            {...register("kepada", { required: "Kepada wajib diisi" })}
          />

          <div className="sm:col-span-2">
            <Textarea
              label="Instruksi"
              required
              rows={3}
              error={errors.instruksi?.message}
              placeholder="Isi instruksi disposisi..."
              {...register("instruksi", { required: "Instruksi wajib diisi" })}
            />
          </div>

          <div className="sm:col-span-2">
            <Textarea
              label="Catatan"
              rows={2}
              error={errors.catatan?.message}
              placeholder="Catatan tambahan (opsional)..."
              {...register("catatan")}
            />
          </div>

          <Input
            label="Tanggal Disposisi"
            type="date"
            error={errors.tanggal_disposisi?.message}
            {...register("tanggal_disposisi")}
          />

          <Select
            label="Status"
            options={STATUS_OPTIONS}
            error={errors.status?.message}
            {...register("status")}
          />
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
            {isEdit ? "Simpan Perubahan" : "Tambah Disposisi"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
