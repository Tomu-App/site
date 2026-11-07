<script lang="ts">
  import * as m from "#lib/paraglide/messages.js";
  import { getLocale, localizeHref } from "#lib/paraglide/runtime.js";
  import Turnstile from "./Turnstile.svelte";

  type Status =
    | "idle"
    | "submitting"
    | "success"
    | "captcha"
    | "captcha_wait"
    | "invalid"
    | "rate_limited"
    | "unavailable"
    | "error";

  let email = $state("");
  let token = $state<string | null>(null);
  let status = $state<Status>("idle");
  let turnstile: Turnstile | undefined = $state();

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    if (!token) {
      status = "captcha_wait";
      return;
    }
    status = "submitting";
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, consent: true, turnstileToken: token, locale: getLocale() }),
      });
      if (res.ok) {
        status = "success";
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.status === 429) status = "rate_limited";
      else if (body.error === "captcha") status = "captcha";
      else if (body.error === "invalid") status = "invalid";
      else if (res.status === 503) status = "unavailable";
      else status = "error";
    } catch {
      status = "error";
    }
    // A token works once; always ask for a fresh one after a failed attempt.
    turnstile?.reset();
  }

  const errorText = $derived.by(() => {
    switch (status) {
      case "captcha":
        return m.signup_error_captcha();
      case "captcha_wait":
        return m.signup_captcha_wait();
      case "invalid":
        return m.signup_error_invalid();
      case "rate_limited":
        return m.signup_error_rate_limited();
      case "unavailable":
        return m.signup_error_unavailable();
      case "error":
        return m.signup_error_generic();
      default:
        return null;
    }
  });
</script>

<section id="signup" aria-labelledby="signup-title" class="max-w-xl scroll-mt-8">
  <h2 id="signup-title" class="text-2xl font-bold">{m.signup_title()}</h2>
  <p class="mt-2 text-lg text-door-muted">{m.signup_intro()}</p>

  <noscript>
    <p class="mt-4 text-lg">{m.signup_noscript()}</p>
  </noscript>

  {#if status === "success"}
    <p role="status" class="mt-5 rounded-lg bg-ok px-5 py-4 text-xl font-semibold text-ok-ink">
      {m.signup_success()}
    </p>
  {:else}
    <form onsubmit={submit} class="mt-5 space-y-5">
      <div>
        <label for="signup-email" class="block text-lg font-semibold">{m.signup_email_label()}</label>
        <input
          id="signup-email"
          name="email"
          type="email"
          autocomplete="email"
          required
          maxlength="254"
          bind:value={email}
          class="mt-2 w-full rounded-lg border-2 border-field-line bg-field px-4 py-3.5 text-xl text-door-ink transition-colors hover:border-door-ink focus-visible:border-door-ink"
        />
      </div>

      <div class="flex items-start gap-4">
        <input id="signup-consent" type="checkbox" required class="check mt-0.5 h-7 w-7 shrink-0" />
        <label for="signup-consent" class="text-base leading-relaxed text-door-muted">
          {m.signup_consent_text()}
          <a href={localizeHref("/privacy")} class="font-semibold text-door-ink underline"
            >{m.signup_consent_privacy_link()}</a
          >
        </label>
      </div>

      <Turnstile bind:this={turnstile} onToken={(t) => (token = t)} />

      {#if errorText}
        <p role="alert" class="rounded-lg bg-error px-5 py-4 text-lg font-semibold text-error-ink">
          {errorText}
        </p>
      {/if}

      <button type="submit" disabled={status === "submitting"} class="btn-action w-full sm:w-auto">
        {status === "submitting" ? m.signup_submitting() : m.signup_submit()}
      </button>
    </form>
  {/if}
</section>
