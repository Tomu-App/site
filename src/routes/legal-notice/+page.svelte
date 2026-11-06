<script lang="ts">
  import * as m from "#lib/paraglide/messages.js";
  import TranslationNotice from "#lib/components/TranslationNotice.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>{m.legal_notice_page_title()}</title>
</svelte:head>

<main class="legal mx-auto max-w-2xl px-6 py-10">
  <TranslationNotice path="/legal-notice" />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html data.html}
</main>
