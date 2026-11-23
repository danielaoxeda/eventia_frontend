import { createContext, useContext } from "react";

import type { AuthUser } from "@/shared/types/auth.types";

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  login: (token: string, user?: AuthUser, expiresIn?: number) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: AuthUser) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de un AuthProvider");
  }
  return context;
}
