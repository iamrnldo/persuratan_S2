// frontend/src/pages/admin/ManageAdmin/ResetPasswordModal.jsx
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Modal } from "../../../components/common/Modal";
import { Input } from "../../../components/common/Input";
import { Button } from "../../../components/common/Button";
import { adminService } from "../../../api/adminService";

export const ResetPasswordModal = ({ isOpen, onClose, adminId, adminNama }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { new_password: "", confirm_password: "" },
  });

  const newPassword = watch("new_password");

  const onSubmit = async (data) => {
    try {
      await adminService.resetPassword(adminId, data.new_password);
      toast.success(`Password ${adminNama} berhasil direset`);
      reset();
      onClose();
    } catch (error) {
      const message = error.response?.data?.message || "Terjadi kesalahan";
      toast.error(message);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Reset Password — ${adminNama}`}
      size="sm"
      closeOnBackdrop={!isSubmitting}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <Input
            label="Password Baru"
            type="password"
            required
            error={errors.new_password?.message}
            placeholder="Minimal 8 karakter"
            {...register("new_password", {
              required: "Password baru wajib diisi",
              minLength: { value: 8, message: "Minimal 8 karakter" },
            })}
          />
          <Input
            label="Konfirmasi Password"
            type="password"
            required
            error={errors.confirm_password?.message}
            placeholder="Ulangi password baru"
            {...register("confirm_password", {
              required: "Konfirmasi password wajib diisi",
              validate: (val) => val === newPassword || "Password tidak cocok",
            })}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
            type="button"
          >
            Batal
          </Button>
          <Button variant="primary" type="submit" loading={isSubmitting}>
            Reset Password
          </Button>
        </div>
      </form>
    </Modal>
  );
};
