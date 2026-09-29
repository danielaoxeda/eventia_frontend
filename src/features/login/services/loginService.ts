import type { ApiUser } from "@/shared/types/api.types";
import api from "@/shared/services/api";
import type {
  LoginRequest,
  LoginResponse,
} from "../types/login.types";

export async function login(
  data: LoginRequest
): Promise<LoginResponse> {
  try {
    const response = await api.get<ApiUser[]>("/users", {
      params: {
        email: data.email,
      },
    });

    const users = response.data;

    const user = users[0];

    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    if (user.password !== data.password) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // Token simulado.

    const accessToken =
      `eventia-mock-token-${user.id}-${Date.now()}`;

    return {
      id: Number(user.id),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      rol: user.rol,
      accessToken,
      message: "Inicio de sesión exitoso",
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_CREDENTIALS"
    ) {
      throw error;
    }

    throw new Error("LOGIN_ERROR");
  }
}