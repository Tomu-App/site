import { json } from "@sveltejs/kit";
import { env } from "cloudflare:workers";
import { getDb } from "../../../lib/server/db/index";
import { handleSubscribe } from "../../../lib/server/subscribe-handler";
import { verifyTurnstile } from "../../../lib/server/turnstile";

export const POST = async (event) => {
  let body: unknown;
  try {
    body = await event.request.json();
  } catch {
    return json({ error: "invalid" }, { status: 400 });
  }
  const ip = event.getClientAddress();
  const res = await handleSubscribe(
    {
      db: getDb(env.DB),
      now: Date.now(),
      jwtSecret: env.JWT_SECRET,
      baseUrl: env.BASE_URL,
      mailFrom: env.MAIL_FROM,
      verifyCaptcha: (token) => verifyTurnstile(env.TURNSTILE_SECRET, token, ip),
      allow: async () => (await env.SIGNUP_LIMITER.limit({ key: "signup:" + ip })).success,
      send: async (mail) => {
        await env.EMAIL.send(mail);
      },
    },
    body,
  );
  return json(res.body, { status: res.status });
};
