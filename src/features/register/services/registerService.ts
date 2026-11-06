import api from "../../../shared/services/api";
import type { RegisterRequest, RegisterResponse } from "../types/register.types";

/**
 * Registro real contra el backend:
 * POST http://localhost:8080/auth/register
 * { firstName, lastName, dni, email, password }
 *
 * Nota sencilla: el formulario tiene más campos (fecha de nacimiento,
 * tipo de documento, teléfono...), pero el backend solo pide estos 5.
 * Por eso usamos documentNumber como "dni". Si el tipo no es DNI (Perú),
 * el backend puede rechazarlo porque espera 8 dígitos.
 */
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

  console.log("[Eventia] ✅ Registro exitoso en el backend para:", backendData.email);

  return {
    id: backendData.id,
    firstName: backendData.firstName,
    lastName: backendData.lastName,
    email: backendData.email,
    accessToken: backendData.token,
    message: "Cuenta creada exitosamente",
  };
}
