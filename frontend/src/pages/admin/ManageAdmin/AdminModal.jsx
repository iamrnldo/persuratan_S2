// frontend/src/pages/admin/ManageAdmin/AdminModal.jsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Modal } from "../../../components/common/Modal";
import { Input } from "../../../components/common/Input";
import { Select } from "../../../components/common/Select";
import { Button } from "../../../components/common/Button";
import { adminService } from "../../../api/adminService";

export const AdminModal = ({ isOpen, onClose, onSuccess, admin }) => {
  const isEdit = !!admin;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      nama: "",
      username: "",
      email: "",
      password: "",
      role: "admin",
      is_active: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (admin) {
        reset({
          nama: admin.nama || "",
          username: admin.username || "",
          email: admin.email || "",
          password: "", // password tidak diisi saat edit
          role: admin.role || "admin",
          is_active: admin.is_active ?? true,
        });
      } else {
        reset({
          nama: "",
          username: "",
          email: "",
          password: "",
          role: "admin",
          is_active: true,
        });
      }
    }
  }, [isOpen, admin, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        nama: data.nama,
        username: data.username,
        email: data.email,
        role: data.role,
        is_active: data.is_active === true || data.is_active === "true",
      };

      // Hanya kirim password saat create, atau saat edit jika diisi
      if (!isEdit || data.password) {
        payload.password = data.password;
      }

      if (isEdit) {
        await adminService.update(admin.id, payload);
        toast.success("Admin berhasil diperbarui");
      } else {
        await adminService.create(payload);
        toast.success("Admin berhasil ditambahkan");
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
      title={isEdit ? "Edit Admin" : "Tambah Admin"}
      size="lg"
      closeOnBackdrop={!isSubmitting}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          {/* Nama */}
          <div className="sm:col-span-2">
            <Input
              label="Nama Lengkap"
              required
              error={errors.nama?.message}
              placeholder="Contoh: Budi Santoso"
              {...register("nama", {
                required: "Nama wajib diisi",
                maxLength: { value: 100, message: "Maksimal 100 karakter" },
              })}
            />
          </div>

          {/* Username */}
          <Input
            label="Username"
            required
            error={errors.username?.message}
            placeholder="Contoh: budi_santoso"
            {...register("username", {
              required: "Username wajib diisi",
              minLength: { value: 3, message: "Minimal 3 karakter" },
              maxLength: { value: 50, message: "Maksimal 50 karakter" },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: "Hanya huruf, angka, dan underscore",
              },
            })}
          />

          {/* Email */}
          <Input
            label="Email"
            type="email"
            required
            error={errors.email?.message}
            placeholder="Contoh: budi@desa.id"
            {...register("email", {
              required: "Email wajib diisi",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Format email tidak valid",
              },
            })}
          />

          {/* Password */}
          <div className="sm:col-span-2">
            <Input
              label={
                isEdit
                  ? "Password Baru (kosongkan jika tidak diubah)"
                  : "Password"
              }
              type="password"
              required={!isEdit}
              error={errors.password?.message}
              placeholder={
                isEdit ? "Kosongkan jika tidak diubah" : "Minimal 8 karakter"
              }
              {...register("password", {
                required: isEdit ? false : "Password wajib diisi",
                minLength: {
                  value: 8,
                  message: "Password minimal 8 karakter",
                },
              })}
            />
          </div>

          {/* Role */}
          <Select
            label="Role"
            options={[
              { value: "admin", label: "Admin" },
              { value: "superadmin", label: "Superadmin" },
            ]}
            {...register("role")}
          />

          {/* Status */}
          <Select
            label="Status"
            options={[
              { value: "true", label: "Aktif" },
              { value: "false", label: "Nonaktif" },
            ]}
            {...register("is_active")}
          />
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
            {isEdit ? "Simpan Perubahan" : "Tambah Admin"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
