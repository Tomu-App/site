<script lang="ts">
  import FridgeNote from "#lib/components/FridgeNote.svelte";
  import SignupForm from "#lib/components/SignupForm.svelte";
  import * as m from "#lib/paraglide/messages.js";

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

<div class="mx-auto max-w-6xl px-6 sm:px-10">
  <main>
    <section class="hero pt-8 pb-20 sm:pt-12 lg:pb-28">
      <div class="pitch">
        <h1 class="pitch-text font-bold">{m.home_pitch()}</h1>
        <p class="mt-5 flex max-w-[34ch] items-baseline gap-3 text-xl text-door-muted">
          <span class="status-dot" aria-hidden="true"></span>
          <span>{m.home_status()}</span>
        </p>
      </div>
      <div class="note-col">
        <FridgeNote />
      </div>
      <div class="form-col">
        <SignupForm />
      </div>
    </section>

    <section aria-labelledby="link-title" class="border-t-2 border-door-deep py-20 lg:py-28">
      <h2 id="link-title" class="text-3xl font-bold sm:text-4xl">{m.link_title()}</h2>
      <figure class="mt-10">
        <figcaption class="sr-only">{m.link_example_label()}</figcaption>
        <p class="label font-mono" aria-hidden="true">
          <span class="magnet label-pin"></span>
          <span class="path">list.tomu.foo/f3K9xQ2mLp7RvT1bN8cZaw</span><span class="key"
            >#Qm8T0vXkJ2pLs9…</span
          >
        </p>
        <div class="notes mt-8 grid gap-8 text-xl sm:grid-cols-2">
          <p class="note-path">
            <svg class="arrow" viewBox="0 0 40 40" aria-hidden="true"
              ><path d="M8 34C10 22 14 13 22 6M22 6l-8 2.2M22 6l.6 8.2" /></svg
            >
            {m.link_path_note()}
          </p>
          <p class="note-key">
            <svg class="arrow" viewBox="0 0 40 40" aria-hidden="true"
              ><path d="M8 34C10 22 14 13 22 6M22 6l-8 2.2M22 6l.6 8.2" /></svg
            >
            {m.link_key_note()}
          </p>
        </div>
      </figure>
    </section>

    <section aria-labelledby="points-title" class="border-t-2 border-door-deep py-20 lg:py-28">
      <h2 id="points-title" class="text-3xl font-bold sm:text-4xl">{m.home_points_title()}</h2>
      <div class="points mt-12">
        <span class="magnet points-pin" aria-hidden="true"></span>
        <ul>
          {#each points as point, i (i)}
            <li>
              <h3 class="text-2xl font-bold">{point.title()}</h3>
              <p class="mt-1 text-xl">{point.text()}</p>
            </li>
          {/each}
        </ul>
      </div>
    </section>
  </main>
</div>

<style>
  .hero {
    display: grid;
    grid-template-areas: "pitch" "form" "note";
    row-gap: 3rem;
  }
  .pitch {
    grid-area: pitch;
  }
  .note-col {
    grid-area: note;
    width: min(100%, 30rem);
    justify-self: center;
  }
  .form-col {
    grid-area: form;
  }
  @media (min-width: 64rem) {
    .hero {
      grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
      grid-template-areas: "pitch note" "form note";
      grid-template-rows: auto 1fr;
      column-gap: 5rem;
      row-gap: 2.25rem;
    }
    .note-col {
      align-self: start;
      justify-self: end;
      margin-top: 1.5rem;
    }
  }
  .pitch-text {
    font-size: clamp(2.1rem, 1.3rem + 2.4vw, 3.1rem);
    line-height: 1.08;
    letter-spacing: -0.015em;
    max-width: 20ch;
  }
  .status-dot {
    flex: none;
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 999px;
    background: var(--magnet);
    translate: 0 -0.1em;
  }

  /* The link as a white magnetic label on the door. */
  .label {
    position: relative;
    display: inline-block;
    max-width: 100%;
    padding: 1.4rem 1.6rem 1.2rem;
    background: var(--slip);
    color: var(--pen);
    font-size: clamp(1rem, 0.7rem + 1.2vw, 1.6rem);
    line-height: 1.5;
    overflow-wrap: anywhere;
    border-radius: 2px;
    rotate: -0.6deg;
    box-shadow:
      0 1px 2px var(--slip-shadow),
      0 14px 26px -16px var(--slip-shadow);
  }
  .label-pin {
    position: absolute;
    top: -1.2rem;
    left: 1.4rem;
    width: 2.4rem;
    height: 2.4rem;
  }
  .key {
    color: var(--magnet);
    font-weight: 700;
    text-decoration: underline wavy var(--magnet);
    text-decoration-thickness: 2px;
    text-underline-offset: 0.3em;
  }
  @media (prefers-color-scheme: dark) {
    .key {
      color: #b4261a;
      text-decoration-color: #b4261a;
    }
  }
  .notes p {
    position: relative;
    padding-left: 3rem;
    max-width: 30ch;
  }
  .arrow {
    position: absolute;
    left: 0;
    top: -0.4rem;
    width: 2.2rem;
    height: 2.2rem;
    fill: none;
    stroke: var(--door-ink);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .note-key .arrow {
    stroke: var(--magnet);
  }

  /* The three points on one pinned note. */
  .points {
    position: relative;
    max-width: 44rem;
    padding: 2.75rem 2rem 2rem;
    background: var(--slip);
    color: var(--pen);
    border-radius: 2px;
    rotate: -0.7deg;
    box-shadow:
      0 1px 2px var(--slip-shadow),
      0 18px 32px -18px var(--slip-shadow);
  }
  .points-pin {
    position: absolute;
    top: -1.5rem;
    left: 2rem;
  }
  .points li + li {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 2px solid var(--slip-rule);
  }
  .points p {
    color: var(--pen-soft);
  }
  @media (min-width: 40rem) {
    .points {
      padding: 3rem 3rem 2.5rem;
    }
  }
</style>
