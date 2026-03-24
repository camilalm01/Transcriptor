import { http } from './http';
import type { LoginInput, RegisterInput } from '../validation/authSchemas';
import type { AuthUser, LoginResponse, RegisterResponse } from './auth';

type BackendUsuario = {
  id: string;
  nombreCompleto: string;
  correo: string;
};

function toAuthUser(usuario: BackendUsuario): AuthUser {
  return {
    id: usuario.id,
    name: usuario.nombreCompleto,
    email: usuario.correo
  };
}

function buildMockUser(data: { name?: string; email: string }): AuthUser {
  const id = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now());

  return {
    id,
    name: data.name?.trim() || data.email.split('@')[0] || 'Usuario Demo',
    email: data.email
  };
}

export type AuthProvider = {
  login: (data: LoginInput) => Promise<LoginResponse>;
  register: (data: RegisterInput) => Promise<RegisterResponse>;
};

function createMockProvider(): AuthProvider {
  return {
    login(data) {
      return Promise.resolve({ user: buildMockUser({ email: data.email }) });
    },
    register(data) {
      return Promise.resolve({ user: buildMockUser({ name: data.name, email: data.email }) });
    }
  };
}

function createApiProvider(): AuthProvider {
  return {
    login(data) {
      return http
        .request<BackendUsuario>('/login', {
          method: 'POST',
          body: JSON.stringify({
            correo: data.email,
            contrasena: data.password
          })
        })
        .then((usuario) => ({ user: toAuthUser(usuario) }));
    },
    register(data) {
      return http
        .request<BackendUsuario>('/registrar', {
          method: 'POST',
          body: JSON.stringify({
            nombreCompleto: data.name,
            correo: data.email,
            contrasena: data.password
          })
        })
        .then((usuario) => ({ user: toAuthUser(usuario) }));
    }
  };
}

export function createAuthProvider(frontOnlyMode: boolean): AuthProvider {
  return frontOnlyMode ? createMockProvider() : createApiProvider();
}
