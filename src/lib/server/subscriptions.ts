import { and, eq, lt } from "drizzle-orm";
import type { Db } from "./db/index";
import { subscribers } from "./db/schema";

export const CONSENT_VERSION = "2026-11-06";
export const MAIL_WINDOW_MS = 3_600_000;
export const MAX_MAILS_PER_WINDOW = 2;
export const PENDING_TTL_MS = 7 * 86_400_000;

export type SubscribeResult = { action: "send"; id: string; email: string } | { action: "none" };

export function normalizeEmail(raw: string): string | null {
  const email = raw.trim().toLowerCase();
  if (email.length > 254) return null;
  if (!/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email)) return null;
  return email;
}

export async function requestSubscription(db: Db, email: string, now: number): Promise<SubscribeResult> {
  const [row] = await db.select().from(subscribers).where(eq(subscribers.email, email));

  if (!row) {
    const id = crypto.randomUUID();
    await db
      .insert(subscribers)
      .values({
        id,
        email,
        status: "pending",
        consentVersion: CONSENT_VERSION,
        createdAt: now,
        mailWindowStart: now,
        mailWindowCount: 1,
      })
      .onConflictDoNothing();
    // Concurrent insert may have won; use the stored row's id.
    const [stored] = await db.select().from(subscribers).where(eq(subscribers.email, email));
    return { action: "send", id: stored.id, email };
  }

  if (row.status === "confirmed") return { action: "none" };

  const windowExpired = row.mailWindowStart == null || now - row.mailWindowStart >= MAIL_WINDOW_MS;
  if (windowExpired) {
    await db
      .update(subscribers)
      .set({ mailWindowStart: now, mailWindowCount: 1 })
      .where(eq(subscribers.id, row.id));
    return { action: "send", id: row.id, email };
  }
  if (row.mailWindowCount < MAX_MAILS_PER_WINDOW) {
    await db
      .update(subscribers)
      .set({ mailWindowCount: row.mailWindowCount + 1 })
      .where(eq(subscribers.id, row.id));
    return { action: "send", id: row.id, email };
  }
  return { action: "none" };
}

export async function confirmSubscription(db: Db, id: string, now: number): Promise<boolean> {
  const [row] = await db.select().from(subscribers).where(eq(subscribers.id, id));
  if (!row) return false;
  if (row.status !== "confirmed") {
    await db.update(subscribers).set({ status: "confirmed", confirmedAt: now }).where(eq(subscribers.id, id));
  }
  return true;
}

export async function unsubscribe(db: Db, id: string): Promise<void> {
  await db.delete(subscribers).where(eq(subscribers.id, id));
}

export async function cleanupPending(db: Db, now: number): Promise<number> {
  const deleted = await db
    .delete(subscribers)
    .where(and(eq(subscribers.status, "pending"), lt(subscribers.createdAt, now - PENDING_TTL_MS)))
    .returning({ id: subscribers.id });
  return deleted.length;
}
