// src/api/suratPublicService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5174/api/v1";
const SERVER_URL = API_URL.replace(/\/api\/v1\/?$/, "");

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject({
      message: error.response?.data?.message || "Terjadi kesalahan",
      status: error.response?.status,
      data: error.response?.data,
    }),
);

const suratPublicService = {
  /** Semua surat dengan pagination + optional search */
  getAllSurat: async ({
    page = 1,
    limit = 10,
    search = "",
    jenis = "",
    klasifikasi_id = "",
  } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (search) params.append("search", search);
    if (jenis) params.append("jenis", jenis);
    if (klasifikasi_id) params.append("klasifikasi_id", klasifikasi_id);
    const response = await apiClient.get(`/surat?${params.toString()}`);
    return {
      data: response.data.data || [],
      pagination: response.data.pagination || {},
    };
  },

  /** Download blob dari static file */
  downloadSurat: async (surat) => {
    if (!surat?.file_path) throw { message: "File surat tidak tersedia" };
    const fileUrl = `${SERVER_URL}${surat.file_path}`;
    const res = await axios.get(fileUrl, { responseType: "blob" });
    return res.data;
  },

  /** URL lengkap untuk preview/download */
  getFileUrl: (filePath) => {
    if (!filePath) return "";
    if (filePath.startsWith("http")) return filePath;
    // Relative URL → lewat Vite proxy, same-origin, tidak diblokir browser
    return filePath.startsWith("/") ? filePath : `/${filePath}`;
  },

  // Tambah untuk fetch klasifikasi list
  getKlasifikasi: async () => {
    const response = await apiClient.get("/klasifikasi-surat");
    return response.data.data || [];
  },
};

export default suratPublicService;
