import type { AuthUser } from "@/shared/types/auth.types";

export interface UpdateAccountData {
  email?: string;
  currentPassword?: string;
  password?: string;
}

// TODO: conectar con endpoint real de actualización de cuenta cuando el backend lo exponga.
export async function updateAccount(
  _userId: number,
  _data: UpdateAccountData
): Promise<AuthUser> {
  throw new Error("NOT_AVAILABLE");
}