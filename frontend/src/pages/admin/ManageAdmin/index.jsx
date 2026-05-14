/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
// frontend/src/pages/admin/ManageAdmin/index.jsx
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  KeyRound,
} from "lucide-react";
import toast from "react-hot-toast";
import { adminService } from "../../../api/adminService";
import { useAuth } from "../../../context/AuthContext";
import { PageHeader } from "../../../components/admin/PageHeader";
import { Button } from "../../../components/common/Button";
import { Table } from "../../../components/common/Table";
import { Badge } from "../../../components/common/Badge";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { SearchInput } from "../../../components/common/SearchInput";
import { Pagination } from "../../../components/common/Pagination";
import { AdminModal } from "./AdminModal";
import { ResetPasswordModal } from "./ResetPasswordModal";
import { formatDateTime } from "../../../utils/helpers";

const ManageAdminPage = () => {
  const { user: currentUser } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(null);
  const [resetPasswordModal, setResetPasswordModal] = useState({
    open: false,
    id: null,
    nama: "",
  });

  // Filter states
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");

  const fetchAdmins = async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: pagination.limit };
      if (search) params.search = search;
      if (filterRole) params.role = filterRole;

      const response = await adminService.getAll(params);
      setAdmins(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error("Gagal memuat data admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins(1);
  }, [filterRole]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => fetchAdmins(1), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCreate = () => {
    setSelectedAdmin(null);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedAdmin(item);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await adminService.delete(deleteDialog.id);
      toast.success("Admin berhasil dihapus");
      setDeleteDialog({ open: false, id: null });
      fetchAdmins(pagination.page);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus admin");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleActive = async (id) => {
    setToggleLoading(id);
    try {
      await adminService.toggleActive(id);
      toast.success("Status admin berhasil diubah");
      fetchAdmins(pagination.page);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Gagal mengubah status admin",
      );
    } finally {
      setToggleLoading(null);
    }
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    fetchAdmins(pagination.page);
  };

  const columns = [
    {
      header: "No",
      cell: (row) => {
        const index = admins.indexOf(row);
        return (pagination.page - 1) * pagination.limit + index + 1;
      },
      className: "w-12",
    },
    {
      header: "Nama",
      cell: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.nama}</p>
          <p className="text-xs text-gray-400 mt-0.5">@{row.username}</p>
        </div>
      ),
    },
    {
      header: "Email",
      cell: (row) => <span className="text-gray-600 text-sm">{row.email}</span>,
    },
    {
      header: "Role",
      cell: (row) => (
        <Badge variant={row.role === "superadmin" ? "warning" : "info"}>
          {row.role === "superadmin" ? "Superadmin" : "Admin"}
        </Badge>
      ),
      className: "w-28",
    },
    {
      header: "Status",
      cell: (row) => (
        <Badge variant={row.is_active ? "success" : "danger"}>
          {row.is_active ? "Aktif" : "Nonaktif"}
        </Badge>
      ),
      className: "w-24",
    },
    {
      header: "Login Terakhir",
      cell: (row) => (
        <span className="text-gray-500 text-xs">
          {row.last_login ? (
            formatDateTime(row.last_login)
          ) : (
            <span className="italic text-gray-300">Belum pernah</span>
          )}
        </span>
      ),
    },
    {
      header: "Dibuat",
      cell: (row) => (
        <span className="text-gray-500 text-xs">
          {formatDateTime(row.created_at)}
        </span>
      ),
    },
    {
      header: "Aksi",
      cell: (row) => {
        const isSelf = currentUser?.id === row.id;
        return (
          <div className="flex items-center gap-2">
            {/* Toggle Active */}
            <button
              onClick={() => handleToggleActive(row.id)}
              disabled={toggleLoading === row.id || isSelf}
              className={`p-1.5 rounded-lg transition-colors ${
                isSelf
                  ? "text-gray-300 cursor-not-allowed"
                  : row.is_active
                    ? "text-green-600 hover:bg-green-50"
                    : "text-gray-400 hover:bg-gray-50"
              }`}
              title={
                isSelf
                  ? "Tidak dapat mengubah status akun sendiri"
                  : row.is_active
                    ? "Nonaktifkan"
                    : "Aktifkan"
              }
            >
              {row.is_active ? (
                <ToggleRight className="w-5 h-5" />
              ) : (
                <ToggleLeft className="w-5 h-5" />
              )}
            </button>

            {/* Reset Password */}
            <button
              onClick={() =>
                setResetPasswordModal({
                  open: true,
                  id: row.id,
                  nama: row.nama,
                })
              }
              className="p-1.5 rounded-lg text-yellow-600 hover:bg-yellow-50 transition-colors"
              title="Reset Password"
            >
              <KeyRound className="w-4 h-4" />
            </button>

            {/* Edit */}
            <button
              onClick={() => handleEdit(row)}
              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
              title="Edit"
            >
              <Pencil className="w-4 h-4" />
            </button>

            {/* Delete */}
            <button
              onClick={() => setDeleteDialog({ open: true, id: row.id })}
              disabled={isSelf}
              className={`p-1.5 rounded-lg transition-colors ${
                isSelf
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-red-600 hover:bg-red-50"
              }`}
              title={isSelf ? "Tidak dapat menghapus akun sendiri" : "Hapus"}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
      className: "w-40",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Kelola Admin"
        subtitle="Manajemen akun admin sistem"
        actions={
          <Button variant="primary" icon={Plus} onClick={handleCreate}>
            Tambah Admin
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 max-w-xs">
          <SearchInput
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
            placeholder="Cari nama, username, email..."
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="input-field w-auto"
        >
          <option value="">Semua Role</option>
          <option value="superadmin">Superadmin</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <Table
          columns={columns}
          data={admins}
          loading={loading}
          emptyMessage="Belum ada admin. Tambahkan admin baru!"
        />
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={(page) => fetchAdmins(page)}
        />
      </div>

      {/* Modal Create/Edit */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
        admin={selectedAdmin}
      />

      {/* Modal Reset Password */}
      <ResetPasswordModal
        isOpen={resetPasswordModal.open}
        onClose={() =>
          setResetPasswordModal({ open: false, id: null, nama: "" })
        }
        adminId={resetPasswordModal.id}
        adminNama={resetPasswordModal.nama}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        loading={deleteLoading}
        message="Apakah Anda yakin ingin menghapus admin ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
};

export default ManageAdminPage;
