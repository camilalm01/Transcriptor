import type { LoginInput, RegisterInput } from '../validation/authSchemas';
import { createAuthProvider } from './authProviders';

export type AuthUser = { id: string; name: string; email: string };
export type LoginResponse = { user: AuthUser; token?: string };
export type RegisterResponse = { user: AuthUser; token?: string };
const FRONT_ONLY_MODE = import.meta.env.VITE_FRONT_ONLY !== 'false';
const authProvider = createAuthProvider(FRONT_ONLY_MODE);

export function login(data: LoginInput) {
  return authProvider.login(data);
}

export function register(data: RegisterInput) {
  return authProvider.register(data);
}