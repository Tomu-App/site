// Minimal Worker entry for tests. Avoids needing the SvelteKit build output
// (.svelte-kit/cloudflare/_worker.js) when running vitest.
export default {
  fetch: () => new Response("test worker"),
} satisfies ExportedHandler;
