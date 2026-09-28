import type { RegisterRequest } from "@/features/register/types/register.types";

export interface StoredUser {
  id: number;
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

const STORAGE_KEY = "user";

export function getStoredUsers(): StoredUser[] {
  if (typeof window !== "undefined" && localStorage.getItem("eventia_users")) {
    localStorage.removeItem("eventia_users");
  }

  const users = localStorage.getItem(STORAGE_KEY);

  if (!users) {
    const defaultUsers: StoredUser[] = [
      {
        id: 1,
        firstName: "Roberto",
        lastName: "Quispe Huamán",
        email: "rquispe@gmail.com",
        password: "Password123!",
        rol: "USER",
        documentType: "DNI",
        documentNumber: "48120573",
        birthDate: "1992-05-15",
        phoneNumber: "+51 987 654 321",
      },
      {
        id: 2,
        firstName: "Valeria",
        lastName: "Mendoza Ramos",
        email: "vmendoza@eventia.pe",
        password: "Password123!",
        rol: "ADMIN",
        documentType: "DNI",
        documentNumber: "45892110",
        birthDate: "1988-11-20",
        phoneNumber: "+51 912 345 678",
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }

  try {
    const parsed = JSON.parse(users);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    if (typeof parsed === "object" && parsed !== null) {
      return [parsed];
    }
    return [];
  } catch {
    return [];
  }
}

export function saveUser(data: RegisterRequest): StoredUser {
  if (typeof window !== "undefined" && localStorage.getItem("eventia_users")) {
    localStorage.removeItem("eventia_users");
  }

  const users = getStoredUsers();

  const newUser: StoredUser = {
    id: Date.now(),
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    rol: "USER",
    documentType: data.documentType,
    documentNumber: data.documentNumber,
    birthDate: data.birthDate,
    phoneNumber: data.phoneNumber,
  };

  users.push(newUser);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(users)
  );

  return newUser;
}

export function findUserByEmail(
  email: string
): StoredUser | undefined {
  const users = getStoredUsers();

  return users.find(
    (user) =>
      user.email && user.email.toLowerCase() === email.toLowerCase()
  );
}

export function updateStoredUser(
  userId: number,
  updates: { email?: string; password?: string }
): StoredUser {
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) {
    throw new Error("USER_NOT_FOUND");
  }

  if (updates.email && updates.email.toLowerCase() !== users[index].email.toLowerCase()) {
    const emailExists = users.some(
      (u, i) => i !== index && u.email.toLowerCase() === updates.email!.toLowerCase()
    );
    if (emailExists) {
      throw new Error("EMAIL_IN_USE");
    }
  }

  const updatedUser: StoredUser = {
    ...users[index],
    ...(updates.email ? { email: updates.email.trim() } : {}),
    ...(updates.password ? { password: updates.password } : {}),
  };

  users[index] = updatedUser;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

  return updatedUser;
}