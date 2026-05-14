// frontend/src/api/adminService.js
import axiosInstance from "./axiosInstance";

export const adminService = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get("/admin", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/admin/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post("/admin", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/admin/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/admin/${id}`);
    return response.data;
  },

  toggleActive: async (id) => {
    const response = await axiosInstance.patch(`/admin/${id}/toggle-active`);
    return response.data;
  },

  resetPassword: async (id, new_password) => {
    const response = await axiosInstance.patch(`/admin/${id}/reset-password`, {
      new_password,
    });
    return response.data;
  },
};
