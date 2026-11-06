<script lang="ts">
  import SignupForm from "#lib/components/SignupForm.svelte";
  import * as m from "#lib/paraglide/messages.js";
  import { localizeHref } from "#lib/paraglide/runtime.js";

  const points = [
    { title: m.home_point_1_title, text: m.home_point_1_text },
    { title: m.home_point_2_title, text: m.home_point_2_text },
    { title: m.home_point_3_title, text: m.home_point_3_text },
  ];
</script>

<svelte:head>
  <title>{m.site_title()}</title>
  <meta name="description" content={m.site_description()} />
</svelte:head>

<div class="mx-auto flex min-h-full max-w-2xl flex-col px-6 pb-8">
  <main class="flex-1 space-y-12 py-12">
    <section>
      <h1 class="text-4xl leading-tight font-bold sm:text-5xl">{m.home_pitch()}</h1>
      <p class="mt-6 rounded-lg bg-accent p-4 text-xl text-accent-foreground">{m.home_status()}</p>
    </section>

    <section aria-labelledby="points-title">
      <h2 id="points-title" class="sr-only">{m.home_points_title()}</h2>
      <ul class="space-y-6">
        {#each points as point, i (i)}
          <li>
            <h3 class="text-2xl font-bold">{point.title()}</h3>
            <p class="mt-1 text-xl">{point.text()}</p>
          </li>
        {/each}
      </ul>
    </section>

    <SignupForm />
  </main>

  <footer class="border-t-2 border-border pt-6 text-lg">
    <nav class="flex flex-wrap gap-x-8 gap-y-3">
      <a href={localizeHref("/legal-notice")} class="underline">{m.footer_legal_notice()}</a>
      <a href={localizeHref("/privacy")} class="underline">{m.footer_privacy()}</a>
      <a href="https://github.com/Tomu-App" class="underline" target="_blank" rel="noopener noreferrer"
        >{m.footer_github()}</a
      >
    </nav>
  </footer>
</div>
