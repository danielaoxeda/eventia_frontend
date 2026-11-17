import api from "../../../shared/services/api";
import type { RegisterRequest, RegisterResponse } from "../types/register.types";

// El backend solo acepta 5 campos; documentNumber se envía como "dni" de 8 dígitos.
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  console.log("[Eventia] 📝 Intentando registrar usuario:", data.email);

  const payload = {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    dni: data.documentNumber.trim(),
    email: data.email.trim().toLowerCase(),
    password: data.password,
  };

  console.log("[Eventia] 📦 Enviando al backend:", { ...payload, password: "***" });

  const { data: backendData } = await api.post("/auth/register", payload);

  console.log("[Eventia] ✅ Registro exitoso en el backend para:", data.email);

  return {
    accessToken: backendData.token,
    message: "Cuenta creada exitosamente",
  };
}
