/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Network,
} from "lucide-react";
import toast from "react-hot-toast";
import { strukturOrganisasiService } from "../../../api/strukturOrganisasiService";
import { PageHeader } from "../../../components/admin/PageHeader";
import { Button } from "../../../components/common/Button";
import { Table } from "../../../components/common/Table";
import { Badge } from "../../../components/common/Badge";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { Pagination } from "../../../components/common/Pagination";
import { StrukturOrganisasiModal } from "./StrukturOrganisasiModal";
import StrukturOrganisasiPreview from "./StrukturOrganisasiPreview";
import { formatDateTime } from "../../../utils/helpers";
import { getImageUrl } from "../../../utils/imageUrl";

const StrukturOrganisasiPage = () => {
  const [strukturList, setStrukturList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStruktur, setSelectedStruktur] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Filter states
  const [filterActive, setFilterActive] = useState("");

  const fetchStruktur = async (page = 1, activeFilter = filterActive) => {
    try {
      setLoading(true);
      const params = { page, limit: pagination.limit };
      if (activeFilter !== "") params.is_active = activeFilter;

      const response = await strukturOrganisasiService.getAll(params);

      if (response.pagination) {
        setStrukturList(response.data);
        setPagination(response.pagination);
      } else {
        setStrukturList(response.data);
        setPagination((prev) => ({
          ...prev,
          page: 1,
          total: response.total ?? response.data?.length ?? 0,
          totalPages: 1,
        }));
      }
    } catch {
      toast.error("Gagal memuat data struktur organisasi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStruktur(1);
  }, [filterActive]);

  const handleCreate = () => {
    setSelectedStruktur(null);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedStruktur(item);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await strukturOrganisasiService.delete(deleteDialog.id);
      toast.success("Struktur organisasi berhasil dihapus");
      setDeleteDialog({ open: false, id: null });
      fetchStruktur(pagination.page);
    } catch (error) {
      const message =
        error.response?.data?.message || "Gagal menghapus struktur organisasi";
      toast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleActive = async (id) => {
    setToggleLoading(id);
    try {
      await strukturOrganisasiService.toggleActive(id);
      toast.success("Status berhasil diubah");
      fetchStruktur(pagination.page);
    } catch {
      toast.error("Gagal mengubah status");
    } finally {
      setToggleLoading(null);
    }
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    fetchStruktur(pagination.page);
  };

  const columns = [
    {
      header: "No",
      cell: (row) => {
        const index = strukturList.indexOf(row);
        return (pagination.page - 1) * pagination.limit + index + 1;
      },
      className: "w-12",
    },
    {
      header: "Nama",
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.foto ? (
            <img
              src={getImageUrl(row.foto)}
              alt={row.nama}
              className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-gray-200"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="w-9 h-9 rounded-full bg-primary-100 text-primary-600
              items-center justify-center flex-shrink-0 font-bold text-sm"
            style={{ display: row.foto ? "none" : "flex" }}
          >
            {row.nama?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.nama}</p>
            {row.parent_nama && (
              <p className="text-xs text-gray-400">
                di bawah: {row.parent_nama}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Jabatan",
      cell: (row) => <span className="text-gray-700">{row.jabatan}</span>,
    },
    {
      header: "Level",
      accessor: "level",
      className: "text-center w-16",
    },
    {
      header: "Urutan",
      accessor: "urutan",
      className: "text-center w-16",
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
      className: "w-32",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Kelola Struktur Organisasi"
        subtitle="Manajemen susunan pengurus dan jabatan desa"
        actions={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              icon={Network}
              onClick={() => setPreviewOpen(true)}
            >
              Lihat Diagram
            </Button>
            <Button variant="primary" icon={Plus} onClick={handleCreate}>
              Tambah Anggota
            </Button>
          </div>
        }
      />

      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
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
          data={strukturList}
          loading={loading}
          emptyMessage="Belum ada data struktur organisasi. Tambahkan anggota baru!"
        />
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={(page) => fetchStruktur(page)}
        />
      </div>

      {/* Modal Create / Edit */}
      <StrukturOrganisasiModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
        struktur={selectedStruktur}
      />

      {/* Preview Diagram */}
      <StrukturOrganisasiPreview
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        loading={deleteLoading}
        message="Apakah Anda yakin ingin menghapus anggota ini? Pastikan tidak ada data di bawahnya sebelum menghapus."
      />
    </div>
  );
};

export default StrukturOrganisasiPage;
