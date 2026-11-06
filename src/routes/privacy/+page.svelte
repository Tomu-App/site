<script lang="ts">
  import * as m from "#lib/paraglide/messages.js";
  import Logo from "#lib/components/Logo.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>{m.privacy_page_title()}</title>
</svelte:head>

<header class="mx-auto max-w-2xl px-6 pt-8">
  <a href="/" class="inline-block"><Logo /></a>
</header>
<main class="legal mx-auto max-w-2xl px-6 py-10">
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html data.html}
</main>
