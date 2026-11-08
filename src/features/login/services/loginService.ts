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

export async function login(data: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginBackendResponse>("/auth/login", {
      email: data.email,
      password: data.password,
    });
    const payload = response.data;
    const { firstName, lastName } = splitName(payload.user?.name ?? "");

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
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 401) {
      throw new Error("INVALID_CREDENTIALS");
    }
    throw new Error("LOGIN_ERROR");
  }
}