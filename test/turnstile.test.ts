import { afterEach, describe, expect, it, vi } from "vitest";
import { verifyTurnstile } from "../src/lib/server/turnstile";

const TOKEN = "secret-token-value";
const SECRET = "secret-key-value";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("verifyTurnstile", () => {
  it("returns true on success without logging", async () => {
    vi.stubGlobal("fetch", async () => Response.json({ success: true }));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(await verifyTurnstile(SECRET, TOKEN, "1.2.3.4")).toBe(true);
    expect(warn).not.toHaveBeenCalled();
  });

  it("logs error codes but not token, secret or ip on failure", async () => {
    vi.stubGlobal("fetch", async () =>
      Response.json({ success: false, "error-codes": ["timeout-or-duplicate"], hostname: "tomu.foo" }),
    );
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(await verifyTurnstile(SECRET, TOKEN, "1.2.3.4")).toBe(false);
    expect(warn).toHaveBeenCalledOnce();
    const line = String(warn.mock.calls[0][0]);
    expect(JSON.parse(line)).toEqual({
      event: "turnstile_failed",
      errorCodes: ["timeout-or-duplicate"],
      hostname: "tomu.foo",
      action: null,
      status: 200,
    });
    for (const s of [TOKEN, SECRET, "1.2.3.4"]) expect(line).not.toContain(s);
  });

  it("logs the error name when fetch throws", async () => {
    vi.stubGlobal("fetch", async () => {
      throw new DOMException("timed out", "TimeoutError");
    });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(await verifyTurnstile(SECRET, TOKEN, null)).toBe(false);
    expect(JSON.parse(String(warn.mock.calls[0][0]))).toEqual({
      event: "turnstile_error",
      name: "TimeoutError",
    });
  });
});
