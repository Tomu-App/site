<script lang="ts">
  import * as m from "#lib/paraglide/messages.js";
  import { localizeHref } from "#lib/paraglide/runtime.js";
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
        body: JSON.stringify({ email, consent: true, turnstileToken: token }),
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

<section aria-labelledby="signup-title" class="rounded-2xl border-2 border-border bg-card p-6 sm:p-8">
  <h2 id="signup-title" class="text-2xl font-bold sm:text-3xl">{m.signup_title()}</h2>

  <noscript>
    <p class="mt-4 text-lg">{m.signup_noscript()}</p>
  </noscript>

  {#if status === "success"}
    <p role="status" class="mt-6 rounded-lg bg-success p-5 text-xl font-semibold text-success-foreground">
      {m.signup_success()}
    </p>
  {:else}
    <form onsubmit={submit} class="mt-6 space-y-6">
      <div>
        <label for="signup-email" class="block text-xl font-semibold">{m.signup_email_label()}</label>
        <input
          id="signup-email"
          name="email"
          type="email"
          autocomplete="email"
          required
          maxlength="254"
          bind:value={email}
          class="mt-2 w-full rounded-lg border-2 border-input px-4 py-4 text-xl"
        />
      </div>

      <div class="flex items-start gap-4">
        <input id="signup-consent" type="checkbox" required class="mt-1 h-7 w-7 shrink-0 accent-primary" />
        <label for="signup-consent" class="text-lg">
          {m.signup_consent_text()}
          <a href={localizeHref("/privacy")} class="font-semibold underline"
            >{m.signup_consent_privacy_link()}</a
          >
        </label>
      </div>

      <Turnstile bind:this={turnstile} onToken={(t) => (token = t)} />

      {#if errorText}
        <p
          role="alert"
          class="rounded-lg bg-destructive p-4 text-lg font-semibold text-destructive-foreground"
        >
          {errorText}
        </p>
      {/if}

      <button
        type="submit"
        disabled={status === "submitting"}
        class="w-full rounded-lg bg-primary px-8 py-5 text-2xl font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        {status === "submitting" ? m.signup_submitting() : m.signup_submit()}
      </button>
    </form>
  {/if}
</section>
