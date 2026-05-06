import axiosInstance from "./axiosInstance";

export const suratService = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get("/surat", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/surat/${id}`);
    return response.data;
  },

  getStatistik: async () => {
    const response = await axiosInstance.get("/surat/statistik");
    return response.data;
  },

  create: async (formData) => {
    const response = await axiosInstance.post("/surat", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await axiosInstance.put(`/surat/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/surat/${id}/status`, {
      status,
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/surat/${id}`);
    return response.data;
  },

  // Disposisi
  createDisposisi: async (suratId, data) => {
    const response = await axiosInstance.post(
      `/surat/${suratId}/disposisi`,
      data,
    );
    return response.data;
  },

  updateDisposisi: async (id, data) => {
    const response = await axiosInstance.put(`/surat/disposisi/${id}`, data);
    return response.data;
  },

  deleteDisposisi: async (id) => {
    const response = await axiosInstance.delete(`/surat/disposisi/${id}`);
    return response.data;
  },
};
