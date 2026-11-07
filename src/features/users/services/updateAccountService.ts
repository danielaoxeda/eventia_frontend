import api from "@/shared/services/api";
import type { ApiUser } from "@/shared/types/api.types";
import type { AuthUser } from "@/shared/types/auth.types";

export interface UpdateAccountData {
  email?: string;
  currentPassword?: string;
  password?: string;
}

export async function updateAccount(
  userId: number,
  data: UpdateAccountData
): Promise<AuthUser> {
  try {
    // Obtener el usuario actual desde JSON Server
    const response = await api.get<ApiUser>(
      `/users/${userId}`
    );

    const user = response.data;

    // Validar contraseña actual cuando se quiere cambiar
    // la contraseña
    if (data.password) {
      if (
        !data.currentPassword ||
        user.password !== data.currentPassword
      ) {
        throw new Error("INVALID_CURRENT_PASSWORD");
      }
    }

    // Verificar que el nuevo correo no pertenezca
    // a otro usuario
    if (
      data.email &&
      data.email.toLowerCase() !== user.email.toLowerCase()
    ) {
      const existingUsers = await api.get<ApiUser[]>(
        "/users",
        {
          params: {
            email: data.email,
          },
        }
      );

      const emailInUse = existingUsers.data.some(
        (existingUser) =>
          String(existingUser.id) !== String(user.id)
      );

      if (emailInUse) {
        throw new Error("EMAIL_IN_USE");
      }
    }

    // Preparar únicamente los campos que cambiarán
    const changes: Partial<ApiUser> = {};

    if (data.email) {
      changes.email = data.email.trim();
    }

    if (data.password) {
      changes.password = data.password;
    }

    // Actualizar el usuario en JSON Server
    const updatedResponse = await api.patch<ApiUser>(
      `/users/${userId}`,
      changes
    );

    const updatedUser = updatedResponse.data;

    // Convertir ApiUser -> AuthUser
    // No enviamos la contraseña al contexto
    return {
      id: Number(updatedUser.id),
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      rol: updatedUser.rol,
      documentType: updatedUser.documentType,
      documentNumber: updatedUser.documentNumber,
      birthDate: updatedUser.birthDate,
      phoneNumber: updatedUser.phoneNumber,
    };
  } catch (error) {
    // Errores que queremos conservar
    if (
      error instanceof Error &&
      (
        error.message === "INVALID_CURRENT_PASSWORD" ||
        error.message === "EMAIL_IN_USE"
      )
    ) {
      throw error;
    }

    console.error(
      "Error al actualizar la cuenta:",
      error
    );

    throw new Error("UPDATE_ACCOUNT_ERROR");
  }
}