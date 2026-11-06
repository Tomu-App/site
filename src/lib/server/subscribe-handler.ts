import { z } from "zod";
import type { Db } from "./db/index";
import { buildConfirmationMail, type ConfirmationMail } from "./mail";
import { normalizeEmail, requestSubscription, type MailLocale } from "./subscriptions";
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
  /** Schedules background work without delaying the response (waitUntil). Must not reject. */
  defer: (task: Promise<unknown>) => void;
};

/** Mail link base: configured BASE_URL, or the request origin when empty (PR previews). */
export function resolveBaseUrl(envBaseUrl: string | undefined, requestUrl: URL): string {
  const configured = envBaseUrl?.trim().replace(/\/+$/, "");
  return configured ? configured : requestUrl.origin;
}

export type SubscribeResponse =
  | { status: 200; body: { ok: true } }
  | { status: 400; body: { error: "invalid" | "captcha" } }
  | { status: 503; body: { error: "unavailable" } }
  | { status: 429; body: { error: "rate_limited" } };

const schema = z.object({
  email: z.string(),
  consent: z.literal(true),
  turnstileToken: z.string().min(1),
  // Unknown or missing values fall back to German.
  locale: z.enum(["de", "en"]).catch("de"),
});

const LINK_PATHS: Record<MailLocale, { confirm: string; unsubscribe: string }> = {
  de: { confirm: "/bestaetigen", unsubscribe: "/abmelden" },
  en: { confirm: "/en/confirm", unsubscribe: "/en/unsubscribe" },
};

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

  let result;
  try {
    result = await requestSubscription(deps.db, email, deps.now, parsed.data.locale);
  } catch (e) {
    // Drizzle errors embed query params (the address): log the name only.
    console.error("subscribe db failed", (e as Error)?.name ?? "unknown");
    return { status: 503, body: { error: "unavailable" } };
  }
  if (result.action === "send") {
    // Fire and forget: the response must not depend on (or time) mail work.
    const { id, email: to } = result;
    deps.defer(sendConfirmation(deps, id, to, parsed.data.locale));
  }
  return OK;
}

async function sendConfirmation(
  deps: SubscribeDeps,
  id: string,
  to: string,
  locale: MailLocale,
): Promise<void> {
  try {
    const paths = LINK_PATHS[locale];
    const [confirm, unsubscribe] = await Promise.all([
      signToken(deps.jwtSecret, id, "confirm", deps.now),
      signToken(deps.jwtSecret, id, "unsubscribe", deps.now),
    ]);
    await deps.send(
      buildConfirmationMail({
        to,
        from: deps.mailFrom,
        locale,
        confirmUrl: `${deps.baseUrl}${paths.confirm}?token=${confirm}`,
        unsubscribeUrl: `${deps.baseUrl}${paths.unsubscribe}?token=${unsubscribe}`,
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
