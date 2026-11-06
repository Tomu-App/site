import { and, eq, lt, sql } from "drizzle-orm";
import type { Db } from "./db/index";
import { subscribers } from "./db/schema";

export const CONSENT_VERSION = "2026-11-06";
export const MAIL_WINDOW_MS = 3_600_000;
export const MAX_MAILS_PER_WINDOW = 2;
export const PENDING_TTL_MS = 7 * 86_400_000;

export type MailLocale = "de" | "en";

export type SubscribeResult = { action: "send"; id: string; email: string } | { action: "none" };

export function normalizeEmail(raw: string): string | null {
  const email = raw.trim().toLowerCase();
  if (email.length > 254) return null;
  if (!/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email)) return null;
  return email;
}

export async function requestSubscription(
  db: Db,
  email: string,
  now: number,
  locale: MailLocale,
): Promise<SubscribeResult> {
  const inserted = await db
    .insert(subscribers)
    .values({
      id: crypto.randomUUID(),
      email,
      status: "pending",
      locale,
      consentVersion: CONSENT_VERSION,
      createdAt: now,
      mailWindowStart: now,
      mailWindowCount: 1,
    })
    .onConflictDoNothing()
    .returning({ id: subscribers.id });
  if (inserted.length > 0) return { action: "send", id: inserted[0].id, email };

  // Address exists: confirmed -> nothing; pending -> atomic throttle in one UPDATE.
  const [row] = await db.select().from(subscribers).where(eq(subscribers.email, email));
  if (!row || row.status === "confirmed") return { action: "none" };

  const expired = sql`(${subscribers.mailWindowStart} IS NULL OR ${now} - ${subscribers.mailWindowStart} >= ${MAIL_WINDOW_MS})`;
  const updated = await db
    .update(subscribers)
    .set({
      locale,
      mailWindowStart: sql`CASE WHEN ${expired} THEN ${now} ELSE ${subscribers.mailWindowStart} END`,
      mailWindowCount: sql`CASE WHEN ${expired} THEN 1 ELSE ${subscribers.mailWindowCount} + 1 END`,
    })
    .where(
      and(
        eq(subscribers.id, row.id),
        eq(subscribers.status, "pending"),
        sql`(${expired} OR ${subscribers.mailWindowCount} < ${MAX_MAILS_PER_WINDOW})`,
      ),
    )
    .returning({ id: subscribers.id });
  return updated.length > 0 ? { action: "send", id: row.id, email } : { action: "none" };
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
