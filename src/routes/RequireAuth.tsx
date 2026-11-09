import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

/** Ruta privada: exige sesión iniciada; sin ella manda a /login. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <AuthLoading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

/** Exige sesión + rol exacto; con otro rol manda a la página 403. */
export function RequireRole({
  rol,
  children,
}: {
  rol: string;
  children: ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <AuthLoading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.rol !== rol) return <Navigate to="/forbidden" replace />;
  return children;
}

/** Para /login y /registro: si ya hay sesión, vuelve al catálogo. */
export function RedirectIfAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <AuthLoading />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}
