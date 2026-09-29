import api from "../../../shared/services/api";
import type { ApiUser } from "@/shared/types/api.types";

import type {
  RegisterRequest,
  RegisterResponse,
} from "../types/register.types";

export async function register(
  data: RegisterRequest
): Promise<RegisterResponse> {

  try {
    // 1. Verificar si el correo ya existe en la API
    const existingUsers = await api.get<ApiUser[]>("/users", {
      params: {
        email: data.email,
      },
    });

    if (existingUsers.data.length > 0) {
      throw new Error(
        "Ya existe una cuenta con este correo electrónico."
      );
    }

    // 2. Registrar usuario mediante la API REST simulada
    const response = await api.post<ApiUser>("/users", {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      rol: "USER",
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      birthDate: data.birthDate,
      phoneNumber: data.phoneNumber,
    });

    const user = response.data;

    // 3. Devolver respuesta al RegisterForm
    return {
      id: Number(user.id),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accessToken: "",
      message: "Cuenta creada exitosamente",
    };

  } catch (error) {

    // Mantener el error de correo duplicado
    if (
      error instanceof Error &&
      error.message ===
        "Ya existe una cuenta con este correo electrónico."
    ) {
      throw error;
    }

    console.error(
      "Error al registrar usuario mediante la API:",
      error
    );

    throw new Error(
      "No se pudo registrar la cuenta. Verifica que la API esté disponible."
    );
  }
}