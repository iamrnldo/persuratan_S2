/* eslint-disable no-unused-vars */
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  HelpCircle,
  FileText,
  Building2,
  Users,
  Mail,
  Megaphone,
  Image,
  Shield,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ADMIN_MENU, ROLES } from "../../utils/constants";

const iconMap = {
  LayoutDashboard,
  HelpCircle,
  FileText,
  Building2,
  Users,
  Mail,
  Megaphone,
  Image,
  Shield,
};

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, isSuperadmin } = useAuth();

  const filteredMenu = ADMIN_MENU.filter((item) => {
    if (item.roleRequired && !isSuperadmin) return false;
    return true;
  });

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-30
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-sm">
              Admin Persuratan
            </span>
          </div>
          {/* Close button mobile */}
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {filteredMenu.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                      ${
                        isActive
                          ? "bg-primary-600 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`
                    }
                  >
                    {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
                    <span className="flex-1">{item.title}</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-700">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-white">
                {user?.nama?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">
                {user?.nama}
              </p>
              <p className="text-xs text-gray-400 truncate capitalize">
                {user?.role}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
};
