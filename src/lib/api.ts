import axios from "axios";

// Base URL resolution order:
// 1) VITE_API_BASE_URL (recommended in Vercel)
// 2) If running on vercel.app and env missing, default to Render URL
// 3) Fallback to "/api" (Vite dev proxy)
let resolvedBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
if (!resolvedBase && typeof window !== "undefined") {
  const host = window.location.hostname;
  if (host.endsWith("vercel.app")) {
    resolvedBase = "https://sakayhub-web.onrender.com/api";
  }
}
const rawBase = resolvedBase || "/api";
const apiBaseUrl = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

export default apiClient;


