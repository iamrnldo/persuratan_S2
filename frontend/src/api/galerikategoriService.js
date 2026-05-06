import axiosInstance from "./axiosInstance";

export const galeriKategoriService = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get("/galeri-kategori", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/galeri-kategori/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post("/galeri-kategori", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/galeri-kategori/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/galeri-kategori/${id}`);
    return response.data;
  },
};
