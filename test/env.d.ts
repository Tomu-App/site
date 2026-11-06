/// <reference types="@cloudflare/vitest-plugin/types" />
import type { D1Migration } from "@cloudflare/vitest-plugin";

declare global {
  namespace Cloudflare {
    interface Env {
      TEST_MIGRATIONS: D1Migration[];
      JWT_SECRET: string;
      WRANGLER_ASSETS: string;
      WRANGLER_SVELTEKIT_ASSETS: string;
    }
  }
}
