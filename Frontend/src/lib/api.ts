// Base URL for the backend
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://nextgen-hr-backend.onrender.com";

// Helper function to build API URLs
export const getApiUrl = (path: string): string => {
  if (path.startsWith("/")) {
    return `${API_BASE_URL}${path}`;
  }

  return `${API_BASE_URL}/${path}`;
};