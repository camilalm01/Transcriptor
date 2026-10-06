import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

export interface AuthUser {
  id: string;
  nombreCompleto: string;
  correo: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: ( user: AuthUser ) => void;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>( null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem( "user");

    if (storedUser) {
      setUser( JSON.parse(storedUser));
    }
  }, []);

  const login = ( userData: AuthUser ) => {
    setUser(userData);
    sessionStorage.setItem(
      "user",
      JSON.stringify(userData)
    );
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(
      "user"
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated:
          !!user,
        login,
        logout,
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
      "useAuth debe utilizarse dentro de AuthProvider"
    );
  }
  return context;
}