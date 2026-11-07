import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

/** Ruta privada: exige sesión iniciada; sin ella manda a /login. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
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
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.rol !== rol) return <Navigate to="/forbidden" replace />;
  return children;
}

/** Para /login y /registro: si ya hay sesión, vuelve al catálogo. */
export function RedirectIfAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}
