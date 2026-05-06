/* eslint-disable no-unused-vars */
import { Menu, Bell, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Header = ({ onMenuClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Left: Hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Center: Welcome (mobile hidden) */}
      <div className="hidden lg:block">
        <p className="text-sm text-gray-600">
          Selamat datang,{" "}
          <span className="font-semibold text-gray-900">{user?.nama}</span>
        </p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Profile */}
        <button
          onClick={() => navigate("/admin/profile")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {user?.nama?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {user?.nama}
          </span>
        </button>
      </div>
    </header>
  );
};
