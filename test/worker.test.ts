import { env } from "cloudflare:workers";
import { beforeEach, describe, expect, it } from "vitest";
import { getDb } from "../src/lib/server/db/index";
import { subscribers } from "../src/lib/server/db/schema";
import { runScheduled } from "../src/lib/server/scheduled";
import { CONSENT_VERSION } from "../src/lib/server/subscriptions";

const T = 1_800_000_000_000;
const DAY = 86_400_000;
const db = getDb(env.DB);

beforeEach(async () => {
  await env.DB.prepare("delete from subscribers").run();
});

describe("runScheduled", () => {
  it("deletes 8-day-old pending rows and keeps 1-day-old ones", async () => {
    const ins = (id: string, createdAt: number) =>
      db.insert(subscribers).values({
        id,
        email: `${id}@example.de`,
        status: "pending",
        consentVersion: CONSENT_VERSION,
        createdAt,
        mailWindowCount: 1,
      });
    await ins("old", T - 8 * DAY);
    await ins("fresh", T - 1 * DAY);
    expect(await runScheduled(env, T)).toBe(1);
    expect((await db.select().from(subscribers)).map((r) => r.id)).toEqual(["fresh"]);
  });
});
