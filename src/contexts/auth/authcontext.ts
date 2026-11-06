import { createContext } from "react";

import type { ApiUser } from "../../api/types";

export type UserRole =
| "speaker"
| "viewer";

export type AuthUser = ApiUser;

export interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  /** true mientras se intenta recuperar la sesión al abrir la app */
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
  setRole: (role: UserRole) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);