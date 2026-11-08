import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import api from "@/shared/services/api";
import type { AuthUser } from "@/shared/types/auth.types";

interface MeResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  login: (token: string, user?: AuthUser) => void;
  logout: () => void;
  updateUser: (updatedUser: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapMeToAuthUser(data: MeResponse): AuthUser {
  return {
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    rol: data.role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(
    () => localStorage.getItem("accessToken") !== null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const clearSession = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authUser");
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsLoading(false);
      return;
    }

    api
      .get<MeResponse>("/auth/me")
      .then((response) => {
        setUser(mapMeToAuthUser(response.data));
        setIsAuthenticated(true);
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          clearSession();
        } else {
          clearSession();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = (token: string, authenticatedUser?: AuthUser) => {
    localStorage.setItem("accessToken", token);
    localStorage.removeItem("authUser");
    if (authenticatedUser) {
      setUser(authenticatedUser);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    clearSession();
  };

  const updateUser = (updatedUser: AuthUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, login, logout, updateUser }}
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