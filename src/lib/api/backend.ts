import "server-only";

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown) {
    super(`API Error ${status}`);
    this.status = status;
    this.body = body;
  }
}

export async function backendFetchJSON<T>(
  path: string,
  opts: { token?: string; method?: string; body?: unknown; cache?: RequestCache } = {},
): Promise<T> {
  const base = process.env.API_BASE_URL;
  if (!base) throw new Error("Missing env var: API_BASE_URL");

  const res = await fetch(`${base}${path}`, {
    method: opts.method ?? "GET",
    headers: {
      ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
      "Content-Type": "application/json",
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    cache: opts.cache ?? "no-store",
  });

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) throw new ApiError(res.status, data);
  return data as T;
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
