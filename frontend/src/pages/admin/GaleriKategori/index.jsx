/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
// frontend/src/pages/admin/GaleriKategori/index.jsx
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { galeriKategoriService } from "../../../api/galerikategoriService.js";
import { PageHeader } from "../../../components/admin/PageHeader";
import { Button } from "../../../components/common/Button";
import { Table } from "../../../components/common/Table";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { SearchInput } from "../../../components/common/SearchInput";
import { GaleriKategoriModal } from "./GaleriKategoriModal.jsx";
import { formatDateTime } from "../../../utils/helpers";

const GaleriKategoriPage = () => {
  const [kategoriList, setKategoriList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchKategori = async () => {
    try {
      setLoading(true);
      const response = await galeriKategoriService.getAll();
      setKategoriList(response.data);
      setFiltered(response.data);
    } catch (error) {
      toast.error("Gagal memuat data kategori galeri");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  // Client-side search (backend tidak support search/pagination untuk endpoint ini)
  useEffect(() => {
    if (!search) {
      setFiltered(kategoriList);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        kategoriList.filter(
          (k) =>
            k.nama.toLowerCase().includes(q) ||
            k.slug.toLowerCase().includes(q),
        ),
      );
    }
  }, [search, kategoriList]);

  const handleCreate = () => {
    setSelectedKategori(null);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedKategori(item);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await galeriKategoriService.delete(deleteDialog.id);
      toast.success("Kategori galeri berhasil dihapus");
      setDeleteDialog({ open: false, id: null });
      fetchKategori();
    } catch (error) {
      toast.error("Gagal menghapus kategori galeri");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    fetchKategori();
  };

  const columns = [
    {
      header: "No",
      cell: (row) => filtered.indexOf(row) + 1,
      className: "w-12",
    },
    {
      header: "Nama Kategori",
      cell: (row) => <p className="font-medium text-gray-900">{row.nama}</p>,
    },
    {
      header: "Slug",
      cell: (row) => (
        <span className="text-sm text-gray-500 font-mono">{row.slug}</span>
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
        title="Kelola Kategori Galeri"
        subtitle="Manajemen kategori untuk galeri foto desa"
        actions={
          <Button variant="primary" icon={Plus} onClick={handleCreate}>
            Tambah Kategori
          </Button>
        }
      />

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 max-w-xs">
          <SearchInput
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
            placeholder="Cari kategori..."
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <Table
          columns={columns}
          data={filtered}
          loading={loading}
          emptyMessage="Belum ada kategori galeri. Tambahkan kategori baru!"
        />
      </div>

      {/* Modal Create/Edit */}
      <GaleriKategoriModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
        kategori={selectedKategori}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        loading={deleteLoading}
        message="Apakah Anda yakin ingin menghapus kategori galeri ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
};

export default GaleriKategoriPage;
