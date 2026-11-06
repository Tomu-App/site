import sveltekit from "sveltekit-worker";
import { runScheduled } from "./lib/server/scheduled";

export default {
  fetch: sveltekit.fetch,
  scheduled(controller, env, ctx) {
    ctx.waitUntil(runScheduled(env, controller.scheduledTime));
  },
} satisfies ExportedHandler<Env>;
