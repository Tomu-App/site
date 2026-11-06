import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import { getDb } from "../src/lib/server/db/index";
import { subscribers } from "../src/lib/server/db/schema";
import {
  CONSENT_VERSION,
  MAIL_WINDOW_MS,
  PENDING_TTL_MS,
  cleanupPending,
  confirmSubscription,
  normalizeEmail,
  requestSubscription,
  unsubscribe,
} from "../src/lib/server/subscriptions";

const T = 1_800_000_000_000;
const db = getDb(env.DB);
const EMAIL = "oma@example.de";

const rows = () => db.select().from(subscribers);

beforeEach(async () => {
  await env.DB.prepare("delete from subscribers").run();
});

describe("normalizeEmail", () => {
  it("trims and lowercases", () => {
    expect(normalizeEmail("  Oma@Example.DE ")).toBe("oma@example.de");
  });
  it("rejects invalid input", () => {
    expect(normalizeEmail("kein-at")).toBeNull();
    expect(normalizeEmail("a@b")).toBeNull();
    expect(normalizeEmail("a".repeat(244) + "@example.de")).toBeNull(); // 255 chars
  });
  it("accepts 254 chars", () => {
    const e = "a".repeat(243) + "@example.de";
    expect(e.length).toBe(254);
    expect(normalizeEmail(e)).toBe(e);
  });
});

describe("requestSubscription", () => {
  it("creates a pending row for a new address", async () => {
    const r = await requestSubscription(db, EMAIL, T);
    expect(r.action).toBe("send");
    const all = await rows();
    expect(all).toHaveLength(1);
    expect(all[0]).toMatchObject({
      email: EMAIL,
      status: "pending",
      consentVersion: CONSENT_VERSION,
      createdAt: T,
      mailWindowCount: 1,
    });
    if (r.action === "send") {
      expect(r.id).toBe(all[0].id);
      expect(r.email).toBe(EMAIL);
    }
  });

  it("reuses the id and keeps one row", async () => {
    const a = await requestSubscription(db, EMAIL, T);
    const b = await requestSubscription(db, EMAIL, T + 1);
    expect(a.action === "send" && b.action === "send" && a.id === b.id).toBe(true);
    expect(await rows()).toHaveLength(1);
  });

  it("throttles pending to 2 mails per window", async () => {
    const acts = [];
    for (const dt of [0, 1000, 2000]) {
      acts.push((await requestSubscription(db, EMAIL, T + dt)).action);
    }
    expect(acts).toEqual(["send", "send", "none"]);
    expect((await requestSubscription(db, EMAIL, T + MAIL_WINDOW_MS)).action).toBe("send");
  });

  it("does nothing for confirmed address", async () => {
    const r = await requestSubscription(db, EMAIL, T);
    if (r.action !== "send") throw new Error("expected send");
    await confirmSubscription(db, r.id, T + 5);
    const before = await rows();
    expect(await requestSubscription(db, EMAIL, T + 10)).toEqual({ action: "none" });
    expect(await rows()).toEqual(before);
  });
});

describe("confirmSubscription", () => {
  it("confirms idempotently", async () => {
    const r = await requestSubscription(db, EMAIL, T);
    if (r.action !== "send") throw new Error("expected send");
    expect(await confirmSubscription(db, r.id, T + 100)).toBe(true);
    let [row] = await db.select().from(subscribers).where(eq(subscribers.id, r.id));
    expect(row).toMatchObject({ status: "confirmed", confirmedAt: T + 100 });
    expect(await confirmSubscription(db, r.id, T + 200)).toBe(true);
    [row] = await db.select().from(subscribers).where(eq(subscribers.id, r.id));
    expect(row.confirmedAt).toBe(T + 100);
  });
  it("returns false for unknown id", async () => {
    expect(await confirmSubscription(db, "nope", T)).toBe(false);
  });
});

describe("unsubscribe", () => {
  it("deletes row; old id does not touch new row", async () => {
    const a = await requestSubscription(db, EMAIL, T);
    if (a.action !== "send") throw new Error("expected send");
    await unsubscribe(db, a.id);
    expect(await rows()).toHaveLength(0);
    const b = await requestSubscription(db, EMAIL, T + 1);
    if (b.action !== "send") throw new Error("expected send");
    expect(b.id).not.toBe(a.id);
    await unsubscribe(db, a.id);
    expect(await rows()).toHaveLength(1);
  });
});

describe("cleanupPending", () => {
  it("deletes only old pending rows", async () => {
    const now = T + 10 * PENDING_TTL_MS;
    const ins = (id: string, status: "pending" | "confirmed", createdAt: number) =>
      db.insert(subscribers).values({
        id,
        email: `${id}@example.de`,
        status,
        consentVersion: CONSENT_VERSION,
        createdAt,
        mailWindowCount: 1,
      });
    await ins("oldpending", "pending", now - PENDING_TTL_MS - 1);
    await ins("newpending", "pending", now - PENDING_TTL_MS + 1000);
    await ins("oldconfirmed", "confirmed", now - PENDING_TTL_MS - 1);
    expect(await cleanupPending(db, now)).toBe(1);
    expect((await rows()).map((r) => r.id).sort()).toEqual(["newpending", "oldconfirmed"]);
  });
});

describe("requestSubscription concurrency", () => {
  it("never exceeds the mail cap under concurrent calls", async () => {
    await requestSubscription(db, EMAIL, T); // count = 1
    const rs = await Promise.all([1, 2, 3, 4].map(() => requestSubscription(db, EMAIL, T + 1)));
    expect(rs.filter((r) => r.action === "send")).toHaveLength(1);
    const [row] = await rows();
    expect(row.mailWindowCount).toBe(2);
  });

  it("concurrent first-time calls yield one row, one id, one send max per cap", async () => {
    const rs = await Promise.all([1, 2, 3, 4].map(() => requestSubscription(db, EMAIL, T)));
    expect(await rows()).toHaveLength(1);
    expect(rs.filter((r) => r.action === "send").length).toBeLessThanOrEqual(2);
    const ids = new Set(rs.flatMap((r) => (r.action === "send" ? [r.id] : [])));
    expect(ids.size).toBe(1);
  });

  it("lost insert race on a confirmed address sends nothing", async () => {
    const r = await requestSubscription(db, EMAIL, T);
    if (r.action !== "send") throw new Error("expected send");
    await confirmSubscription(db, r.id, T + 1);
    const rs = await Promise.all([1, 2, 3].map(() => requestSubscription(db, EMAIL, T + 2)));
    expect(rs.every((x) => x.action === "none")).toBe(true);
  });
});
