import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";

describe("wrangler configs", () => {
  it("assets match in wrangler.jsonc and wrangler.sveltekit.jsonc", () => {
    const a = JSON.parse(env.WRANGLER_ASSETS);
    expect(a).toBeTruthy();
    expect(JSON.parse(env.WRANGLER_SVELTEKIT_ASSETS)).toEqual(a);
  });

  it("top-level BASE_URL is a non-empty https URL (empty would fall back to the request origin in production)", () => {
    const vars = JSON.parse(env.WRANGLER_VARS) as { BASE_URL?: string };
    expect(vars.BASE_URL).toMatch(/^https:\/\/[^/\s]+$/);
  });
});
