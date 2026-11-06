export const TURNSTILE_TEST_SITE_KEY = "1x00000000000000000000AA";

/** Prod config is enforced only when the build explicitly sets REQUIRE_PROD_CONFIG=1 (production deploy job). CI, previews, dev and tests stay lenient. */
export function isRequireProdConfig(env: Record<string, string | undefined> | undefined): boolean {
  return env?.REQUIRE_PROD_CONFIG === "1";
}

export const requireProdConfig: boolean = isRequireProdConfig(
  typeof process !== "undefined" ? process.env : undefined,
);

/** Returns the site key, the always-passing test key when empty, or throws when prod config is required. */
export function resolveSiteKey(value: string | undefined, require: boolean): string {
  if (value) return value;
  if (require) {
    throw new Error(
      "TURNSTILE_SITE_KEY must be set when REQUIRE_PROD_CONFIG=1 (repo variable TURNSTILE_SITE_KEY in the deploy workflow).",
    );
  }
  return TURNSTILE_TEST_SITE_KEY;
}
