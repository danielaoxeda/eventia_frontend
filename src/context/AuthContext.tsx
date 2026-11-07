import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { getCurrentUser } from "@/shared/services/authService";
import type { AuthUser } from "@/shared/types/auth.types";

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = "authUser";

function getSavedUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("accessToken") !== null
  );
  const [user, setUser] = useState<AuthUser | null>(() => getSavedUser());

  // Guarda el token y carga la identidad real desde el backend (GET /auth/me).
  const login = async (token: string) => {
    localStorage.setItem("accessToken", token);

    try {
      const authenticatedUser = await getCurrentUser();
      console.log("[Eventia] ✅ Sesión iniciada para:", authenticatedUser.email);
      localStorage.setItem(USER_KEY, JSON.stringify(authenticatedUser));
      setIsAuthenticated(true);
      setUser(authenticatedUser);
    } catch (error) {
      // Si no se pudo identificar al usuario, no dejamos una sesión a medias.
      localStorage.removeItem("accessToken");
      localStorage.removeItem(USER_KEY);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    console.log("[Eventia] 👋 Cerrando sesión");
    localStorage.removeItem("accessToken");
    localStorage.removeItem(USER_KEY);
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (updatedUser: AuthUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de un AuthProvider");
  }
  return context;
}
