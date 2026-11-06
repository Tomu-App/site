<script lang="ts">
  import { page } from "$app/state";
  import * as m from "#lib/paraglide/messages.js";
  import { getLocale, localizeUrl, locales, setLocale, type Locale } from "#lib/paraglide/runtime.js";

  const names: Record<Locale, () => string> = { de: m.lang_de, en: m.lang_en };

  // Plain links so switching works without JavaScript; `href` is the same page in the other language.
  const links = $derived(
    locales.map((locale) => {
      const url = localizeUrl(page.url, { locale });
      // "/en/" would 404 (no trailing slashes); keep "/" for the root.
      const path = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, "") : url.pathname;
      return { locale, href: path + url.search + url.hash };
    }),
  );

  function onclick(event: MouseEvent, locale: Locale) {
    // Leave new-tab and modified clicks to the browser.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setLocale(locale);
  }
</script>

<nav aria-label={m.lang_switcher_label()}>
  <ul class="flex gap-1">
    {#each links as { locale, href } (locale)}
      <li>
        <a
          {href}
          hreflang={locale}
          lang={locale}
          aria-current={locale === getLocale() ? "true" : undefined}
          onclick={(event) => onclick(event, locale)}
          class="flex min-h-12 min-w-12 items-center justify-center rounded-lg px-4 text-lg font-semibold underline-offset-4 hover:underline aria-[current=true]:bg-accent aria-[current=true]:text-accent-foreground"
          >{names[locale]()}</a
        >
      </li>
    {/each}
  </ul>
</nav>
