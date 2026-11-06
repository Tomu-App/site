import md from "#lib/content/datenschutz.md?raw";
import { renderLegalMarkdown } from "#lib/content/render.ts";

export const prerender = true;

// Own repo content, trusted; rendered at build time only.
export const load = async () => ({ html: renderLegalMarkdown(md) });
