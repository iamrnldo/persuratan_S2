import axiosInstance from "./axiosInstance";

export const faqService = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get("/faq", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/faq/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post("/faq", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/faq/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/faq/${id}`);
    return response.data;
  },

  toggleActive: async (id) => {
    const response = await axiosInstance.patch(`/faq/${id}/toggle-active`);
    return response.data;
  },
};
