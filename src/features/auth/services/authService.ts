import { api, ApiError, setAccessToken } from "../../../api/client";
import type {
  ApiUser,
  LoginResponse,
  MessageResponse,
  SessionResponse,
} from "../../../api/types";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  async login(email: string, password: string): Promise<ApiUser> {
    const data = await api<LoginResponse>("/auth/login", {
      method: "POST",
      json: { email, password },
    });

    // El superadmin recibe mfaToken en vez de sesión: este front no maneja ese flujo.
    if (!data.accessToken || !data.user) {
      throw new ApiError(
        403,
        "MFA_NOT_SUPPORTED",
        "Las cuentas de administrador no pueden iniciar sesión desde esta aplicación."
      );
    }

    setAccessToken(data.accessToken);
    return data.user;
  },

  async refresh(): Promise<ApiUser> {
    const data = await api<SessionResponse>(
      "/auth/refresh",
      {
        method: "POST",
      }
    );

    setAccessToken(data.accessToken);

    return data.user;
  },

  register(data: RegisterRequest
  ): Promise<MessageResponse> {
    return api<MessageResponse>("/auth/register",
      {
        method: "POST",
        json: {...data, acceptTerms: true,},
      }
    );
  },

  verifyEmail(token: string
  ): Promise<MessageResponse> {
    return api<MessageResponse>("/auth/verify-email",
      {
        method: "POST",
        json: { token },
      }
    );
  },

  resendVerification(email: string
  ): Promise<MessageResponse> {
    return api<MessageResponse>("/auth/resend-verification",
      {
        method: "POST",
        json: { email },
      }
    );
  },

  forgotPassword(email: string
  ): Promise<MessageResponse> {
    return api<MessageResponse>("/auth/forgot-password",
      {
        method: "POST",
        json: { email },
      }
    );
  },

  resetPassword(token: string, newPassword: string
  ): Promise<MessageResponse> {
    return api<MessageResponse>("/auth/reset-password",
      {
        method: "POST",
        json: {token, newPassword,
        },
      }
    );
  },

  me(): Promise<ApiUser> {
    return api<ApiUser>("/users/me"
    );
  },

  async logout(): Promise<void> {
    try {
      await api<void>(
        "/auth/logout",
        {
          method: "POST",
        }
      );
    } finally {
      setAccessToken(null);
    }
  },
};
