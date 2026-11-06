export type UserRole =
  | "USER"
  | "ADMIN"
  | "SUPERADMIN";

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface SessionResponse {
  accessToken: string;
  user: ApiUser;
  mfaRequired: boolean;
  mfaSetupRequired: boolean;
  mfaToken?: string;
}

/**
 * Respuesta de /auth/login:
 * cuando MFA está habilitado puede venir mfaToken
 * en lugar de accessToken.
 */
export interface LoginResponse {
  accessToken?: string;
  user?: ApiUser;
  mfaRequired?: boolean;
  mfaSetupRequired?: boolean;
  mfaToken?: string;
}

export interface MessageResponse {
  message: string;
}