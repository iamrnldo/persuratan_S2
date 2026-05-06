/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// frontend/src/pages/admin/Layanan/index.jsx
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";
import { layananService } from "../../../api/layananService";
import { PageHeader } from "../../../components/admin/PageHeader";
import { Button } from "../../../components/common/Button";
import { Table } from "../../../components/common/Table";
import { Badge } from "../../../components/common/Badge";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { SearchInput } from "../../../components/common/SearchInput";
import { Pagination } from "../../../components/common/Pagination";
import { LayananModal } from "./LayananModal";
import { formatDateTime } from "../../../utils/helpers";

const LayananPage = () => {
  const [layanan, setLayanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLayanan, setSelectedLayanan] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(null);

  // Filter states
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState("");

  const fetchLayanan = async (page = 1, activeFilter = filterActive) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.limit,
      };
      if (activeFilter !== "") params.is_active = activeFilter;

      const response = await layananService.getAll(params);
      setLayanan(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error("Gagal memuat data layanan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLayanan(1);
  }, [filterActive]);

  // Handle create
  const handleCreate = () => {
    setSelectedLayanan(null);
    setModalOpen(true);
  };

  // Handle edit
  const handleEdit = (item) => {
    setSelectedLayanan(item);
    setModalOpen(true);
  };

  // Handle delete
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await layananService.delete(deleteDialog.id);
      toast.success("Layanan berhasil dihapus");
      setDeleteDialog({ open: false, id: null });
      fetchLayanan(pagination.page);
    } catch (error) {
      toast.error("Gagal menghapus layanan");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle toggle active
  const handleToggleActive = async (id) => {
    setToggleLoading(id);
    try {
      await layananService.toggleActive(id);
      toast.success("Status layanan berhasil diubah");
      fetchLayanan(pagination.page);
    } catch (error) {
      toast.error("Gagal mengubah status layanan");
    } finally {
      setToggleLoading(null);
    }
  };

  // Handle modal success
  const handleModalSuccess = () => {
    setModalOpen(false);
    fetchLayanan(pagination.page);
  };

  const columns = [
    {
      header: "No",
      cell: (row) => {
        const index = layanan.indexOf(row);
        return (pagination.page - 1) * pagination.limit + index + 1;
      },
      className: "w-12",
    },
    {
      header: "Nama Layanan",
      cell: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.nama}</p>
          <p className="text-xs text-gray-400 mt-0.5">{row.slug}</p>
        </div>
      ),
    },
    {
      header: "Deskripsi",
      cell: (row) => (
        <p className="text-gray-500 line-clamp-2 max-w-xs text-sm">
          {row.deskripsi || <span className="italic text-gray-300">—</span>}
        </p>
      ),
    },
    {
      header: "Icon",
      cell: (row) => (
        <span className="text-gray-600 text-sm font-mono">
          {row.icon || <span className="italic text-gray-300">—</span>}
        </span>
      ),
      className: "w-28",
    },
    {
      header: "Urutan",
      accessor: "urutan",
      className: "text-center w-20",
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
      header: "Dibuat",
      cell: (row) => (
        <span className="text-gray-500 text-xs">
          {formatDateTime(row.created_at)}
        </span>
      ),
    },
    {
      header: "Aksi",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {/* Toggle Active */}
          <button
            onClick={() => handleToggleActive(row.id)}
            disabled={toggleLoading === row.id}
            className={`p-1.5 rounded-lg transition-colors ${
              row.is_active
                ? "text-green-600 hover:bg-green-50"
                : "text-gray-400 hover:bg-gray-50"
            }`}
            title={row.is_active ? "Nonaktifkan" : "Aktifkan"}
          >
            {row.is_active ? (
              <ToggleRight className="w-5 h-5" />
            ) : (
              <ToggleLeft className="w-5 h-5" />
            )}
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
            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            title="Hapus"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      className: "w-32",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Kelola Layanan"
        subtitle="Manajemen layanan yang tersedia di desa"
        actions={
          <Button variant="primary" icon={Plus} onClick={handleCreate}>
            Tambah Layanan
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
            placeholder="Cari layanan..."
          />
        </div>
        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
          className="input-field w-auto"
        >
          <option value="">Semua Status</option>
          <option value="true">Aktif</option>
          <option value="false">Nonaktif</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <Table
          columns={columns}
          data={layanan}
          loading={loading}
          emptyMessage="Belum ada layanan. Tambahkan layanan baru!"
        />
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={(page) => fetchLayanan(page)}
        />
      </div>

      {/* Modal Create/Edit */}
      <LayananModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
        layanan={selectedLayanan}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        loading={deleteLoading}
        message="Apakah Anda yakin ingin menghapus layanan ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
};

export default LayananPage;
