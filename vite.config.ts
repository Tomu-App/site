import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import adapter from "@sveltejs/adapter-cloudflare";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
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
      csp: {
        mode: "auto",
        directives: {
          "default-src": ["self"],
          "script-src": ["self", "https://challenges.cloudflare.com"],
          "frame-src": ["https://challenges.cloudflare.com"],
          "connect-src": ["self"],
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
      // Base locale `de` stays unprefixed. Patterns are matched in order (first match wins).
      strategy: ["url", "baseLocale"],
      urlPatterns: [
        { pattern: "/confirm", localized: [["de", "/bestaetigen"]] },
        { pattern: "/unsubscribe", localized: [["de", "/abmelden"]] },
        { pattern: "/legal-notice", localized: [["de", "/impressum"]] },
        { pattern: "/privacy", localized: [["de", "/datenschutz"]] },
        // Everything else (/, /api/*, assets) passes through unchanged.
        { pattern: "/:path(.*)?", localized: [["de", "/:path(.*)?"]] },
      ],
    }),
  ],
});
