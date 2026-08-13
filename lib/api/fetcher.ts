/**
 * The single HTTP entry point for every generated API hook.
 *
 * orval routes all generated operations through this function (configured as
 * the `mutator` in orval.config.ts), so base URL resolution, authentication and
 * error handling are defined once here instead of being repeated per call site.
 *
 * This replaces the pattern in the hand-written lib/api/*.ts files, where each
 * function rebuilt the URL and headers itself and roughly half of them never
 * checked `res.ok` — so a failed request resolved as though it had succeeded.
 *
 * Contract (set by orval's `httpClient: "fetch"` mode):
 *   - called as apiFetch<T>(url, init); orval supplies method, headers and body
 *   - resolves with a { data, status, headers } envelope
 *   - rejects on non-2xx, so TanStack Query's error states work as usual
 *
 * Because it rejects on failure, the envelope's `data` is always the success
 * payload in practice. The thin wrappers in lib/api/ unwrap it so components
 * keep receiving plain values.
 */

const AUTH_TOKEN_KEY = "auth_token";

/** Thrown for any non-2xx response, carrying the status and parsed body. */
export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function baseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not set. Copy .env.example to .env.local.",
    );
  }
  return url.replace(/\/$/, "");
}

/**
 * The backend expects the raw JWT in the Authorization header with no "Bearer "
 * prefix — its security scheme is an apiKey in a header, not HTTP bearer auth.
 */
function authHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
  return token ? { Authorization: token } : {};
}

export const apiFetch = async <T>(
  url: string,
  init: RequestInit = {},
): Promise<T> => {
  const response = await fetch(`${baseUrl()}${url}`, {
    ...init,
    headers: {
      ...authHeader(),
      ...(init.headers as Record<string, string> | undefined),
    },
  });

  // 204 responses (and any empty body) have nothing to parse. The backend
  // returns these from most updates and deletes.
  const raw = await response.text();
  const data: unknown = raw ? safeParse(raw) : undefined;

  if (!response.ok) {
    throw new ApiError(response.status, errorMessage(data, response), data);
  }

  return {
    data,
    status: response.status,
    headers: response.headers,
  } as T;
};

function safeParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

/** The backend's error shape is `{ "error": "message" }` for every non-2xx. */
function errorMessage(body: unknown, response: Response): string {
  if (body && typeof body === "object" && "error" in body) {
    const { error } = body as { error?: unknown };
    if (typeof error === "string" && error) return error;
  }
  return `${response.status} ${response.statusText}`;
}

export default apiFetch;
