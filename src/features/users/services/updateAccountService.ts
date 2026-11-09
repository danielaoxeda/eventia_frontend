import api from "@/shared/services/api";
import { getCurrentUser } from "@/shared/services/authService";
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

function mapUser(raw: any): AuthUser {
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
    payload.password = data.password;
    payload.newPassword = data.password;
    payload.currentPassword = data.currentPassword;
  }

  const attempts: Array<[string, "put" | "patch" | "post"]> = [
    ["/api/users/me", "put"],
    ["/api/users/me", "patch"],
    ["/api/auth/me", "patch"],
    ["/api/auth/profile", "patch"],
    ["/auth/me", "patch"],
    ["/users/me", "put"],
  ];

  let lastErr: any;
  for (const [path, method] of attempts) {
    try {
      const res = await (api as any)[method](path, payload);
      const body = res?.data;
      if (body && (body.id || body.email || body.user)) return mapUser(body.user ?? body);
      return await getCurrentUser();
    } catch (err: any) {
      lastErr = err;
      const status = err?.response?.status;
      if (status === 400 || status === 409 || status === 422) {
        const msg = String(err?.response?.data?.message || err?.response?.data?.error || "").toLowerCase();
        if (msg.includes("contrase") && (msg.includes("actual") || msg.includes("incorrect") || msg.includes("invalid"))) throw new Error("INVALID_CURRENT_PASSWORD");
        if (msg.includes("email") && (msg.includes("uso") || msg.includes("exist") || msg.includes("duplic"))) throw new Error("EMAIL_IN_USE");
        throw new Error(err?.response?.data?.message || "VALIDATION_ERROR");
      }
      if (status && ![404, 405, 501].includes(status)) throw err;
    }
  }
  const status = lastErr?.response?.status;
  if ([404, 405, 501].includes(status)) {
    throw new Error("La actualización de perfil no está disponible en el backend todavía.");
  }
  throw new Error(lastErr?.response?.data?.message || "No se pudo actualizar el perfil.");
}
