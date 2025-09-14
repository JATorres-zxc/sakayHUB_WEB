import axios from "axios";

// Base URL: use Vite env in prod. Falls back to "/api" which is proxied in dev.
const rawBase = import.meta.env.VITE_API_BASE_URL || "/api";
const apiBaseUrl = (rawBase.endsWith("/")) ? rawBase : `${rawBase}/`;

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

export default apiClient;


