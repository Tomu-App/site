// The SvelteKit adapter output only exists after `vite build`. Declare its shape
// so `svelte-check` passes both on a clean checkout and after a build.
declare module "*/_worker.js" {
  const handler: ExportedHandler<Cloudflare.Env>;
  export default handler;
}
