import { readFileSync } from "node:fs";
import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

/** Minimal JSONC reader: drops comments outside strings and trailing commas. */
function readJsonc(path: string): Record<string, unknown> {
  const src = readFileSync(path, "utf8");
  let out = "";
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (c === '"') {
      let j = i + 1;
      while (src[j] !== '"') j += src[j] === "\\" ? 2 : 1;
      out += src.slice(i, j + 1);
      i = j;
    } else if (c === "/" && src[i + 1] === "/") {
      while (i < src.length && src[i] !== "\n") i++;
      out += "\n";
    } else if (c === "/" && src[i + 1] === "*") {
      i = src.indexOf("*/", i + 2) + 1;
    } else out += c;
  }
  return JSON.parse(out.replace(/,(\s*[}\]])/g, "$1"));
}

export default defineConfig({
  plugins: [
    cloudflareTest(async () => {
      const migrations = await readD1Migrations("./migrations");
      return {
        main: "./test/worker.ts",
        wrangler: { configPath: "./wrangler.jsonc" },
        miniflare: {
          bindings: {
            TEST_MIGRATIONS: migrations,
            JWT_SECRET: "test-secret-please-change",
            // workerd tests cannot read files; Node reads both configs for the drift guard.
            WRANGLER_ASSETS: JSON.stringify(readJsonc("./wrangler.jsonc").assets),
            WRANGLER_SVELTEKIT_ASSETS: JSON.stringify(readJsonc("./wrangler.sveltekit.jsonc").assets),
          },
        },
      };
    }),
  ],
  test: {
    setupFiles: ["./test/apply-migrations.ts"],
  },
});
