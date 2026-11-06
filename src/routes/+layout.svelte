<script lang="ts">
  import "./layout.css";
  import { page } from "$app/state";
  import favicon from "#lib/assets/logo.svg";
  import LanguageSwitcher from "#lib/components/LanguageSwitcher.svelte";
  import Logo from "#lib/components/Logo.svelte";
  import { baseLocale, localizeHref, locales } from "#lib/paraglide/runtime.js";
  import { SITE_ORIGIN } from "#lib/site.ts";

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
  <header class="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-6 pt-8">
    <a href={localizeHref("/")} class="inline-block"><Logo /></a>
    <LanguageSwitcher />
  </header>
  <div class="flex-1">
    {@render children()}
  </div>
</div>
