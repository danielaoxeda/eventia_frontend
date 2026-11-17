import api from "@/shared/services/api";
import type {
  LoginBackendResponse,
  LoginRequest,
  LoginResponse,
} from "../types/login.types";

function splitName(name: string) {
  const parts = (name || "").trim().split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
}

// Login real; mapea la respuesta enriquecida del backend para el frontend.
export async function login(data: LoginRequest): Promise<LoginResponse> {
  console.log("[Eventia] 🔑 Intentando iniciar sesión para:", data.email);

  try {
    const response = await api.post<LoginBackendResponse>("/auth/login", {
      email: data.email,
      password: data.password,
    });
    const payload = response.data;
    const { firstName, lastName } = splitName(payload.user?.name ?? "");

    console.log("[Eventia] ✅ Login exitoso en el backend para:", data.email);

    return {
      id: payload.user.id,
      firstName,
      lastName,
      email: payload.user.email,
      rol: payload.user.role,
      accessToken: payload.token,
      expiresIn: payload.expiresIn,
      message: "Inicio de sesión exitoso",
    };
  } catch (error) {
    console.log("[Eventia] ⚠️ Login falló, se avisa al usuario.");
    throw error;
  }
}
