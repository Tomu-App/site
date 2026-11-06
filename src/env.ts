import { defineEnvVars } from "@sveltejs/kit/env";
import { requireProdConfig, resolveSiteKey } from "./lib/build-mode";

export const variables = defineEnvVars({
  TURNSTILE_SITE_KEY: {
    public: true,
    static: true,
    description:
      "Cloudflare Turnstile site key (public). Required when the build sets REQUIRE_PROD_CONFIG=1 (production deploy); elsewhere defaults to the always-passing test key.",
    schema: (value) => resolveSiteKey(value, requireProdConfig),
  },
});
