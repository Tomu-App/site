/**
 * Adds baseline security headers to a response rendered by the Worker.
 * `_headers` only covers static assets, so token-in-URL pages (/bestaetigen, /abmelden)
 * and /api/* need this. An existing Content-Security-Policy (e.g. from SvelteKit's `csp`
 * config) is never overwritten; it must include `frame-ancestors 'none'` itself.
 */
export function withSecurityHeaders(response: Response): Response {
  // Responses from fetch() have immutable headers; copy so set() cannot throw.
  const res = new Response(response.body, response);
  // strict-origin keeps tokens (path/query) out of Referer while still sending Origin,
  // which SvelteKit's CSRF check needs for form POSTs (no-referrer yields Origin: null).
  res.headers.set("Referrer-Policy", "strict-origin");
  res.headers.set("X-Content-Type-Options", "nosniff");
  // Dynamic responses (token pages, /api) must never be cached; keep any explicit Cache-Control.
  if (!res.headers.has("Cache-Control")) res.headers.set("Cache-Control", "no-store");
  if (!res.headers.has("Content-Security-Policy")) {
    res.headers.set("Content-Security-Policy", "frame-ancestors 'none'");
  }
  return res;
}
