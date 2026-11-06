import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import adapter from "@sveltejs/adapter-cloudflare";
import { sveltekit } from "@sveltejs/kit/vite";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";

// Paraglide 3.1 resolves `../runtime.js` from its virtual message modules to a backslash path on Windows. That is a
// different module id than the normalized one everything else imports, so the bundle gets two runtimes and
// messages ignore the per-request locale (English pages render German). Resolve it to the normalized id instead.
const paraglideRuntimeIdFix = (): Plugin => ({
  name: "paraglide-runtime-id-fix",
  enforce: "pre",
  resolveId(source, importer) {
    if (path.sep !== "\\" || source !== "../runtime.js" || !importer?.startsWith("\0virtual:paraglide/"))
      return null;
    return path.resolve("src/lib/paraglide/runtime.js").replaceAll("\\", "/");
  },
});

export default defineConfig({
  plugins: [
    paraglideRuntimeIdFix(),
    tailwindcss(),
    sveltekit({
      compilerOptions: {
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
        runes: ({ filename }) => (filename.split(/[/\\]/).includes("node_modules") ? undefined : true),
      },
      // The adapter overwrites `main` of its config, so it gets its own file; dev bindings still come from wrangler.jsonc.
      adapter: adapter({
        config: "wrangler.sveltekit.jsonc",
        platformProxy: { configPath: "wrangler.jsonc" },
      }),
      // English route dirs also exist unprefixed; only the localized URLs may be prerendered (no duplicate /privacy.html).
      prerender: {
        handleUnseenRoutes: "ignore",
        entries: ["/", "/en", "/impressum", "/datenschutz", "/en/legal-notice", "/en/privacy", "/bar"],
      },
      csp: {
        mode: "auto",
        directives: {
          "default-src": ["self"],
          "script-src": ["self", "https://challenges.cloudflare.com"],
          "frame-src": ["https://challenges.cloudflare.com"],
          "connect-src": ["self", "https://challenges.cloudflare.com"],
          "img-src": ["self", "data:"],
          "style-src": ["self", "unsafe-inline"],
          "object-src": ["none"],
          "base-uri": ["self"],
          "form-action": ["self"],
          // Dropped from <meta> on prerendered pages (browsers ignore it there); dynamic pages send it as a header.
          "frame-ancestors": ["none"],
        },
      },
    }),

    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/lib/paraglide",
      emitTsDeclarations: true,
      // Filesystem routes are English; the public German URLs come from the patterns below.
      // Base locale `de` stays unprefixed, English lives under `/en`. Patterns are matched in order (first match wins).
      strategy: ["url", "baseLocale"],
      urlPatterns: [
        {
          pattern: "/confirm",
          localized: [
            ["de", "/bestaetigen"],
            ["en", "/en/confirm"],
          ],
        },
        {
          pattern: "/unsubscribe",
          localized: [
            ["de", "/abmelden"],
            ["en", "/en/unsubscribe"],
          ],
        },
        {
          pattern: "/legal-notice",
          localized: [
            ["de", "/impressum"],
            ["en", "/en/legal-notice"],
          ],
        },
        {
          pattern: "/privacy",
          localized: [
            ["de", "/datenschutz"],
            ["en", "/en/privacy"],
          ],
        },
        {
          pattern: "/",
          localized: [
            ["de", "/"],
            ["en", "/en"],
          ],
        },
        // Everything else (/api/*, assets) passes through; only English gets the prefix.
        // Two patterns because `de` must not swallow `/en/...` when de-localizing.
        { pattern: "/:path(.*)?", localized: [["en", "/en/:path(.*)?"]] },
        { pattern: "/:path(.*)?", localized: [["de", "/:path(.*)?"]] },
      ],
    }),
  ],
});
