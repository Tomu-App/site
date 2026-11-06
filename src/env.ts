import { defineEnvVars } from "@sveltejs/kit/env";
import { isProdNonCiBuild } from "./lib/build-mode";

export const variables = defineEnvVars({
  TURNSTILE_SITE_KEY: {
    public: true,
    static: true,
    description:
      "Cloudflare Turnstile site key (public). Required for production builds outside CI; elsewhere defaults to the always-passing test key.",
    schema: (value) => {
      if (value) return value;
      if (isProdNonCiBuild) {
        throw new Error(
          "TURNSTILE_SITE_KEY must be set for production builds (build variable in Workers Builds).",
        );
      }
      return "1x00000000000000000000AA";
    },
  },
});
