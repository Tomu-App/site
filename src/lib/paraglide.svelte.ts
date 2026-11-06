import { browser } from "$app/env";
import { goto } from "$app/navigation";
import { page } from "$app/state";
import {
  baseLocale,
  extractLocaleFromUrl,
  localizeUrl,
  overwriteGetLocale,
  overwriteSetLocale,
  toLocale,
  type Locale as ParaglideLocale,
} from "#lib/paraglide/runtime.js";

/**
 * Makes Paraglide's locale reactive on the client. The URL is the source of truth, so plain links
 * (e.g. the language switcher or "German version" notice) switch the locale on client-side navigation too.
 * `setLocale` navigates to the localized URL.
 */
export class Locale {
  // Initial value comes from <html lang>, used until the page URL is available.
  #fallback: ParaglideLocale = $derived(
    (browser ? toLocale(document.documentElement.lang) : undefined) ?? baseLocale,
  );

  constructor() {
    overwriteGetLocale(() => extractLocaleFromUrl(page.url.href) ?? this.#fallback);
    overwriteSetLocale((locale) => {
      void goto(localizeUrl(page.url.href, { locale }).href);
    });
  }
}
