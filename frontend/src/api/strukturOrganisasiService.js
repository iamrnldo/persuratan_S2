import axiosInstance from "./axiosInstance";

export const strukturOrganisasiService = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get("/struktur-organisasi", {
      params,
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/struktur-organisasi/${id}`);
    return response.data;
  },

  // FormData untuk create & update (file upload)
  create: async (formData) => {
    const response = await axiosInstance.post(
      "/struktur-organisasi",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },

  update: async (id, formData) => {
    const response = await axiosInstance.put(
      `/struktur-organisasi/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/struktur-organisasi/${id}`);
    return response.data;
  },

  toggleActive: async (id) => {
    const response = await axiosInstance.patch(
      `/struktur-organisasi/${id}/toggle-active`,
    );
    return response.data;
  },
};
