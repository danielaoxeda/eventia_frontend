import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { getCurrentUser } from "@/shared/services/authService";
import type { AuthUser } from "@/shared/types/auth.types";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  login: (token: string, user?: AuthUser, expiresIn?: number) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

function formatEpochSeconds(value: unknown): string {
  return typeof value === "number" ? new Date(value * 1000).toLocaleString() : String(value ?? "");
}

function getTokenExpirationMs(token: string): number | null {
  const json = decodeJwtPayload(token);
  return json && typeof json.exp === "number" ? json.exp * 1000 : null;
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
      console.log("[Eventia] ⏰ Sesión expirada, cerrando sesión");
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

    getCurrentUser()
      .then((authenticatedUser) => {
        setUser(authenticatedUser);
        setIsAuthenticated(true);
        scheduleLogout(token);
      })
      .catch(() => {
        clearSession();
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => clearLogoutTimer();
  }, []);

  const login = async (token: string, authenticatedUser?: AuthUser, expiresIn?: number) => {
    localStorage.setItem("accessToken", token);
    localStorage.removeItem("authUser");

    // Solo con fines académicos: muestra el token y su payload decodificado.
    const payload = decodeJwtPayload(token);
    console.info("[Eventia][JWT][Académico] token:", token);
    if (payload) {
      console.info("[Eventia][JWT][Académico] payload:", {
        sub: payload.sub,
        role: payload.role,
        userId: payload.userId,
        name: payload.name,
        iat: formatEpochSeconds(payload.iat),
        exp: formatEpochSeconds(payload.exp),
      });
    }

    scheduleLogout(token, expiresIn);
    if (authenticatedUser) {
      console.log("[Eventia] ✅ Sesión iniciada para:", authenticatedUser.email);
      setUser(authenticatedUser);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    console.log("[Eventia] 👋 Cerrando sesión");
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
