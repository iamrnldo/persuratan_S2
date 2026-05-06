import axiosInstance from "./axiosInstance";
import { TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from "../utils/constants";

export const authService = {
  login: async (username, password) => {
    const response = await axiosInstance.post("/auth/login", {
      username,
      password,
    });

    const { admin, access_token, refresh_token } = response.data.data;

    localStorage.setItem(TOKEN_KEY, access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
    localStorage.setItem(USER_KEY, JSON.stringify(admin));

    return response.data;
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.clear();
    }
  },

  getMe: async () => {
    const response = await axiosInstance.get("/auth/me");
    const userData = response.data.data;
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    return response.data;
  },

  changePassword: async (data) => {
    const response = await axiosInstance.put("/auth/change-password", data);
    return response.data;
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
