/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/immutability */
import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../api/authService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);

        try {
          await authService.getMe();
          const updatedUser = authService.getCurrentUser();
          setUser(updatedUser);
        } catch (error) {
          console.error("Failed to refresh user data:", error);
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      setUser(response.data.admin);
      toast.success("Login berhasil!");
      navigate("/admin/dashboard");
    } catch (error) {
      const message = error.response?.data?.message || "Login gagal";
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.success("Logout berhasil");
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null);
      navigate("/admin/login");
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user,
    isSuperadmin: user?.role === "superadmin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
