/** The worker built by adapter-cloudflare (.svelte-kit/cloudflare/_worker.js), aliased in wrangler.jsonc so TypeScript never loads the build output. */
declare module "sveltekit-worker" {
  const worker: ExportedHandler<Env>;
  export default worker;
}
