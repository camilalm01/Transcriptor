import { useCallback, useEffect, useMemo, useState } from "react";

import type { ReactNode } from "react";

import {
  AuthContext,
  type AuthUser,
  type UserRole,
} from "./authcontext";

import {
  refreshSession,
  setAccessToken,
  setSessionExpiredHandler,
} from "../../api/client";
import { authService } from "../../features/auth/services/authService";
import { queryClient } from "../../lib/queryClient";

interface AuthProviderProps {
  children: ReactNode;
}

function isValidRole(
  role: string
): role is UserRole {
  return (
    role === "speaker" ||
    role === "viewer"
  );
}

function getStoredRole(): UserRole | null {
  const storedRole =
    sessionStorage.getItem("role");

  if (!storedRole) {
    return null;
  }

  if (!isValidRole(storedRole)) {
    sessionStorage.removeItem("role");
    return null;
  }
  return storedRole;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // El usuario y el token viven solo en memoria: al recargar se recuperan con /auth/refresh.
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRoleState] = useState<UserRole | null>(getStoredRole);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    setRoleState(null);
    sessionStorage.removeItem("role");
    queryClient.clear();
  }, []);

  useEffect(() => {
    let active = true;

    setSessionExpiredHandler(clearSession);

    // En StrictMode este efecto corre dos veces: refreshSession() comparte
    // la misma promesa, así que solo sale una petición real.
    refreshSession()
      .then(({ user: sessionUser }) => {
        if (active) setUser(sessionUser);
      })
      .catch(() => {
        // sin cookie o sesión vencida: el usuario verá el login
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      setSessionExpiredHandler(null);
    };
  }, [clearSession]);

  const login = useCallback((userData: AuthUser) => {
    setUser(userData);
  }, []);

  const setRole = useCallback((newRole: UserRole) => {
    if (!isValidRole(newRole)) {
      return;
    }
    setRoleState(newRole);
    sessionStorage.setItem("role", newRole);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // aunque falle la red, se cierra la sesión local
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      role,
      isAuthenticated: Boolean(user),
      loading,
      login,
      logout,
      setRole,
    }),
    [user, role, loading, login, logout, setRole]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}