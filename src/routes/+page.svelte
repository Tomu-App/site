<script lang="ts">
  import FridgeNote from "#lib/components/FridgeNote.svelte";
  import LabelTag from "#lib/components/LabelTag.svelte";
  import SignupForm from "#lib/components/SignupForm.svelte";
  import * as m from "#lib/paraglide/messages.js";
  import { APP_URL } from "#lib/site.ts";

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
        <div class="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          <a href={APP_URL} class="btn-action w-full sm:w-auto">{m.app_open()}</a>
          <span class="beta-badge">{m.app_beta_badge()}</span>
        </div>
      </div>
      <div class="note-col">
        <FridgeNote />
      </div>
      <div class="form-col">
        <SignupForm />
      </div>
    </section>

    <section aria-labelledby="share-title" class="share border-t-2 border-door-deep py-20 lg:py-28">
      <div>
        <h2 id="share-title" class="text-3xl font-bold sm:text-4xl">{m.share_title()}</h2>
        <ol class="steps mt-10 space-y-6 text-xl">
          <li>{m.share_step_1()}</li>
          <li>{m.share_step_2()}</li>
          <li>{m.share_step_3()}</li>
        </ol>
        <p class="mt-8 text-lg text-door-muted">{m.share_private_note()}</p>
      </div>
      <figure class="share-demo">
        <div class="share-note" aria-hidden="true">
          <span class="magnet share-pin"></span>
          <ul>
            <li>
              <span class="font-hand">{m.share_demo_list_1()}</span>
              <LabelTag name={m.label_family()} shared />
            </li>
            <li>
              <span class="font-hand">{m.share_demo_list_3()}</span>
              <LabelTag name={m.share_demo_label_wg()} shared />
            </li>
            <li>
              <span class="font-hand">{m.share_demo_list_2()}</span>
              <LabelTag name={m.label_private_name()} shared={false} />
            </li>
          </ul>
        </div>
        <figcaption class="mt-5 text-base text-door-muted">{m.share_demo_caption()}</figcaption>
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
  /* Beta marker beside the app link: an outlined pill in door ink (red stays with the magnet). */
  .beta-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.1rem 0.75rem;
    border: 2px solid var(--door-ink);
    border-radius: 999px;
    color: var(--door-ink);
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.5;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .status-dot {
    flex: none;
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 999px;
    background: var(--magnet);
    translate: 0 -0.1em;
  }

  /* How sharing works: steps on the door, a pinned note with labelled lists beside them. */
  .share {
    display: grid;
    row-gap: 3.5rem;
  }
  @media (min-width: 64rem) {
    .share {
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
      column-gap: 5rem;
      align-items: start;
    }
  }
  .steps {
    counter-reset: step;
    max-width: 34ch;
  }
  .steps li {
    position: relative;
    padding-left: 3.25rem;
    counter-increment: step;
  }
  .steps li::before {
    content: counter(step);
    position: absolute;
    left: 0;
    top: 0.1rem;
    display: grid;
    place-items: center;
    width: 2.1rem;
    height: 2.1rem;
    border-radius: 999px;
    background: var(--door-deep);
    font-weight: 700;
  }
  .share-demo {
    width: min(100%, 28rem);
    justify-self: center;
  }
  .share-note {
    position: relative;
    padding: 2.5rem 1.75rem 1.5rem;
    background: var(--slip);
    color: var(--pen);
    border-radius: 2px;
    rotate: 1deg;
    box-shadow:
      0 1px 2px var(--slip-shadow),
      0 18px 32px -18px var(--slip-shadow);
  }
  .share-pin {
    position: absolute;
    top: -1.5rem;
    left: 50%;
    translate: -50% 0;
  }
  .share-note li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.6rem 0;
    font-size: 1.5rem;
  }
  .share-note li + li {
    border-top: 2px solid var(--slip-rule);
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
