import { createContext } from "react";

export type UserRole =
| "speaker"
| "viewer";

export interface AuthUser {
  id: string;
  nombreCompleto: string;
  correo: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);