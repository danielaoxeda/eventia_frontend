import api from "../../../shared/services/api";
import type {
  LoginRequest,
  LoginResponse,
} from "../types/login.types";

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    credentials
  );

  return response.data;
};