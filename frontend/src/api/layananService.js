import axiosInstance from "./axiosInstance";

export const layananService = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get("/layanan", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/layanan/${id}`);
    return response.data;
  },

  getBySlug: async (slug) => {
    const response = await axiosInstance.get(`/layanan/slug/${slug}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post("/layanan", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/layanan/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/layanan/${id}`);
    return response.data;
  },

  toggleActive: async (id) => {
    const response = await axiosInstance.patch(`/layanan/${id}/toggle-active`);
    return response.data;
  },
};
