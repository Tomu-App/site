import type { Db } from "./db/index";
import { confirmSubscription, unsubscribe } from "./subscriptions";
import { verifyToken, type TokenPurpose } from "./tokens";

// Signature/expiry check only; never touches the DB (safe for GET).
export async function inspectLink(
  secret: string,
  token: string | null,
  purpose: TokenPurpose,
  now: number,
): Promise<{ valid: boolean }> {
  if (!token) return { valid: false };
  return { valid: (await verifyToken(secret, token, purpose, now)) !== null };
}

export async function confirmLink(
  db: Db,
  secret: string,
  token: string | null,
  now: number,
): Promise<"confirmed" | "invalid"> {
  if (!token) return "invalid";
  const id = await verifyToken(secret, token, "confirm", now);
  if (!id) return "invalid";
  return (await confirmSubscription(db, id, now)) ? "confirmed" : "invalid";
}

export async function unsubscribeLink(
  db: Db,
  secret: string,
  token: string | null,
  now: number,
): Promise<"unsubscribed" | "invalid"> {
  if (!token) return "invalid";
  const id = await verifyToken(secret, token, "unsubscribe", now);
  if (!id) return "invalid";
  await unsubscribe(db, id);
  return "unsubscribed";
}
