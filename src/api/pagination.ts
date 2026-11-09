import { api } from "./client";

export interface Page<T> {
  items: T[];
  nextCursor: string | null;
}

type QueryValue = string | number | boolean | null | undefined;

/** Arma "?a=1&b=2" omitiendo los valores vacíos. */
export function buildQuery(params: Record<string, QueryValue>): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    qs.set(key, String(value));
  }
  const text = qs.toString();
  return text ? `?${text}` : "";
}

/** Recorre la paginación por cursor (hasta 100 por página) y junta todo en una lista. */
export async function fetchAllPages<T>(
  path: string,
  params: Record<string, QueryValue> = {},
  maxPages = 10
): Promise<T[]> {
  const all: T[] = [];
  let cursor: string | null = null;

  for (let i = 0; i < maxPages; i++) {
    const page: Page<T> = await api<Page<T>>(
      `${path}${buildQuery({ ...params, limit: 100, cursor })}`
    );
    all.push(...page.items);
    if (!page.nextCursor) break;
    cursor = page.nextCursor;
  }

  return all;
}
