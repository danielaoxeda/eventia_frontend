import axios from "axios";

// ============================================================
// CONEXIÓN CON EL BACKEND
// ------------------------------------------------------------
// - El backend Spring Boot corre en http://localhost:8080
// - Puedes cambiarlo con un archivo .env (ver .env.example)
//   VITE_API_URL=http://localhost:8080
// ============================================================

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Log básico al arrancar: qué backend está usando el frontend
console.log(`[Eventia] 🌐 Frontend conectado al backend en: ${API_URL}`);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Antes de enviar: adjunta el token guardado (si el usuario hizo login)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`[Eventia] 📡 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

// Después de responder: log sencillo de éxito o error
api.interceptors.response.use(
  (response) => {
    console.log(`[Eventia] ✅ ${response.config.method?.toUpperCase()} ${response.config.url} -> ${response.status}`);
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url;
    if (!error?.response) {
      console.error(`[Eventia] ❌ ${url} -> SIN RESPUESTA. ¿Está encendido el backend en ${API_URL}?`, error.message);
    } else {
      console.error(`[Eventia] ❌ ${url} -> Error ${status}:`, error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;
