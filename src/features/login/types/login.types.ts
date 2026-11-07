export interface LoginRequest {
  email: string;
  password: string;
}

// El backend solo devuelve el token. El perfil (incluido el rol)
// se obtiene después con GET /auth/me.
export interface LoginResponse {
  accessToken: string;
  message: string;
}
