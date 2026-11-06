import { z } from "zod";
import type { Db } from "./db/index";
import { buildConfirmationMail, type ConfirmationMail } from "./mail";
import { normalizeEmail, requestSubscription } from "./subscriptions";
import { signToken } from "./tokens";

export type SubscribeDeps = {
  db: Db;
  now: number;
  jwtSecret: string;
  baseUrl: string;
  verifyCaptcha: (token: string) => Promise<boolean>;
  allow: () => Promise<boolean>;
  send: (mail: ConfirmationMail) => Promise<void>;
  mailFrom: string;
};

export type SubscribeResponse =
  | { status: 200; body: { ok: true } }
  | { status: 400; body: { error: "invalid" | "captcha" } }
  | { status: 429; body: { error: "rate_limited" } };

const schema = z.object({
  email: z.string(),
  consent: z.literal(true),
  turnstileToken: z.string().min(1),
});

const OK: SubscribeResponse = { status: 200, body: { ok: true } };

export async function handleSubscribe(deps: SubscribeDeps, body: unknown): Promise<SubscribeResponse> {
  const parsed = schema.safeParse(body);
  if (!parsed.success) return { status: 400, body: { error: "invalid" } };

  if (!(await deps.verifyCaptcha(parsed.data.turnstileToken))) {
    return { status: 400, body: { error: "captcha" } };
  }
  if (!(await deps.allow())) return { status: 429, body: { error: "rate_limited" } };

  const email = normalizeEmail(parsed.data.email);
  if (!email) return { status: 400, body: { error: "invalid" } };

  const result = await requestSubscription(deps.db, email, deps.now);
  if (result.action === "send") {
    try {
      const [confirm, unsubscribe] = await Promise.all([
        signToken(deps.jwtSecret, result.id, "confirm", deps.now),
        signToken(deps.jwtSecret, result.id, "unsubscribe", deps.now),
      ]);
      await deps.send(
        buildConfirmationMail({
          to: result.email,
          from: deps.mailFrom,
          confirmUrl: `${deps.baseUrl}/bestaetigen?token=${confirm}`,
          unsubscribeUrl: `${deps.baseUrl}/abmelden?token=${unsubscribe}`,
        }),
      );
    } catch (e) {
      // Never log the address, token or URL: only an error code or name.
      const code = (e as { code?: unknown } | null)?.code;
      console.error(
        "confirmation mail failed",
        typeof code === "string" ? code : ((e as Error)?.name ?? "unknown"),
      );
    }
  }
  return OK;
}
