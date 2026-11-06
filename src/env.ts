import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
  TURNSTILE_SITE_KEY: {
    public: true,
    static: true,
    description: "Cloudflare Turnstile site key (public). Defaults to the always-passing test key.",
    schema: (value) => (value ? value : "1x00000000000000000000AA"),
  },
});
