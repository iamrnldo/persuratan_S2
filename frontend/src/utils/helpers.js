/* eslint-disable no-unused-vars */
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Format tanggal Indonesia
 */
export const formatDate = (date, formatStr = "dd MMMM yyyy") => {
  if (!date) return "-";
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: id });
  } catch (error) {
    return "-";
  }
};

/**
 * Format tanggal dengan waktu
 */
export const formatDateTime = (date) => {
  return formatDate(date, "dd MMM yyyy, HH:mm");
};

/**
 * Truncate text
 */
export const truncate = (str, length = 50) => {
  if (!str) return "";
  return str.length > length ? str.substring(0, length) + "..." : str;
};

/**
 * Generate slug
 */
export const generateSlug = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Debounce
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Handle API Error
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "Terjadi kesalahan, silakan coba lagi";
};
