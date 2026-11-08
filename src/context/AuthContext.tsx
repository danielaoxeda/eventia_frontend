import {
  createContext,
  useContext,
  useEffect,
  useRef,
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
  login: (token: string, user?: AuthUser, expiresIn?: number) => void;
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

function getTokenExpirationMs(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof json.exp === "number" ? json.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(
    () => localStorage.getItem("accessToken") !== null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const logoutTimerRef = useRef<number | null>(null);

  const clearLogoutTimer = () => {
    if (logoutTimerRef.current) {
      window.clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  const clearSession = () => {
    clearLogoutTimer();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authUser");
    setIsAuthenticated(false);
    setUser(null);
  };

  const scheduleLogout = (token: string, expiresIn?: number) => {
    clearLogoutTimer();
    const expMs = expiresIn ? Date.now() + expiresIn * 1000 : getTokenExpirationMs(token);
    if (!expMs) return;
    const delay = Math.max(expMs - Date.now(), 0);
    logoutTimerRef.current = window.setTimeout(() => {
      clearSession();
      window.location.replace("/login");
    }, delay);
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
        scheduleLogout(token);
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

    return () => clearLogoutTimer();
  }, []);

  const login = (token: string, authenticatedUser?: AuthUser, expiresIn?: number) => {
    localStorage.setItem("accessToken", token);
    localStorage.removeItem("authUser");
    scheduleLogout(token, expiresIn);
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