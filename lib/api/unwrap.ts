import { ApiError } from "./fetcher";

/**
 * Pulls the payload out of a generated client response.
 *
 * orval's fetch client resolves with a `{ data, status, headers }` envelope
 * whose `data` is a union over every documented status — `Habitat[] |
 * ErrorResponse`, for instance. The error arm is unreachable in practice
 * because `apiFetch` throws on any non-2xx, but TypeScript cannot know that, so
 * without narrowing every caller would have to handle a branch that never runs.
 *
 * Narrowing on `status` here keeps that noise in one place and lets the hooks in
 * this directory hand components plain values, exactly as the hand-written
 * fetch functions did.
 */
export function unwrap<T>(response: { status: number; data: unknown }): T {
  if (response.status < 200 || response.status >= 300) {
    // Not reachable through apiFetch, which throws first. Kept so a future
    // caller that bypasses it still fails loudly rather than returning an error
    // body typed as success data.
    throw new ApiError(
      response.status,
      `expected a success response, got ${response.status}`,
      response.data,
    );
  }

  return response.data as T;
}
