<script lang="ts">
  import * as m from "../../lib/paraglide/messages.js";
  let { data, form } = $props();
</script>

<main class="mx-auto max-w-xl p-6 text-center">
  {#if form?.result === "unsubscribed"}
    <h1 class="text-3xl font-bold">{m.unsubscribe_page_done()}</h1>
  {:else if form?.result === "invalid" || !data.valid}
    <h1 class="text-3xl font-bold">{m.link_invalid_title()}</h1>
    <p class="mt-4 text-lg">{m.link_invalid_hint()}</p>
  {:else}
    <h1 class="text-3xl font-bold">{m.unsubscribe_page_title()}</h1>
    <form method="POST" class="mt-8">
      <input type="hidden" name="token" value={data.token} />
      <button type="submit" class="w-full rounded-lg bg-black px-8 py-5 text-2xl font-semibold text-white">
        {m.unsubscribe_page_button()}
      </button>
    </form>
  {/if}
</main>
