/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/use-memo */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
// frontend/src/pages/admin/KlasifikasiSurat/index.jsx
import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { klasifikasiSuratService } from "../../../api/klasifikasiSuratService";
import { PageHeader } from "../../../components/admin/PageHeader";
import { Button } from "../../../components/common/Button";
import { Table } from "../../../components/common/Table";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { SearchInput } from "../../../components/common/SearchInput";
import { Pagination } from "../../../components/common/Pagination";
import { KlasifikasiSuratModal } from "./KlasifikasiSuratModal";
import { formatDateTime, debounce } from "../../../utils/helpers";

const KlasifikasiSuratPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchData = async (page = 1, searchQuery = search) => {
    try {
      setLoading(true);
      const params = { page, limit: pagination.limit };
      if (searchQuery) params.search = searchQuery;

      const response = await klasifikasiSuratService.getAll(params);
      setData(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error("Gagal memuat data klasifikasi surat");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search — backend support server-side search
  const debouncedSearch = useCallback(
    debounce((q) => fetchData(1, q), 400),
    [],
  );

  useEffect(() => {
    fetchData(1);
  }, []);

  const handleSearchChange = (val) => {
    setSearch(val);
    debouncedSearch(val);
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await klasifikasiSuratService.delete(deleteDialog.id);
      toast.success("Klasifikasi surat berhasil dihapus");
      setDeleteDialog({ open: false, id: null });
      fetchData(pagination.page);
    } catch (error) {
      toast.error("Gagal menghapus klasifikasi surat");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    fetchData(pagination.page);
  };

  const columns = [
    {
      header: "No",
      cell: (row) => {
        const index = data.indexOf(row);
        return (pagination.page - 1) * pagination.limit + index + 1;
      },
      className: "w-12",
    },
    {
      header: "Kode",
      cell: (row) => (
        <span className="font-mono font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-sm">
          {row.kode}
        </span>
      ),
      className: "w-28",
    },
    {
      header: "Nama Klasifikasi",
      cell: (row) => <p className="font-medium text-gray-900">{row.nama}</p>,
    },
    {
      header: "Keterangan",
      cell: (row) => (
        <p className="text-gray-500 text-sm line-clamp-2 max-w-xs">
          {row.keterangan || <span className="italic text-gray-300">—</span>}
        </p>
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
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteDialog({ open: true, id: row.id })}
            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            title="Hapus"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      className: "w-24",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Klasifikasi Surat"
        subtitle="Manajemen kode dan kategori klasifikasi surat desa"
        actions={
          <Button variant="primary" icon={Plus} onClick={handleCreate}>
            Tambah Klasifikasi
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 max-w-xs">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            onClear={() => handleSearchChange("")}
            placeholder="Cari kode atau nama..."
          />
        </div>
      </div>

      <div className="table-container">
        <Table
          columns={columns}
          data={data}
          loading={loading}
          emptyMessage="Belum ada klasifikasi surat. Tambahkan klasifikasi baru!"
        />
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={(page) => fetchData(page)}
        />
      </div>

      <KlasifikasiSuratModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
        klasifikasi={selectedItem}
      />

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        loading={deleteLoading}
        message="Apakah Anda yakin ingin menghapus klasifikasi surat ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
};

export default KlasifikasiSuratPage;
