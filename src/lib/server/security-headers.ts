/**
 * Adds baseline security headers to a response rendered by the Worker.
 * `_headers` only covers static assets, so token-in-URL pages (/bestaetigen, /abmelden)
 * and /api/* need this. An existing Content-Security-Policy (e.g. from SvelteKit's `csp`
 * config) is never overwritten; it must include `frame-ancestors 'none'` itself.
 */
export function withSecurityHeaders(response: Response): Response {
  // Responses from fetch() have immutable headers; copy so set() cannot throw.
  const res = new Response(response.body, response);
  res.headers.set("Referrer-Policy", "no-referrer");
  res.headers.set("X-Content-Type-Options", "nosniff");
  if (!res.headers.has("Content-Security-Policy")) {
    res.headers.set("Content-Security-Policy", "frame-ancestors 'none'");
  }
  return res;
}
