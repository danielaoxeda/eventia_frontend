import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { StoredUser } from "../shared/services/mockUserStorage";

// Usuario que devuelve el backend al hacer login/registro
export interface AuthUserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: StoredUser | null;
  login: (token: string, userData: AuthUserData) => void;
  logout: () => void;
  updateUser: (updatedUser: StoredUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = "eventia_user";

function getSavedUser(): StoredUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("accessToken") !== null
  );
  const [user, setUser] = useState<StoredUser | null>(() => getSavedUser());

  const login = (token: string, userData: AuthUserData) => {
    console.log("[Eventia] ✅ Guardando sesión para:", userData.email);
    localStorage.setItem("accessToken", token);
    // Guardamos los datos reales que mandó el backend (sin contraseña)
    const storedUser: StoredUser = { ...userData, password: "", rol: "USER" };
    localStorage.setItem(USER_KEY, JSON.stringify(storedUser));
    setIsAuthenticated(true);
    setUser(storedUser);
  };

  const logout = () => {
    console.log("[Eventia] 👋 Cerrando sesión");
    localStorage.removeItem("accessToken");
    localStorage.removeItem(USER_KEY);
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (updatedUser: StoredUser) => {
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
