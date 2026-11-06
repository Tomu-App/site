import de from "#lib/content/datenschutz.md?raw";
import en from "#lib/content/privacy.en.md?raw";
import { renderLegalMarkdown } from "#lib/content/render.ts";
import { getLocale } from "#lib/paraglide/runtime.js";

export const prerender = true;

// Own repo content, trusted; rendered at build time only. The placeholder guard runs for both languages.
export const load = async () => {
  const rendered = { de: renderLegalMarkdown(de), en: renderLegalMarkdown(en) };
  return { html: rendered[getLocale()] };
};
