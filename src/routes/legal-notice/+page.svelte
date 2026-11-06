<script lang="ts">
  import * as m from "#lib/paraglide/messages.js";
  import TranslationNotice from "#lib/components/TranslationNotice.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>{m.legal_notice_page_title()}</title>
</svelte:head>

<main class="mx-auto w-full max-w-6xl px-6 pt-12 pb-20 sm:px-10">
  <div class="legal">
    <TranslationNotice path="/legal-notice" />
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html data.html}
  </div>
</main>
