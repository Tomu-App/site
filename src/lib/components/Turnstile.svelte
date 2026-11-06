<script lang="ts">
  import { TURNSTILE_SITE_KEY } from "$app/env/public";
  import { getLocale } from "#lib/paraglide/runtime.js";

  interface TurnstileApi {
    render: (el: HTMLElement, options: Record<string, unknown>) => string;
    reset: (widgetId?: string) => void;
    remove: (widgetId?: string) => void;
  }

  let {
    onToken,
  }: {
    /** Called with a fresh token, or with null when the token expired or an error occurred. */
    onToken: (token: string | null) => void;
  } = $props();

  const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

  let container: HTMLDivElement;
  let widgetId: string | undefined;

  const api = () => (window as unknown as { turnstile?: TurnstileApi }).turnstile;

  function loadScript(): Promise<TurnstileApi> {
    const existing = api();
    if (existing) return Promise.resolve(existing);
    return new Promise((resolve, reject) => {
      let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
      if (!script) {
        script = document.createElement("script");
        script.src = SCRIPT_SRC;
        script.async = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", () => {
        const loaded = api();
        if (loaded) resolve(loaded);
        else reject(new Error("turnstile missing"));
      });
      script.addEventListener("error", () => reject(new Error("turnstile failed to load")));
    });
  }

  /** Resets the widget so the visitor can solve a new challenge. */
  export function reset() {
    onToken(null);
    if (widgetId !== undefined) api()?.reset(widgetId);
  }

  $effect(() => {
    let cancelled = false;
    loadScript()
      .then((turnstile) => {
        if (cancelled) return;
        widgetId = turnstile.render(container, {
          sitekey: TURNSTILE_SITE_KEY,
          language: getLocale(),
          // Shows the widget only when Cloudflare needs an interaction; keeps the form compact.
          appearance: "interaction-only",
          callback: (token: string) => onToken(token),
          "expired-callback": () => onToken(null),
          "error-callback": () => onToken(null),
        });
      })
      .catch(() => onToken(null));
    return () => {
      cancelled = true;
      if (widgetId !== undefined) api()?.remove(widgetId);
      widgetId = undefined;
    };
  });
</script>

<div bind:this={container}></div>
