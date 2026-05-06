/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { faqService } from "../../../api/faqService";
import { Modal } from "../../../components/common/Modal";
import { Input } from "../../../components/common/Input";
import { Textarea } from "../../../components/common/Textarea";
import { Button } from "../../../components/common/Button";
import { useState } from "react";

export const FAQModal = ({ isOpen, onClose, onSuccess, faq }) => {
  const isEdit = !!faq;
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isOpen) {
      if (faq) {
        reset({
          pertanyaan: faq.pertanyaan,
          jawaban: faq.jawaban,
          urutan: faq.urutan,
          is_active: faq.is_active,
        });
      } else {
        reset({
          pertanyaan: "",
          jawaban: "",
          urutan: 0,
          is_active: true,
        });
      }
    }
  }, [isOpen, faq]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        urutan: parseInt(data.urutan) || 0,
        is_active: data.is_active === true || data.is_active === "true",
      };

      if (isEdit) {
        await faqService.update(faq.id, payload);
        toast.success("FAQ berhasil diupdate");
      } else {
        await faqService.create(payload);
        toast.success("FAQ berhasil ditambahkan");
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
      title={isEdit ? "Edit FAQ" : "Tambah FAQ Baru"}
      size="md"
      closeOnBackdrop={!loading}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Pertanyaan"
          required
          placeholder="Masukkan pertanyaan..."
          error={errors.pertanyaan?.message}
          {...register("pertanyaan", {
            required: "Pertanyaan wajib diisi",
          })}
        />

        <Textarea
          label="Jawaban"
          required
          rows={5}
          placeholder="Masukkan jawaban..."
          error={errors.jawaban?.message}
          {...register("jawaban", {
            required: "Jawaban wajib diisi",
          })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Urutan"
            type="number"
            min="0"
            placeholder="0"
            error={errors.urutan?.message}
            {...register("urutan")}
          />

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
        </div>

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
            {isEdit ? "Simpan Perubahan" : "Tambah FAQ"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
