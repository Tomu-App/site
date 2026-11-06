import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";

describe("wrangler configs", () => {
  it("assets match in wrangler.jsonc and wrangler.sveltekit.jsonc", () => {
    const a = JSON.parse(env.WRANGLER_ASSETS);
    expect(a).toBeTruthy();
    expect(JSON.parse(env.WRANGLER_SVELTEKIT_ASSETS)).toEqual(a);
  });
});
