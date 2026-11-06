import { env } from "cloudflare:workers";
import { getDb } from "../../lib/server/db/index";
import { inspectLink, unsubscribeLink } from "../../lib/server/link-actions";

export const prerender = false;

export const load = async ({ url }) => {
  const token = url.searchParams.get("token");
  const { valid } = await inspectLink(env.JWT_SECRET, token, "unsubscribe", Date.now());
  return { valid, token: valid ? token : null };
};

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const token = data.get("token");
    const result = await unsubscribeLink(
      getDb(env.DB),
      env.JWT_SECRET,
      typeof token === "string" ? token : null,
      Date.now(),
    );
    return { result };
  },
};
