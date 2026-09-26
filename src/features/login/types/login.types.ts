export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}