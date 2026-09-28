import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  getStoredUsers,
  type StoredUser,
} from "../shared/services/mockUserStorage";

interface AuthContextType {
  isAuthenticated: boolean;
  user: StoredUser | null;
  login: (token: string) => void;
  logout: () => void;
  updateUser: (updatedUser: StoredUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

function resolveUserFromToken(token: string | null): StoredUser | null {
  if (!token) return null;
  // Formato del token simulado: eventia-mock-token-{userId}-{timestamp}
  const userId = Number(token.split("-")[3]);
  if (!Number.isFinite(userId)) return null;
  return getStoredUsers().find((stored) => stored.id === userId) ?? null;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("accessToken") !== null
  );
  const [user, setUser] = useState<StoredUser | null>(() =>
    resolveUserFromToken(localStorage.getItem("accessToken"))
  );

  const login = (token: string) => {
    localStorage.setItem("accessToken", token);
    setIsAuthenticated(true);
    setUser(resolveUserFromToken(token));
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (updatedUser: StoredUser) => {
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