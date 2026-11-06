import sveltekit from "../.svelte-kit/cloudflare/_worker.js";
import { runScheduled } from "./lib/server/scheduled";

export default {
  fetch: sveltekit.fetch,
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(runScheduled(env, controller.scheduledTime));
  },
} satisfies ExportedHandler<Cloudflare.Env>;
