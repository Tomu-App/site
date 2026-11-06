import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getDb } from "../src/lib/server/db/index";
import { subscribers } from "../src/lib/server/db/schema";
import { confirmLink, inspectLink, unsubscribeLink } from "../src/lib/server/link-actions";
import { signToken } from "../src/lib/server/tokens";

const T = 1_800_000_000_000;
const SECRET = "test-secret-test-secret-test-secret";
const db = getDb(env.DB);
const ID = "11111111-1111-1111-1111-111111111111";

const status = async () => (await db.select().from(subscribers).where(eq(subscribers.id, ID)))[0]?.status;

beforeEach(async () => {
  await env.DB.prepare("delete from subscribers").run();
  await db.insert(subscribers).values({
    id: ID,
    email: "oma@example.de",
    status: "pending",
    consentVersion: "x",
    createdAt: T,
    mailWindowStart: T,
    mailWindowCount: 1,
  });
});

describe("inspectLink", () => {
  it("valid token -> valid, row stays pending", async () => {
    const tok = await signToken(SECRET, ID, "confirm", T);
    expect(await inspectLink(SECRET, tok, "confirm", T)).toEqual({ valid: true });
    expect(await status()).toBe("pending");
  });
  it("null / wrong purpose -> invalid", async () => {
    expect(await inspectLink(SECRET, null, "confirm", T)).toEqual({ valid: false });
    const tok = await signToken(SECRET, ID, "unsubscribe", T);
    expect(await inspectLink(SECRET, tok, "confirm", T)).toEqual({ valid: false });
  });
});

describe("confirmLink", () => {
  it("confirms", async () => {
    const tok = await signToken(SECRET, ID, "confirm", T);
    expect(await confirmLink(db, SECRET, tok, T)).toBe("confirmed");
    expect(await status()).toBe("confirmed");
  });
  it("expired -> invalid", async () => {
    const tok = await signToken(SECRET, ID, "confirm", T);
    expect(await confirmLink(db, SECRET, tok, T + 49 * 3600_000)).toBe("invalid");
    expect(await status()).toBe("pending");
  });
  it("unsubscribe token -> invalid", async () => {
    const tok = await signToken(SECRET, ID, "unsubscribe", T);
    expect(await confirmLink(db, SECRET, tok, T)).toBe("invalid");
  });
  it("null -> invalid", async () => {
    expect(await confirmLink(db, SECRET, null, T)).toBe("invalid");
  });
  it("row deleted -> invalid", async () => {
    const tok = await signToken(SECRET, ID, "confirm", T);
    await env.DB.prepare("delete from subscribers").run();
    expect(await confirmLink(db, SECRET, tok, T)).toBe("invalid");
  });
});

describe("unsubscribeLink", () => {
  it("deletes row, idempotent", async () => {
    const tok = await signToken(SECRET, ID, "unsubscribe", T);
    expect(await unsubscribeLink(db, SECRET, tok, T)).toBe("unsubscribed");
    expect(await status()).toBeUndefined();
    expect(await unsubscribeLink(db, SECRET, tok, T)).toBe("unsubscribed");
  });
  it("tampered -> invalid", async () => {
    const tok = await signToken(SECRET, ID, "unsubscribe", T);
    expect(await unsubscribeLink(db, SECRET, tok.slice(0, -2) + "xx", T)).toBe("invalid");
    expect(await status()).toBe("pending");
  });
  it("null -> invalid", async () => {
    expect(await unsubscribeLink(db, SECRET, null, T)).toBe("invalid");
  });
});

describe("db failures", () => {
  const failing = new Proxy(
    {},
    {
      get() {
        throw Object.assign(new Error("params: oma@example.de"), { name: "DrizzleQueryError" });
      },
    },
  ) as unknown as typeof db;
  it("confirm and unsubscribe -> invalid, log name only", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    const c = await signToken(SECRET, ID, "confirm", T);
    const u = await signToken(SECRET, ID, "unsubscribe", T);
    expect(await confirmLink(failing, SECRET, c, T)).toBe("invalid");
    expect(await unsubscribeLink(failing, SECRET, u, T)).toBe("invalid");
    expect(JSON.stringify(err.mock.calls)).not.toContain("oma@");
    expect(err).toHaveBeenCalledWith("confirm db failed", "DrizzleQueryError");
    err.mockRestore();
  });
});
