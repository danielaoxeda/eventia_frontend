export interface ApiUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rol: string;
  documentType?: string;
  documentNumber?: string;
  birthDate?: string;
  phoneNumber?: string;
}