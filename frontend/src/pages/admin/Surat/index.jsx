/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/use-memo */
// frontend/src/pages/admin/Surat/index.jsx
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Mail,
  MailOpen,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";
import toast from "react-hot-toast";
import { suratService } from "../../../api/suratService";
import { PageHeader } from "../../../components/admin/PageHeader";
import { Button } from "../../../components/common/Button";
import { Table } from "../../../components/common/Table";
import { Badge } from "../../../components/common/Badge";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { SearchInput } from "../../../components/common/SearchInput";
import { Pagination } from "../../../components/common/Pagination";
import { SuratModal } from "./SuratModal";
import { formatDateTime, debounce } from "../../../utils/helpers";

const STATUS_VARIANT = {
  baru: "info",
  diproses: "warning",
  selesai: "success",
  diarsipkan: "danger",
};

const STATUS_LABEL = {
  baru: "Baru",
  diproses: "Diproses",
  selesai: "Selesai",
  diarsipkan: "Diarsipkan",
};

const SuratPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statistik, setStatistik] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [filterJenis, setFilterJenis] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchData = async (page = 1, searchQuery = search) => {
    try {
      setLoading(true);
      const params = { page, limit: pagination.limit };
      if (searchQuery) params.search = searchQuery;
      if (filterJenis) params.jenis = filterJenis;
      if (filterStatus) params.status = filterStatus;

      const response = await suratService.getAll(params);
      setData(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error("Gagal memuat data surat");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistik = async () => {
    try {
      const response = await suratService.getStatistik();
      setStatistik(response.data);
    } catch (error) {
      console.error("Failed to load statistik:", error);
    }
  };

  const debouncedSearch = useCallback(
    debounce((q) => fetchData(1, q), 400),
    [filterJenis, filterStatus],
  );

  useEffect(() => {
    fetchData(1);
    fetchStatistik();
  }, [filterJenis, filterStatus]);

  const handleSearchChange = (val) => {
    setSearch(val);
    debouncedSearch(val);
  };

  const handleCreate = () => {
    setSelectedSurat(null);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedSurat(item);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await suratService.delete(deleteDialog.id);
      toast.success("Surat berhasil dihapus");
      setDeleteDialog({ open: false, id: null });
      fetchData(pagination.page);
      fetchStatistik();
    } catch (error) {
      toast.error("Gagal menghapus surat");
    } finally {
      setDeleteLoading(false);
    }
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
      header: "Jenis",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          {row.jenis === "masuk" ? (
            <ArrowDownToLine className="w-4 h-4 text-blue-500" />
          ) : (
            <ArrowUpFromLine className="w-4 h-4 text-purple-500" />
          )}
          <span
            className={`text-xs font-semibold ${row.jenis === "masuk" ? "text-blue-600" : "text-purple-600"}`}
          >
            {row.jenis === "masuk" ? "Masuk" : "Keluar"}
          </span>
        </div>
      ),
      className: "w-24",
    },
    {
      header: "No. Agenda",
      cell: (row) => (
        <span className="font-mono text-sm text-gray-700">
          {row.nomor_agenda || <span className="text-gray-300">—</span>}
        </span>
      ),
      className: "w-32",
    },
    {
      header: "Perihal & Pengirim/Tujuan",
      cell: (row) => (
        <div>
          <p className="font-medium text-gray-900 line-clamp-1">
            {row.perihal}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {row.jenis === "masuk" ? "Dari: " : "Ke: "}
            {row.pengirim_tujuan || "—"}
          </p>
        </div>
      ),
    },
    {
      header: "Tanggal",
      cell: (row) => (
        <span className="text-xs text-gray-500">
          {row.tanggal_dokumen
            ? new Date(row.tanggal_dokumen).toLocaleDateString("id-ID", {
                dateStyle: "medium",
              })
            : "—"}
        </span>
      ),
      className: "w-28",
    },
    {
      header: "Klasifikasi",
      cell: (row) => (
        <span className="text-xs text-gray-600">
          {row.klasifikasi_kode ? (
            <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">
              {row.klasifikasi_kode}
            </span>
          ) : (
            <span className="text-gray-300">—</span>
          )}
        </span>
      ),
      className: "w-28",
    },
    {
      header: "Status",
      cell: (row) => (
        <Badge variant={STATUS_VARIANT[row.status] || "info"}>
          {STATUS_LABEL[row.status] || row.status}
        </Badge>
      ),
      className: "w-28",
    },
    {
      header: "Aksi",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/admin/surat/${row.id}`)}
            className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            title="Lihat Detail"
          >
            <Eye className="w-4 h-4" />
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
      className: "w-28",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Manajemen Surat"
        subtitle="Kelola surat masuk dan surat keluar desa"
        actions={
          <Button variant="primary" icon={Plus} onClick={handleCreate}>
            Tambah Surat
          </Button>
        }
      />

      {/* Statistik Cards */}
      {statistik && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            {
              label: "Surat Masuk",
              value: statistik.total_masuk,
              color: "blue",
            },
            {
              label: "Surat Keluar",
              value: statistik.total_keluar,
              color: "purple",
            },
            {
              label: "Belum Diproses",
              value: statistik.total_baru,
              color: "yellow",
            },
            {
              label: "Bulan Ini",
              value: statistik.total_bulan_ini,
              color: "green",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold text-${stat.color}-600`}>
                {stat.value || 0}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 max-w-xs">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            onClear={() => handleSearchChange("")}
            placeholder="Cari perihal, nomor, pengirim..."
          />
        </div>
        <select
          value={filterJenis}
          onChange={(e) => setFilterJenis(e.target.value)}
          className="input-field w-auto"
        >
          <option value="">Semua Jenis</option>
          <option value="masuk">Surat Masuk</option>
          <option value="keluar">Surat Keluar</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-field w-auto"
        >
          <option value="">Semua Status</option>
          <option value="baru">Baru</option>
          <option value="diproses">Diproses</option>
          <option value="selesai">Selesai</option>
          <option value="diarsipkan">Diarsipkan</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <Table
          columns={columns}
          data={data}
          loading={loading}
          emptyMessage="Belum ada surat. Tambahkan surat baru!"
        />
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={(page) => fetchData(page)}
        />
      </div>

      <SuratModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          fetchData(pagination.page);
          fetchStatistik();
        }}
        surat={selectedSurat}
      />

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        loading={deleteLoading}
        message="Apakah Anda yakin ingin menghapus surat ini? File terlampir juga akan dihapus."
      />
    </div>
  );
};

export default SuratPage;
