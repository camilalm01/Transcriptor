import { useState } from "react";

import type { ReactNode } from "react";

import {
  AuthContext,
  type AuthUser,
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

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);

  const login = (userData: AuthUser) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}