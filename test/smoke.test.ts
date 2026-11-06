import { env } from "cloudflare:workers";
import { expect, it } from "vitest";

it("has a D1 binding", async () => {
  const row = await env.DB.prepare("select 1 as one").first<{ one: number }>();
  expect(row?.one).toBe(1);
});
