<script lang="ts">
  import { flip } from "svelte/animate";
  import * as m from "#lib/paraglide/messages.js";

  // Sample content only: the app does not exist yet, so the note is labelled as an example.
  type Item = {
    id: string;
    text: () => string;
    done: boolean;
    writing?: boolean;
    striking?: boolean;
  };

  const start = (): Item[] => [
    { id: "a", text: m.demo_item_1, done: false },
    { id: "b", text: m.demo_item_2, done: false },
    { id: "c", text: m.demo_item_3, done: false },
    { id: "d", text: m.demo_item_4, done: false },
    { id: "z", text: m.demo_item_done, done: true },
  ];

  let items = $state<Item[]>(start());
  let played = $state(false);
  let reduced = $state(false);
  let el: HTMLElement;
  let timers: ReturnType<typeof setTimeout>[] = [];

  const sorted = $derived([...items.filter((i) => !i.done), ...items.filter((i) => i.done)]);

  const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

  function finalState(): Item[] {
    const list = start();
    list.splice(4, 0, { id: "e", text: m.demo_item_5, done: false });
    list[0] = { ...list[0], done: true };
    return list;
  }

  function play() {
    timers.forEach(clearTimeout);
    timers = [];
    if (reduced) {
      items = finalState();
      played = true;
      return;
    }
    items = start();
    played = false;
    // Oma writes a new entry ...
    at(900, () => {
      items.splice(4, 0, { id: "e", text: m.demo_item_5, done: false, writing: true });
    });
    // ... and Lena ticks one off, which then moves down.
    at(3800, () => {
      const a = items.find((i) => i.id === "a");
      if (a) a.striking = true;
    });
    at(4700, () => {
      const a = items.find((i) => i.id === "a");
      if (a) Object.assign(a, { done: true });
    });
    at(5600, () => (played = true));
  }

  $effect(() => {
    reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          play();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  });
</script>

<figure bind:this={el} class="note">
  <div class="slip px-6 sm:px-8">
    <span class="magnet pin" aria-hidden="true"></span>
    <p class="sample">{m.demo_label()}</p>
    <p class="title font-hand font-bold" aria-hidden="true">{m.demo_list_title()}</p>
    <ul aria-hidden="true">
      {#each sorted as item (item.id)}
        <li animate:flip={{ duration: 600 }} class:done={item.done}>
          <svg class="box" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M3.2 4.6C8 3.6 15 3.9 20.4 4.1c.4 5 0 10.8.2 15.9-6.6.6-12.6.3-17.2.2-.2-6.1 0-11-.2-15.6Z"
            />
            {#if item.done || item.striking}
              <path class="check" pathLength="1" d="M6.5 12.6 10.2 17 19.6 5.4" />
            {/if}
          </svg>
          <span class="text font-hand" class:writing={item.writing}>
            {item.text()}
            {#if item.done || item.striking}
              <svg class="strike" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
                <path pathLength="1" d="M1 6.5C20 4.8 40 6.8 60 5.2S90 5.8 99 4.6" />
              </svg>
            {/if}
          </span>
        </li>
      {/each}
    </ul>
  </div>
  <figcaption
    class="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-base text-door-muted"
  >
    <span>{m.demo_caption()}</span>
    <span class="sr-only">{m.demo_summary()}</span>
    {#if !reduced}
      <button
        type="button"
        onclick={play}
        disabled={!played}
        class="min-h-12 rounded-lg font-semibold text-door-ink underline decoration-2 underline-offset-4 transition-opacity disabled:opacity-0"
        >{m.demo_replay()}</button
      >
    {/if}
  </figcaption>
</figure>

<style>
  .note {
    --tilt: 1.6deg;
  }
  .slip {
    padding-top: var(--row);
    padding-bottom: var(--row);
    transform: rotate(var(--tilt));
    border-radius: 2px;
  }
  .pin {
    position: absolute;
    top: calc(var(--row) * -0.42);
    left: 50%;
    translate: -50% 0;
    rotate: calc(var(--tilt) * -1);
  }
  .sample {
    position: absolute;
    top: 0.6rem;
    right: 1.1rem;
    padding: 0.05rem 0.55rem;
    border: 2px solid #a3241a;
    border-radius: 3px;
    color: #a3241a;
    font-size: 0.8rem;
    font-weight: 700;
    line-height: 1.5;
    rotate: -5deg;
  }
  .title {
    font-size: 1.75rem;
    line-height: var(--row);
  }
  li {
    display: grid;
    grid-template-columns: 1.6rem 1fr;
    align-items: baseline;
    column-gap: 0.75rem;
  }
  .text {
    position: relative;
    font-size: 1.6rem;
    line-height: var(--row);
    width: fit-content;
  }
  .box {
    width: 1.35rem;
    height: 1.35rem;
    align-self: start;
    margin-top: calc((var(--row) - 1.35rem) / 2);
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .check {
    stroke-width: 2.6;
    stroke-dasharray: 1;
    animation: draw 420ms cubic-bezier(0.2, 0.7, 0.3, 1) both;
  }
  .done .text {
    color: var(--pen-soft);
  }
  .strike {
    position: absolute;
    left: -0.2rem;
    right: -0.2rem;
    top: 50%;
    width: calc(100% + 0.4rem);
    height: 0.6rem;
    translate: 0 -40%;
    overflow: visible;
    fill: none;
    stroke: var(--pen);
    stroke-width: 2.4;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
  }
  .strike path {
    stroke-dasharray: 1;
    animation: draw 520ms cubic-bezier(0.3, 0.6, 0.3, 1) both;
  }
  .writing {
    animation: write 1700ms cubic-bezier(0.35, 0.1, 0.35, 1) both;
  }
  @keyframes draw {
    from {
      stroke-dashoffset: 1;
    }
    to {
      stroke-dashoffset: 0;
    }
  }
  @keyframes write {
    from {
      clip-path: inset(0 100% 0 0);
    }
    to {
      clip-path: inset(0 0 0 0);
    }
  }
  @media (max-width: 30rem) {
    .slip {
      --row: 2.5rem;
    }
    .text {
      font-size: 1.4rem;
    }
    li {
      grid-template-columns: 1.4rem 1fr;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .check,
    .strike path,
    .writing {
      animation: none;
    }
  }
</style>
