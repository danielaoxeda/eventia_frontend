import api from "../../../shared/services/api";
import type {
  LoginRequest,
  LoginResponse,
} from "../types/login.types";

export async function login(
  data: LoginRequest
): Promise<LoginResponse> {

  const response = await api.post(
    "/auth/login",
    {
      username: data.email,
      password: data.password,
    }
  );

  return response.data;
}