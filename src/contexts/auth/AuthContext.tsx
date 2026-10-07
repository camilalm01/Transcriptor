import { useState } from "react";

import type { ReactNode } from "react";

import {
  AuthContext,
  type AuthUser,
  type UserRole,
} from "./authcontext";

interface AuthProviderProps {
  children: ReactNode;
}

function getStoredUser(): AuthUser | null {
  const storedUser = sessionStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    sessionStorage.removeItem("user");
    return null;
  }
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
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);
  const [role, setRoleState] = useState<UserRole | null>(getStoredRole);

  const login = (userData: AuthUser) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const setRole = ( role: UserRole ) => {
  if (!isValidRole(role)) {
    return;
  }
  setRoleState(role);
  sessionStorage.setItem(
    "role",
    role
  );
};

  const logout = () => {
    setUser(null);
    setRoleState(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: Boolean(user),
        login,
        logout,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}