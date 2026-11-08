export interface RegisterRequest {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
  phonePrefix: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;

}

export interface RegisterResponse {
  accessToken?: string;
  message?: string;
}
