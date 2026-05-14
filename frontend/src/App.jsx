/* eslint-disable no-unused-vars */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import { ROLES } from "./utils/constants";

// Admin Pages
import LoginPage from "./pages/admin/Login";
import DashboardPage from "./pages/admin/Dashboard";
import FAQPage from "./pages/admin/FAQ";
import LayananPage from "./pages/admin/Layanan";
import GaleriKategoriPage from "./pages/admin/GaleriKategori";
import ProfilDesaPage from "./pages/admin/ProfilDesa";
import KlasifikasiSuratPage from "./pages/admin/KlasifikasiSurat";
import SuratPage from "./pages/admin/Surat";
import SuratDetail from "./pages/admin/Surat/SuratDetail";
import StrukturOrganisasiPage from "./pages/admin/StrukturOrganisasi"; // ← NEW
// Tambah import ini
import ManageAdminPage from "./pages/admin/ManageAdmin";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1f2937",
              color: "#f9fafb",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#f9fafb",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#f9fafb",
              },
            },
          }}
        />

        <Routes>
          {/* Redirect root ke admin login */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />

          {/* Admin Login - Public */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Admin Routes - Protected */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Redirect /admin ke dashboard */}
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            {/* Dashboard */}
            <Route path="dashboard" element={<DashboardPage />} />
            {/* FAQ */}
            <Route path="faq" element={<FAQPage />} />
            <Route path="layanan" element={<LayananPage />} />
            <Route path="galeri-kategori" element={<GaleriKategoriPage />} />
            <Route path="profil-desa" element={<ProfilDesaPage />} />
            <Route
              path="klasifikasi-surat"
              element={<KlasifikasiSuratPage />}
            />
            <Route path="surat" element={<SuratPage />} />
            <Route path="surat/:id" element={<SuratDetail />} />
            {/* Struktur Organisasi */} {/* ← NEW */}
            <Route
              path="struktur-organisasi"
              element={<StrukturOrganisasiPage />}
            />
            {/* Superadmin only */}
            <Route
              path="manage-admin"
              element={
                <ProtectedRoute requiredRole={ROLES.SUPERADMIN}>
                  <ManageAdminPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
