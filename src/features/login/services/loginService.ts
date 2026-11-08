import api from "../../../shared/services/api";
import type { LoginRequest, LoginResponse } from "../types/login.types";

// Login real; devuelve solo el token (el perfil se obtiene en /auth/me).
export async function login(data: LoginRequest): Promise<LoginResponse> {
  console.log("[Eventia] 🔑 Intentando iniciar sesión para:", data.email);

  try {
    const { data: backendData } = await api.post("/auth/login", data);

    console.log("[Eventia] ✅ Login exitoso en el backend para:", data.email);

    return {
      accessToken: backendData.token,
      message: "Inicio de sesión exitoso",
    };
  } catch (error) {
    // El interceptor de api.ts ya registró el error; el formulario lo muestra.
    console.log("[Eventia] ⚠️ Login falló, se avisa al usuario.");
    throw error;
  }
}
