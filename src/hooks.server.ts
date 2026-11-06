import { sequence, type Handle } from "@sveltejs/kit/hooks";
import { withSecurityHeaders } from "./lib/server/security-headers";
import { getTextDirection } from "#lib/paraglide/runtime.js";
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

const handleSecurityHeaders: Handle = async ({ event, resolve }) => withSecurityHeaders(await resolve(event));

export const handle: Handle = sequence(handleSecurityHeaders, handleParaglide);
