import api from "../../../shared/services/api";
import type { LoginRequest, LoginResponse } from "../types/login.types";

/**
 * Login real contra el backend:
 * POST http://localhost:8080/auth/login  { email, password }
 * Devuelve: { token }
 *
 * La identidad y el rol del usuario se consultan después en GET /auth/me.
 */
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
    // El interceptor de api.ts ya mostró el error en consola.
    // Aquí solo traducimos el error para el formulario.
    console.log("[Eventia] ⚠️ Login falló, se avisa al usuario.");
    throw error;
  }
}
