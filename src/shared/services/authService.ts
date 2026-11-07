import api from "./api";
import type { AuthUser } from "../types/auth.types";

// Respuesta de GET /auth/me (backend)
interface AuthenticatedUserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

/**
 * Obtiene el perfil del usuario autenticado a partir del JWT.
 * El backend identifica al usuario con Authentication (email del subject).
 */
export async function getCurrentUser(): Promise<AuthUser> {
  const { data } = await api.get<AuthenticatedUserResponse>("/auth/me");

  console.log(
    "[Eventia] 👤 Usuario autenticado obtenido desde /auth/me:",
    data.email,
    "| rol:",
    data.role
  );

  return {
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    rol: data.role,
  };
}
