import { sequence, type Handle, type HandleServerError } from "@sveltejs/kit/hooks";
import { withSecurityHeaders } from "./lib/server/security-headers";
import { redirect } from "@sveltejs/kit";
import { getTextDirection, localizeUrl } from "#lib/paraglide/runtime.js";
import { paraglideMiddleware } from "#lib/paraglide/server.js";

const handleParaglide: Handle = ({ event, resolve }) =>
  paraglideMiddleware(event.request, ({ request, locale }) => {
    return resolve(
      { ...event, request },
      {
        transformPageChunk: ({ html }) =>
          html.replace("%paraglide.lang%", locale).replace("%paraglide.dir%", getTextDirection(locale)),
      },
    );
  });

// English route directories exist only as filesystem names; the public URLs are localized.
// Unprefixed ones (/confirm, /privacy, ...) would otherwise duplicate the German page, so send them to the German URL.
const UNLOCALIZED = new Set(["/confirm", "/unsubscribe", "/legal-notice", "/privacy"]);

const handleUnlocalizedPaths: Handle = ({ event, resolve }) => {
  if (UNLOCALIZED.has(event.url.pathname.replace(/\/+$/, ""))) {
    const target = localizeUrl(event.url, { locale: "de" });
    redirect(308, target.pathname + target.search);
  }
  return resolve(event);
};

const handleSecurityHeaders: Handle = async ({ event, resolve }) => withSecurityHeaders(await resolve(event));

export const handle: Handle = sequence(handleSecurityHeaders, handleUnlocalizedPaths, handleParaglide);

// Never log the error message: Drizzle errors embed query params (e.g. email addresses).
export const handleError: HandleServerError = ({ error, kind, event }) => {
  const status = kind === "unknown" ? 500 : (error as { status: number }).status;
  console.error(
    JSON.stringify({ event: "unhandled_error", status, route: event.route.id, name: (error as Error)?.name }),
  );
  return { message: "Internal Error" };
};
