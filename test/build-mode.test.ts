import { describe, expect, it } from "vitest";
import { isRequireProdConfig, resolveSiteKey, TURNSTILE_TEST_SITE_KEY } from "../src/lib/build-mode";

describe("isRequireProdConfig", () => {
  it("is true only for REQUIRE_PROD_CONFIG=1", () => {
    expect(isRequireProdConfig({ REQUIRE_PROD_CONFIG: "1" })).toBe(true);
    expect(isRequireProdConfig({})).toBe(false);
    expect(isRequireProdConfig({ REQUIRE_PROD_CONFIG: "0" })).toBe(false);
    expect(isRequireProdConfig({ REQUIRE_PROD_CONFIG: "true" })).toBe(false);
  });

  it("ignores CI, WORKERS_CI and NODE_ENV", () => {
    expect(isRequireProdConfig({ CI: "true", WORKERS_CI: "1", NODE_ENV: "production" })).toBe(false);
    expect(isRequireProdConfig(undefined)).toBe(false);
  });
});

describe("resolveSiteKey", () => {
  it("returns the given key", () => {
    expect(resolveSiteKey("0x4AAA", true)).toBe("0x4AAA");
    expect(resolveSiteKey("0x4AAA", false)).toBe("0x4AAA");
  });
  it("throws on empty value only when prod config is required", () => {
    expect(() => resolveSiteKey("", true)).toThrow(/TURNSTILE_SITE_KEY/);
    expect(() => resolveSiteKey(undefined, true)).toThrow(/TURNSTILE_SITE_KEY/);
  });
  it("falls back to the test key without the flag", () => {
    expect(resolveSiteKey("", false)).toBe(TURNSTILE_TEST_SITE_KEY);
    expect(TURNSTILE_TEST_SITE_KEY).toBe("1x00000000000000000000AA");
  });
});
