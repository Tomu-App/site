import { describe, expect, it } from "vitest";
import { withSecurityHeaders } from "../src/lib/server/security-headers";

describe("withSecurityHeaders", () => {
  it("adds all three headers", () => {
    const r = withSecurityHeaders(new Response("x"));
    expect(r.headers.get("Referrer-Policy")).toBe("strict-origin");
    expect(r.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(r.headers.get("Content-Security-Policy")).toBe("frame-ancestors 'none'");
  });
  it("sets no-store but keeps an existing Cache-Control", () => {
    expect(withSecurityHeaders(new Response("x")).headers.get("Cache-Control")).toBe("no-store");
    const r = withSecurityHeaders(new Response("x", { headers: { "Cache-Control": "max-age=60" } }));
    expect(r.headers.get("Cache-Control")).toBe("max-age=60");
  });
  it("keeps an existing CSP", () => {
    const r = withSecurityHeaders(
      new Response("x", { headers: { "Content-Security-Policy": "default-src 'self'" } }),
    );
    expect(r.headers.get("Content-Security-Policy")).toBe("default-src 'self'");
  });
  it("works on immutable fetch responses and keeps body/status", async () => {
    const immutable = Response.redirect("https://example.com/", 302);
    const r = withSecurityHeaders(immutable);
    expect(r.status).toBe(302);
    expect(r.headers.get("Location")).toBe("https://example.com/");
    expect(r.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(await withSecurityHeaders(new Response("body")).text()).toBe("body");
  });
});
