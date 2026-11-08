export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginBackendUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginBackendResponse {
  token: string;
  tokenType?: string;
  expiresIn?: number;
  user: LoginBackendUser;
}

// Respuesta mapeada para el frontend (accessToken, expiresIn y rol).
export interface LoginResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  rol: string;
  accessToken: string;
  expiresIn?: number;
  message: string;
}
