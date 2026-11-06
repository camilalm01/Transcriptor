import type { SessionResponse } from "./types";

export const API_URL = import.meta.env.VITE_API_URL as string;
const BASE = `${API_URL}/api/v1`;

/* ------------------------------------------------------------------ */
/* Errores                                                            */
/* ------------------------------------------------------------------ */

export class ApiError extends Error {
  status: number;
  code: string;
  details: unknown[];

  constructor(
    status: number,
    code: string,
    message: string,
    details: unknown[] = []
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface ErrorBody {
  code?: string;
  message?: string;
  details?: unknown[];
}

async function toApiError(res: Response): Promise<ApiError> {
  let body: ErrorBody = {};

  try {
    body = (await res.json()) as ErrorBody;
  } catch {
    // Respuesta sin JSON
  }

  return new ApiError(
    res.status,
    body.code ?? "UNKNOWN",
    body.message ?? "Ocurrió un error inesperado.",
    body.details ?? []
  );
}

/* ------------------------------------------------------------------ */
/* Token de acceso (solo memoria)                                     */
/* ------------------------------------------------------------------ */

let accessToken: string | null = null;

export const getAccessToken = (): string | null => accessToken;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

let onSessionExpired: (() => void) | null = null;

/**
 * Permite al AuthProvider limpiar el estado global
 * cuando el refresh token deja de ser válido.
 */
export const setSessionExpiredHandler = (
  handler: (() => void) | null
): void => {
  onSessionExpired = handler;
};

/* ------------------------------------------------------------------ */
/* Refresh de sesión                                                  */
/* ------------------------------------------------------------------ */

let refreshing: Promise<SessionResponse> | null = null;

export function refreshSession(): Promise<SessionResponse> {
  refreshing ??= (async () => {
    let res: Response;

    try {
      res = await fetch(`${BASE}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      throw new ApiError(
        0,
        "NETWORK_ERROR",
        "No se pudo conectar con el servidor."
      );
    }

    if (!res.ok) {
      setAccessToken(null);
      throw await toApiError(res);
    }

    const data = (await res.json()) as SessionResponse;

    setAccessToken(data.accessToken);

    return data;
  })().finally(() => {
    refreshing = null;
  });

  return refreshing;
}

/* ------------------------------------------------------------------ */
/* Configuración API                                                  */
/* ------------------------------------------------------------------ */

export interface ApiOptions extends Omit<RequestInit, "body"> {
  json?: unknown;
  body?: BodyInit | null;
}

const PUBLIC_AUTH_ROUTES = new Set([
  "/auth/login",
  "/auth/login/mfa",
  "/auth/register",
  "/auth/refresh",
  "/auth/verify-email",
  "/auth/resend-verification",
  "/auth/forgot-password",
  "/auth/reset-password",
]);

/* ------------------------------------------------------------------ */
/* Response cruda                                                     */
/* ------------------------------------------------------------------ */

export async function apiFetch(
  path: string,
  options: ApiOptions = {},
  canRetry = true
): Promise<Response> {
  const {
    json,
    body,
    headers: customHeaders,
    ...rest
  } = options;

  const headers = new Headers(customHeaders);

  if (json !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let res: Response;

  try {
    res = await fetch(`${BASE}${path}`, {
      ...rest,
      headers,
      credentials: "include",
      body:
        json !== undefined
          ? JSON.stringify(json)
          : body,
    });
  } catch {
    throw new ApiError(
      0,
      "NETWORK_ERROR",
      "No se pudo conectar con el servidor."
    );
  }

  if (
    res.status === 401 &&
    canRetry &&
    !PUBLIC_AUTH_ROUTES.has(path)
  ) {
    try {
      await refreshSession();
    } catch {
      onSessionExpired?.();

      throw new ApiError(
        401,
        "SESSION_EXPIRED",
        "Tu sesión expiró. Inicia sesión nuevamente."
      );
    }

    return apiFetch(path, options, false);
  }

  if (!res.ok) {
    throw await toApiError(res);
  }

  return res;
}

/* ------------------------------------------------------------------ */
/* Respuestas JSON                                                    */
/* ------------------------------------------------------------------ */

export async function api<T>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const res = await apiFetch(path, options);

  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}