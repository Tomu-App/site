<script lang="ts">
  import "./layout.css";
  import { page } from "$app/state";
  import favicon from "#lib/assets/logo.svg";
  import LanguageSwitcher from "#lib/components/LanguageSwitcher.svelte";
  import Logo from "#lib/components/Logo.svelte";
  import * as m from "#lib/paraglide/messages.js";
  import { baseLocale, localizeHref, locales } from "#lib/paraglide/runtime.js";
  import { APP_URL, SITE_ORIGIN } from "#lib/site.ts";

  let { children } = $props();

  // Same page in every language, absolute URLs for search engines.
  const alternates = $derived(
    locales.map((locale) => ({
      locale,
      href: SITE_ORIGIN + localizeHref(page.url.pathname, { locale }).replace(/(.)\/+$/, "$1"),
    })),
  );
</script>

<svelte:head>
  <link rel="icon" href={favicon} type="image/svg+xml" />
  {#each alternates as { locale, href } (locale)}
    <link rel="alternate" hreflang={locale} {href} />
  {/each}
  <link rel="alternate" hreflang="x-default" href={alternates.find((a) => a.locale === baseLocale)?.href} />
</svelte:head>

<div class="flex min-h-screen flex-col">
  <header class="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 pt-6 sm:px-10 sm:pt-8">
    <a href={localizeHref("/")} class="inline-block"><Logo /></a>
    <div class="flex items-center gap-2">
      <a
        href={APP_URL}
        class="hidden min-h-12 items-center rounded-lg px-4 text-lg font-semibold text-door-ink underline sm:flex"
        >{m.app_open()}</a
      >
      <LanguageSwitcher />
    </div>
  </header>
  <div class="flex-1">
    {@render children()}
  </div>
  <footer class="mx-auto w-full max-w-6xl px-6 pb-10 sm:px-10">
    <nav class="flex flex-wrap gap-x-8 gap-y-3 border-t-2 border-door-deep pt-8 text-lg">
      <a href={localizeHref("/legal-notice")} class="underline">{m.footer_legal_notice()}</a>
      <a href={localizeHref("/privacy")} class="underline">{m.footer_privacy()}</a>
      <a href="https://github.com/Tomu-App" class="underline" target="_blank" rel="noopener noreferrer"
        >{m.footer_github()}</a
      >
    </nav>
  </footer>
</div>
