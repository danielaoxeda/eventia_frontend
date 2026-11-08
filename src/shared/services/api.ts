import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function clearAuthSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("authUser");
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = String(error?.config?.url ?? "");
    const isLoginRequest = requestUrl.includes("/auth/login");
    const isOnLogin = window.location.pathname === "/login";

    if (status === 401) {
      if (!isLoginRequest && !isOnLogin) {
        const from = `${window.location.pathname}${window.location.search}`;
        clearAuthSession();
        window.location.replace(`/login?from=${encodeURIComponent(from)}`);
      }
    } else if (status === 403) {
      if (window.location.pathname !== "/forbidden") {
        window.location.replace("/forbidden");
      }
    }

    return Promise.reject(error);
  }
);

export default api;