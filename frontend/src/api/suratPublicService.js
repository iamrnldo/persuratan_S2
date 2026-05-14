// src/api/suratPublicService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.message || "Terjadi kesalahan",
      status: error.response?.status,
      data: error.response?.data,
    };
    return Promise.reject(customError);
  },
);

const suratPublicService = {
  /**
   * Get surat by nomor surat (public)
   */
  getSuratByNomor: async (nomorSurat) => {
    const response = await apiClient.get(
      `/surat/public/${encodeURIComponent(nomorSurat)}`,
    );
    return response.data.data || response.data;
  },

  /**
   * Download surat PDF
   */
  downloadSurat: async (suratId) => {
    const response = await apiClient.get(`/surat/${suratId}/download`, {
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Get file URL for preview
   */
  getFileUrl: (fileUrl) => {
    if (!fileUrl) return "";
    const baseUrl = API_URL.replace(/\/api\/v1$/, "");
    return `${baseUrl}${fileUrl}`;
  },
};

export default suratPublicService;
