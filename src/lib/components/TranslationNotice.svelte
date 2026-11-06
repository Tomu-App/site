<script lang="ts">
  import * as m from "#lib/paraglide/messages.js";
  import { getLocale, localizeHref } from "#lib/paraglide/runtime.js";

  let { path }: { path: string } = $props();
</script>

{#if getLocale() !== "de"}
  <p class="mb-10 max-w-[68ch] rounded-lg bg-door-deep px-5 py-4 text-lg">
    {m.legal_translation_notice()}
    <a href={localizeHref(path, { locale: "de" })} hreflang="de" lang="de" class="font-semibold underline"
      >{m.legal_translation_link()}</a
    >
  </p>
{/if}
