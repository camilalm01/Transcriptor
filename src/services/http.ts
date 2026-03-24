const RAW_BASE_URL = import.meta.env.VITE_API_URL?.trim();
const DEFAULT_BASE_URL = 'http://localhost:8080';

function resolveBaseUrl() {
  if (!RAW_BASE_URL) {
    console.warn('Falta VITE_API_URL en el entorno. Usando http://localhost:8080 por defecto para desarrollo.');
    return `${DEFAULT_BASE_URL}/api/usuarios`;
  }

  const clean = RAW_BASE_URL.replace(/\/+$/, '');
  if (/\/api\/usuarios$/i.test(clean)) {
    return clean;
  }
  return `${clean}/api/usuarios`;
}

const BASE_URL = resolveBaseUrl();

export type HttpError = { status: number; message: string };

export function isHttpError(value: unknown): value is HttpError {
  return typeof value === 'object' && value !== null && 'status' in value && 'message' in value;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init.headers },
    // El backend usa @CrossOrigin("*"): enviar cookies con "include" rompe CORS.
    credentials: 'omit',
    ...init
  });

  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const raw = await res.text();
      if (raw) {
        try {
          const data = JSON.parse(raw);
          message = data?.message || raw;
        } catch {
          message = raw;
        }
      }
    } catch {
      // Mantiene mensaje por defecto
    }
    const err: HttpError = { status: res.status, message };
    throw err;
  }
  // Si no hay body (204), evita fallo
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const http = { request };