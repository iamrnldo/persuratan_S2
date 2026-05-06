import axiosInstance from "./axiosInstance";

export const klasifikasiSuratService = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get("/klasifikasi-surat", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/klasifikasi-surat/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post("/klasifikasi-surat", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/klasifikasi-surat/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/klasifikasi-surat/${id}`);
    return response.data;
  },
};
