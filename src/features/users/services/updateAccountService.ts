import api from "@/shared/services/api";
import type { AuthUser } from "@/shared/types/auth.types";

export interface UpdateAccountData {
  email?: string;
  currentPassword?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  cellphone?: string;
  phoneNumber?: string;
}

interface RawUser {
  id?: string | number;
  firstName?: string;
  nombre?: string;
  lastName?: string;
  apellido?: string;
  email?: string;
  rol?: string;
  role?: string;
  documentType?: string;
  tipoDocumento?: string;
  documentNumber?: string;
  numeroDocumento?: string;
  dni?: string;
  birthDate?: string;
  fechaNacimiento?: string;
  phoneNumber?: string;
  telefono?: string;
  cellphone?: string;
}

interface UpdateProfileResponse {
  token: string;
  user: RawUser;
}

interface HttpErrorLike {
  response?: {
    status?: number;
    data?: { message?: string; error?: string };
  };
}

function isHttpErrorLike(value: unknown): value is HttpErrorLike {
  return typeof value === "object" && value !== null && "response" in value;
}

function mapUser(raw: RawUser): AuthUser {
  return {
    id: Number(raw.id),
    firstName: raw.firstName ?? raw.nombre ?? "",
    lastName: raw.lastName ?? raw.apellido ?? "",
    email: raw.email ?? "",
    rol: raw.rol ?? raw.role ?? "USER",
    documentType: raw.documentType ?? raw.tipoDocumento ?? undefined,
    documentNumber: raw.documentNumber ?? raw.numeroDocumento ?? raw.dni ?? undefined,
    birthDate: raw.birthDate ?? raw.fechaNacimiento ?? undefined,
    phoneNumber: raw.phoneNumber ?? raw.telefono ?? raw.cellphone ?? undefined,
  };
}

// El backend identifica al usuario por el JWT, por eso no se envía el id.
export async function updateAccount(
  _userId: number,
  data: UpdateAccountData
): Promise<AuthUser> {
  const payload: Record<string, unknown> = {};
  if (data.email) payload.email = data.email.trim().toLowerCase();
  if (data.firstName) payload.firstName = data.firstName;
  if (data.lastName) payload.lastName = data.lastName;
  if (data.cellphone || data.phoneNumber) payload.cellphone = data.cellphone ?? data.phoneNumber;
  if (data.password) {
    payload.newPassword = data.password;
    payload.currentPassword = data.currentPassword;
  }

  try {
    const { data: body } = await api.patch<UpdateProfileResponse>("/auth/me", payload);
    // El email forma parte del JWT: hay que reemplazarlo para no invalidar la sesión.
    if (body.token) localStorage.setItem("accessToken", body.token);
    return mapUser(body.user);
  } catch (err: unknown) {
    if (isHttpErrorLike(err)) {
      const status = err.response?.status;
      if (status && [400, 401, 409, 422].includes(status)) {
        const msg = String(err.response?.data?.message ?? err.response?.data?.error ?? "");
        const lower = msg.toLowerCase();
        if (lower.includes("contrase") && (lower.includes("actual") || lower.includes("incorrect"))) {
          throw new Error("INVALID_CURRENT_PASSWORD", { cause: err });
        }
        if (lower.includes("email") && (lower.includes("uso") || lower.includes("registrado") || lower.includes("existe"))) {
          throw new Error("EMAIL_IN_USE", { cause: err });
        }
        throw new Error(msg || "VALIDATION_ERROR", { cause: err });
      }
    }
    throw new Error("No se pudo actualizar el perfil.", { cause: err });
  }
}
