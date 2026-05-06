import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { Button } from "../../../components/common/Button";

const LoginPage = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.username, data.password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <Mail className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Persuratan</h1>
          <p className="text-primary-200 mt-1">
            Sistem Manajemen Persuratan Desa
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Masuk ke Dashboard
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div>
              <label className="label">Username atau Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Masukkan username"
                  className={`input-field pl-10 ${errors.username ? "input-error" : ""}`}
                  {...register("username", {
                    required: "Username wajib diisi",
                    minLength: {
                      value: 3,
                      message: "Username minimal 3 karakter",
                    },
                  })}
                />
              </div>
              {errors.username && (
                <p className="error-message">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  className={`input-field pl-10 pr-10 ${errors.password ? "input-error" : ""}`}
                  {...register("password", {
                    required: "Password wajib diisi",
                    minLength: {
                      value: 6,
                      message: "Password minimal 6 karakter",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="error-message">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full mt-2"
            >
              Masuk
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-primary-200 text-sm mt-6">
          © {new Date().getFullYear()} Sistem Persuratan Desa
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
