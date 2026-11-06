<script lang="ts">
  import Logo from "#lib/components/Logo.svelte";

  let { data } = $props();
</script>

<header class="mx-auto max-w-2xl px-6 pt-8">
  <a href="/" class="inline-block"><Logo /></a>
</header>
<main class="legal mx-auto max-w-2xl px-6 py-10">
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html data.html}
</main>
