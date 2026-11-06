import { env, waitUntil } from "cloudflare:workers";
import { getDb } from "../../../lib/server/db/index";
import { handleSubscribe, resolveBaseUrl } from "../../../lib/server/subscribe-handler";
import { verifyTurnstile } from "../../../lib/server/turnstile";

export const POST = async (event) => {
  let body: unknown;
  try {
    body = await event.request.json();
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }
  const ip = event.getClientAddress();
  const res = await handleSubscribe(
    {
      db: getDb(env.DB),
      now: Date.now(),
      jwtSecret: env.JWT_SECRET,
      baseUrl: resolveBaseUrl(env.BASE_URL, new URL(event.request.url)),
      mailFrom: env.MAIL_FROM,
      verifyCaptcha: (token) => verifyTurnstile(env.TURNSTILE_SECRET, token, ip),
      allow: async () => (await env.SIGNUP_LIMITER.limit({ key: "signup:" + ip })).success,
      defer: waitUntil,
      send: async (mail) => {
        await env.EMAIL.send(mail);
      },
    },
    body,
  );
  return Response.json(res.body, { status: res.status });
};
