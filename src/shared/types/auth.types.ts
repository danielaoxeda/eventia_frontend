export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  rol: string;
  documentType?: string;
  documentNumber?: string;
  birthDate?: string;
  phoneNumber?: string;
}