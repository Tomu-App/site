<script lang="ts">
  import * as m from "#lib/paraglide/messages.js";

  // A list label as the app will show it: shared labels in ink blue, private ones in grey.
  let { name, shared }: { name: string; shared: boolean } = $props();
</script>

<span class="tag" class:shared>
  {name}<span class="sr-only"> ({shared ? m.label_shared() : m.label_private()})</span>
</span>

<style>
  .tag {
    display: inline-flex;
    align-items: center;
    padding: 0.05rem 0.6rem;
    border: 2px solid var(--tag-private);
    border-radius: 999px;
    color: var(--tag-private);
    font-family: var(--font-sans);
    font-size: 0.85rem;
    font-weight: 700;
    line-height: 1.5;
    white-space: nowrap;
  }
  .shared {
    border-color: var(--pen);
    background: var(--pen);
    color: #ffffff;
  }
</style>
