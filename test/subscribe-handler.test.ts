import { env } from "cloudflare:workers";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getDb } from "../src/lib/server/db/index";
import { subscribers } from "../src/lib/server/db/schema";
import type { ConfirmationMail } from "../src/lib/server/mail";
import { handleSubscribe, type SubscribeDeps } from "../src/lib/server/subscribe-handler";
import { confirmSubscription } from "../src/lib/server/subscriptions";
import { verifyToken } from "../src/lib/server/tokens";

const T = 1_800_000_000_000;
const EMAIL = "oma@example.de";
const db = getDb(env.DB);
const good = { email: EMAIL, consent: true, turnstileToken: "tok" };

let sent: ConfirmationMail[];
const make = (over: Partial<SubscribeDeps> = {}): SubscribeDeps => ({
  db,
  now: T,
  jwtSecret: env.JWT_SECRET,
  baseUrl: "https://tomu.foo",
  mailFrom: "hallo@tomu.foo",
  verifyCaptcha: async () => true,
  allow: async () => true,
  send: async (m) => {
    sent.push(m);
  },
  ...over,
});

beforeEach(async () => {
  sent = [];
  await env.DB.prepare("delete from subscribers").run();
});
afterEach(() => vi.restoreAllMocks());

describe("handleSubscribe", () => {
  it("rejects missing token or consent", async () => {
    for (const body of [
      { email: EMAIL, consent: true },
      { email: EMAIL, turnstileToken: "t" },
      { email: EMAIL, consent: false, turnstileToken: "t" },
      { email: EMAIL, consent: true, turnstileToken: "" },
      null,
      "x",
    ]) {
      expect(await handleSubscribe(make(), body)).toEqual({ status: 400, body: { error: "invalid" } });
    }
    expect(sent).toHaveLength(0);
  });
  it("rejects failed captcha", async () => {
    const r = await handleSubscribe(make({ verifyCaptcha: async () => false }), good);
    expect(r).toEqual({ status: 400, body: { error: "captcha" } });
    expect(sent).toHaveLength(0);
  });
  it("rejects when rate limited", async () => {
    const r = await handleSubscribe(make({ allow: async () => false }), good);
    expect(r).toEqual({ status: 429, body: { error: "rate_limited" } });
    expect(sent).toHaveLength(0);
  });
  it("rejects invalid address", async () => {
    const r = await handleSubscribe(make(), { ...good, email: "kein-at" });
    expect(r).toEqual({ status: 400, body: { error: "invalid" } });
    expect(sent).toHaveLength(0);
  });
  it("sends mail with valid tokens for a new address", async () => {
    const r = await handleSubscribe(make(), { ...good, email: "  Oma@Example.DE " });
    expect(r).toEqual({ status: 200, body: { ok: true } });
    expect(sent).toHaveLength(1);
    const [row] = await db.select().from(subscribers);
    const m = sent[0];
    expect(m.to).toBe(EMAIL);
    const c = m.text.match(/https:\/\/tomu\.foo\/bestaetigen\?token=([^\s"]+)/)![1];
    const u = m.text.match(/https:\/\/tomu\.foo\/abmelden\?token=([^\s"]+)/)![1];
    expect(await verifyToken(env.JWT_SECRET, c, "confirm", T)).toBe(row.id);
    expect(await verifyToken(env.JWT_SECRET, u, "unsubscribe", T)).toBe(row.id);
  });
  it("answers identically for confirmed address without sending", async () => {
    const fresh = await handleSubscribe(make(), good);
    const [row] = await db.select().from(subscribers);
    await confirmSubscription(db, row.id, T);
    sent = [];
    const again = await handleSubscribe(make({ now: T + 10 }), good);
    expect(again).toEqual(fresh);
    expect(sent).toHaveLength(0);
  });
  it("sends at most twice for three requests in an hour", async () => {
    for (let i = 0; i < 3; i++) {
      expect(await handleSubscribe(make({ now: T + i * 1000 }), good)).toEqual({
        status: 200,
        body: { ok: true },
      });
    }
    expect(sent).toHaveLength(2);
  });
  it("still answers 200 and logs no address when send throws", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const r = await handleSubscribe(
      make({
        send: async () => {
          throw Object.assign(new Error(`bounce for ${EMAIL}`), { code: "E_SENDER_NOT_VERIFIED" });
        },
      }),
      good,
    );
    expect(r).toEqual({ status: 200, body: { ok: true } });
    expect(err).toHaveBeenCalledWith("confirmation mail failed", "E_SENDER_NOT_VERIFIED");
    for (const spy of [err, log]) expect(JSON.stringify(spy.mock.calls)).not.toContain("oma@");
  });
});
