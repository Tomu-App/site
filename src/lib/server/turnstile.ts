const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface SiteverifyResponse {
  success?: boolean;
  "error-codes"?: string[];
  hostname?: string;
  action?: string;
}

/** Never log the token, secret, IP or email: only Cloudflare's diagnostic fields. */
export async function verifyTurnstile(secret: string, token: string, ip: string | null): Promise<boolean> {
  try {
    const form = new FormData();
    form.append("secret", secret);
    form.append("response", token);
    if (ip) form.append("remoteip", ip);
    const res = await fetch(SITEVERIFY, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(5000),
    });
    const data = (await res.json().catch(() => ({}))) as SiteverifyResponse;
    if (res.ok && data.success === true) return true;
    console.warn(
      JSON.stringify({
        event: "turnstile_failed",
        errorCodes: data["error-codes"] ?? [],
        hostname: data.hostname ?? null,
        action: data.action ?? null,
        status: res.status,
      }),
    );
    return false;
  } catch (e) {
    console.warn(JSON.stringify({ event: "turnstile_error", name: (e as { name?: string } | null)?.name }));
    return false;
  }
}
