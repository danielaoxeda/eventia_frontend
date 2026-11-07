export interface LoginRequest {
  email: string;
  password: string;
}

// El backend solo devuelve el token; el perfil y el rol llegan desde /auth/me.
export interface LoginResponse {
  accessToken: string;
  message: string;
}
