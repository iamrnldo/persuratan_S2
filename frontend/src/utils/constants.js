export const API_URL = import.meta.env.VITE_API_URL;
export const APP_NAME = import.meta.env.VITE_APP_NAME;

// Local Storage Keys
export const TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const USER_KEY = "user_data";

// Roles
export const ROLES = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
};

// Admin Menu
export const ADMIN_MENU = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "FAQ",
    path: "/admin/faq",
    icon: "HelpCircle",
  },
  {
    title: "Layanan",
    path: "/admin/layanan",
    icon: "FileText",
  },
  {
    title: "Profil Desa",
    path: "/admin/profil-desa",
    icon: "Building2",
  },
  {
    title: "Struktur Organisasi",
    path: "/admin/struktur-organisasi",
    icon: "Users",
  },
  {
    title: "Klasifikasi Surat",
    path: "/admin/klasifikasi-surat",
    icon: "Mail",
  },
  {
    title: "Kategori Pengumuman",
    path: "/admin/kategori-pengumuman",
    icon: "Megaphone",
  },
  {
    title: "Galeri Kategori",
    path: "/admin/galeri-kategori",
    icon: "Image",
  },
  {
    title: "Kelola Admin",
    path: "/admin/manage-admin",
    icon: "Shield",
    roleRequired: ROLES.SUPERADMIN,
  },
];
