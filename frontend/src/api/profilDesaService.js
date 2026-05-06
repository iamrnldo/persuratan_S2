import axiosInstance from "./axiosInstance";

export const profilDesaService = {
  get: async () => {
    const response = await axiosInstance.get("/profil-desa");
    return response.data;
  },

  upsert: async (data) => {
    const response = await axiosInstance.post("/profil-desa", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/profil-desa/${id}`, data);
    return response.data;
  },
};
