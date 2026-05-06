/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
// Frontend/src/pages/admin/FAQ/index.jsx
import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";
import { faqService } from "../../../api/faqService";
import { PageHeader } from "../../../components/admin/PageHeader";
import { Button } from "../../../components/common/Button";
import { Table } from "../../../components/common/Table";
import { Badge } from "../../../components/common/Badge";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { SearchInput } from "../../../components/common/SearchInput";
import { Pagination } from "../../../components/common/Pagination";
import { FAQModal } from "./FAQModal";
import { formatDateTime, debounce } from "../../../utils/helpers";

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(null);

  // Filter states
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState("");

  const fetchFAQs = async (
    page = 1,
    searchQuery = search,
    activeFilter = filterActive,
  ) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.limit,
      };
      if (activeFilter !== "") params.is_active = activeFilter;

      const response = await faqService.getAll(params);
      setFaqs(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error("Gagal memuat data FAQ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs(1);
  }, [filterActive]);

  // Handle create
  const handleCreate = () => {
    setSelectedFaq(null);
    setModalOpen(true);
  };

  // Handle edit
  const handleEdit = (faq) => {
    setSelectedFaq(faq);
    setModalOpen(true);
  };

  // Handle delete
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await faqService.delete(deleteDialog.id);
      toast.success("FAQ berhasil dihapus");
      setDeleteDialog({ open: false, id: null });
      fetchFAQs(pagination.page);
    } catch (error) {
      toast.error("Gagal menghapus FAQ");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle toggle active
  const handleToggleActive = async (id) => {
    setToggleLoading(id);
    try {
      await faqService.toggleActive(id);
      toast.success("Status FAQ berhasil diubah");
      fetchFAQs(pagination.page);
    } catch (error) {
      toast.error("Gagal mengubah status FAQ");
    } finally {
      setToggleLoading(null);
    }
  };

  // Handle modal success
  const handleModalSuccess = () => {
    setModalOpen(false);
    fetchFAQs(pagination.page);
  };

  const columns = [
    {
      header: "No",
      cell: (row) => {
        const index = faqs.indexOf(row);
        return (pagination.page - 1) * pagination.limit + index + 1;
      },
      className: "w-12",
    },
    {
      header: "Pertanyaan",
      cell: (row) => (
        <div>
          <p className="font-medium text-gray-900 line-clamp-2 max-w-xs">
            {row.pertanyaan}
          </p>
        </div>
      ),
    },
    {
      header: "Jawaban",
      cell: (row) => (
        <p className="text-gray-500 line-clamp-2 max-w-xs">{row.jawaban}</p>
      ),
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
        title="Kelola FAQ"
        subtitle="Manajemen pertanyaan yang sering diajukan"
        actions={
          <Button variant="primary" icon={Plus} onClick={handleCreate}>
            Tambah FAQ
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 max-w-xs">
          <SearchInput
            value={search}
            onChange={setSearch}
            onClear={() => {
              setSearch("");
              fetchFAQs(1, "");
            }}
            placeholder="Cari pertanyaan..."
          />
        </div>
        <select
          value={filterActive}
          onChange={(e) => {
            setFilterActive(e.target.value);
          }}
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
          data={faqs}
          loading={loading}
          emptyMessage="Belum ada FAQ. Tambahkan FAQ baru!"
        />
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={(page) => fetchFAQs(page)}
        />
      </div>

      {/* Modal Create/Edit */}
      <FAQModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
        faq={selectedFaq}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        loading={deleteLoading}
        message="Apakah Anda yakin ingin menghapus FAQ ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
};

export default FAQPage;
