import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { AuthUser } from "@/shared/types/auth.types";

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  updateUser: (updatedUser: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("accessToken") !== null
  );

  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser = localStorage.getItem("authUser");

    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  });

  const login = (
    token: string,
    authenticatedUser: AuthUser
  ) => {
    localStorage.setItem("accessToken", token);

    localStorage.setItem(
      "authUser",
      JSON.stringify(authenticatedUser)
    );

    setIsAuthenticated(true);
    setUser(authenticatedUser);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authUser");

    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (updatedUser: AuthUser) => {
    localStorage.setItem(
      "authUser",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe utilizarse dentro de un AuthProvider"
    );
  }

  return context;
}