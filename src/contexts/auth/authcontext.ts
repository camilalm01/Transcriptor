import { createContext } from "react";

export interface AuthUser {
  id: string;
  nombreCompleto: string;
  correo: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);