import { describe, expect, it } from "vitest";
import { CONFIRM_TTL_S, signToken, verifyToken } from "../src/lib/server/tokens";

const T = 1_800_000_000_000;
const S = "test-secret-test-secret-test-secret";
const TTL_MS = CONFIRM_TTL_S * 1000;

describe("tokens", () => {
  it("roundtrips a confirm token", async () => {
    const tok = await signToken(S, "abc", "confirm", T);
    expect(await verifyToken(S, tok, "confirm", T + 1000)).toBe("abc");
  });

  it("expires confirm tokens after 48h", async () => {
    const tok = await signToken(S, "abc", "confirm", T);
    expect(await verifyToken(S, tok, "confirm", T + TTL_MS + 1000)).toBeNull();
    expect(await verifyToken(S, tok, "confirm", T + TTL_MS - 1000)).toBe("abc");
  });

  it("unsubscribe tokens do not expire", async () => {
    const tok = await signToken(S, "abc", "unsubscribe", T);
    expect(await verifyToken(S, tok, "unsubscribe", T + 10 * 365 * 86_400_000)).toBe("abc");
  });

  it("rejects wrong purpose both ways", async () => {
    const c = await signToken(S, "abc", "confirm", T);
    const u = await signToken(S, "abc", "unsubscribe", T);
    expect(await verifyToken(S, c, "unsubscribe", T)).toBeNull();
    expect(await verifyToken(S, u, "confirm", T)).toBeNull();
  });

  it("rejects wrong secret, tampering and garbage", async () => {
    const tok = await signToken(S, "abc", "confirm", T);
    expect(await verifyToken("other-secret-other-secret-other-secret", tok, "confirm", T)).toBeNull();
    const i = tok.length - 3;
    const tampered = tok.slice(0, i) + (tok[i] === "A" ? "B" : "A") + tok.slice(i + 1);
    expect(await verifyToken(S, tampered, "confirm", T)).toBeNull();
    expect(await verifyToken(S, "kein.jwt", "confirm", T)).toBeNull();
    expect(await verifyToken(S, "", "confirm", T)).toBeNull();
  });

  it("payload holds no email", async () => {
    const tok = await signToken(S, "abc", "confirm", T);
    const payload = atob(tok.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"));
    expect(payload).not.toContain("@");
  });
});
