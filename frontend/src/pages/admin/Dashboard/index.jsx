/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from "react";
import {
  HelpCircle,
  FileText,
  Mail,
  Megaphone,
  Users,
  Image,
} from "lucide-react";
import { PageHeader } from "../../../components/admin/PageHeader";
import { StatsCard } from "../../../components/admin/StatsCard";
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../../api/axiosInstance";

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    faq: 0,
    layanan: 0,
    klasifikasiSurat: 0,
    kategoriPengumuman: 0,
    struktur: 0,
    galeriKategori: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        faqRes,
        layananRes,
        klasifikasiRes,
        kategoriRes,
        strukturRes,
        galeriRes,
      ] = await Promise.allSettled([
        axiosInstance.get("/faq"),
        axiosInstance.get("/layanan"),
        axiosInstance.get("/klasifikasi-surat"),
        axiosInstance.get("/kategori-pengumuman"),
        axiosInstance.get("/struktur-organisasi"),
        axiosInstance.get("/galeri-kategori"),
      ]);

      setStats({
        faq: faqRes.value?.data?.pagination?.total || 0,
        layanan: layananRes.value?.data?.pagination?.total || 0,
        klasifikasiSurat: klasifikasiRes.value?.data?.pagination?.total || 0,
        kategoriPengumuman: kategoriRes.value?.data?.total || 0,
        struktur: strukturRes.value?.data?.total || 0,
        galeriKategori: galeriRes.value?.data?.total || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: "Total FAQ",
      value: loading ? "..." : stats.faq,
      icon: HelpCircle,
      color: "primary",
    },
    {
      title: "Total Layanan",
      value: loading ? "..." : stats.layanan,
      icon: FileText,
      color: "green",
    },
    {
      title: "Klasifikasi Surat",
      value: loading ? "..." : stats.klasifikasiSurat,
      icon: Mail,
      color: "yellow",
    },
    {
      title: "Kategori Pengumuman",
      value: loading ? "..." : stats.kategoriPengumuman,
      icon: Megaphone,
      color: "purple",
    },
    {
      title: "Struktur Organisasi",
      value: loading ? "..." : stats.struktur,
      icon: Users,
      color: "red",
    },
    {
      title: "Kategori Galeri",
      value: loading ? "..." : stats.galeriKategori,
      icon: Image,
      color: "primary",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Selamat datang kembali, ${user?.nama}! 👋`}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Info Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-base font-semibold text-gray-900">
              Informasi Akun
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Nama</span>
              <span className="text-sm font-medium text-gray-900">
                {user?.nama}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Username</span>
              <span className="text-sm font-medium text-gray-900">
                {user?.username}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-sm font-medium text-gray-900">
                {user?.email}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-500">Role</span>
              <span className="badge badge-info capitalize">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-base font-semibold text-gray-900">
              Akses Cepat
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Kelola FAQ",
                path: "/admin/faq",
                icon: HelpCircle,
                color: "text-primary-600 bg-primary-50",
              },
              {
                label: "Kelola Layanan",
                path: "/admin/layanan",
                icon: FileText,
                color: "text-green-600 bg-green-50",
              },
              {
                label: "Profil Desa",
                path: "/admin/profil-desa",
                icon: Users,
                color: "text-yellow-600 bg-yellow-50",
              },
              {
                label: "Klasifikasi Surat",
                path: "/admin/klasifikasi-surat",
                icon: Mail,
                color: "text-purple-600 bg-purple-50",
              },
            ].map((item) => (
              <a
                key={item.path}
                href={item.path}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group"
              >
                <div className={`p-2 rounded-lg ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">
                  {item.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
