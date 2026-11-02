const DEFAULT_API_URL = "http://localhost:8080";

const API_CONFIG = {
  BASE_URL: (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/+$/, ""),
};

export default API_CONFIG;
