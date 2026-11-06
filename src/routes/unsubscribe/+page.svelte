<script lang="ts">
  import * as m from "../../lib/paraglide/messages.js";
  import { localizeHref } from "#lib/paraglide/runtime.js";
  let { data, form } = $props();
</script>

<svelte:head>
  <title>{m.unsubscribe_page_doc_title()}</title>
</svelte:head>

<main class="mx-auto w-full max-w-xl px-6 pt-16 pb-20 sm:pt-24">
  <div class="slip action-note px-7 pt-14 pb-10 sm:px-10">
    <span class="magnet action-pin" aria-hidden="true"></span>
    {#if form?.result === "unsubscribed"}
      <h1 class="text-3xl leading-tight font-bold">{m.unsubscribe_page_done()}</h1>
    {:else if form?.result === "invalid" || !data.valid}
      <h1 class="text-3xl leading-tight font-bold">{m.link_invalid_title()}</h1>
      <p class="mt-4 text-lg text-pen-soft">{m.link_invalid_hint()}</p>
      <a href={localizeHref("/") + "#signup"} class="btn-action mt-8 w-full">{m.link_invalid_cta()}</a>
    {:else}
      <h1 class="text-3xl leading-tight font-bold">{m.unsubscribe_page_title()}</h1>
      <form method="POST" class="mt-8">
        <input type="hidden" name="token" value={data.token} />
        <button type="submit" class="btn-action w-full">
          {m.unsubscribe_page_button()}
        </button>
      </form>
    {/if}
  </div>
</main>
