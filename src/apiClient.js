import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL_COMMON || "http://localhost:3001/api";

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default apiClient;

