<<<<<<< HEAD
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
=======
import axios from "axios";

// URL del backend (configurable con VITE_API_URL).
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

console.log(`[Eventia] 🌐 Frontend conectado al backend en: ${API_URL}`);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Agrega el JWT a las peticiones autenticadas.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(
    `[Eventia] 📡 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}${
      token ? " (con JWT)" : " (sin JWT)"
    }`
  );
  return config;
});

function clearAuthSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("authUser");
}

api.interceptors.response.use(
  (response) => {
    console.log(
      `[Eventia] ✅ ${response.config.method?.toUpperCase()} ${response.config.url} -> ${response.status}`
    );
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const requestUrl = String(error?.config?.url ?? "");
    const url = error?.config?.url;
    const isLoginRequest = requestUrl.includes("/auth/login");
    const isOnLogin = window.location.pathname === "/login";

    if (!error?.response) {
      console.error(
        `[Eventia] ❌ ${url} -> SIN RESPUESTA. ¿Está encendido el backend en ${API_URL}?`,
        error.message
      );
    } else {
      console.error(`[Eventia] ❌ ${url} -> Error ${status}:`, error.response.data);
    }

    const skipAuthRedirect = Boolean((error?.config as any)?.skipAuthRedirect);

    if (status === 401) {
      if (!skipAuthRedirect && !isLoginRequest && !isOnLogin) {
        const from = `${window.location.pathname}${window.location.search}`;
        clearAuthSession();
        window.location.replace(`/login?from=${encodeURIComponent(from)}`);
      }
    } else if (status === 403) {
      if (!skipAuthRedirect && window.location.pathname !== "/forbidden") {
        window.location.replace("/forbidden");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
>>>>>>> feat/organizer-frontend-modules
