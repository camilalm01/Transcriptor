import { Navigate, useLocation } from "react-router-dom";

import type { ReactNode } from "react";

import { useAuth } from "../../contexts/auth/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Mientras se recupera la sesión no se redirige: evita mandar al login por error.
  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="min-h-dvh flex items-center justify-center"
      >
        Cargando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }
  return children;
}
