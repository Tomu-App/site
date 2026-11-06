import { getDb } from "./db/index";
import { cleanupPending } from "./subscriptions";

/** Daily cron: delete unconfirmed subscriptions past their TTL. Returns the number of rows deleted. */
export async function runScheduled(env: { DB: D1Database }, now: number): Promise<number> {
  const deleted = await cleanupPending(getDb(env.DB), now);
  console.log(JSON.stringify({ event: "cleanup_pending", deleted }));
  return deleted;
}
