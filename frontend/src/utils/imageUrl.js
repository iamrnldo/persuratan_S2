const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const getBaseUrl = () => {
  try {
    const url = new URL(API_URL);
    return url.origin;
  } catch {
    return "http://localhost:5000";
  }
};

const BASE_URL = getBaseUrl();

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BASE_URL}${path}`;
};
