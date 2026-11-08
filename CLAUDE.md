# CLAUDE.md

Tomu marketing site with newsletter double opt-in. SvelteKit (Svelte 5, TypeScript) on Cloudflare Workers, D1 via Drizzle, Tailwind 4, Paraglide i18n (de, en). Package manager: pnpm.

- Product context: `PRODUCT.md`. Site design doc: `../docs/specs/2026-11-06-repos-site-anmeldung-design.md`. Product spec: `../docs/spec.md`.
- Setup, secrets and deploy details: `README.md`.

## Commands

```sh
pnpm dev                 # Vite dev server
pnpm test                # Vitest in the Workers runtime with local D1 (pretest compiles Paraglide)
pnpm check               # svelte-check
pnpm lint                # prettier --check
pnpm format              # prettier --write
pnpm build               # wrangler types --check, then vite build
pnpm gen                 # regenerate worker-configuration.d.ts after editing wrangler.jsonc (commit it)
pnpm db:generate         # Drizzle migrations from src/lib/server/db/schema.ts into ./migrations
pnpm db:migrate:local    # apply migrations to local D1
```

Git hooks (husky, `.husky/`): `commit-msg` enforces Conventional Commits; `pre-push` runs lint, build, check and test, but only for pushes to `main`.

CI (`.github/workflows/ci.yml`) runs lint, build, check and tests. `deploy.yml` deploys `main` to production;

## Layout

- `src/worker.ts`: Worker entry (SvelteKit fetch plus the daily cron cleanup from `src/lib/server/scheduled.ts`).
- `src/hooks.server.ts`: Paraglide middleware, redirect of unlocalized English route paths to the German URL, security headers (CSP).
- `src/hooks.ts`: Paraglide reroute (de-localizes URLs).
- `src/routes/`: route directories use English names (`confirm`, `unsubscribe`, `privacy`, `legal-notice`); public URLs are localized by Paraglide (German without prefix, English under `/en`). `api/subscribe` is the JSON sign-up endpoint.
- `src/lib/server/`: subscribe handler, subscriptions, JWT tokens, mail, Turnstile, security headers, DB.
- `src/lib/content/`: legal texts as Markdown (German binding, English translation) plus `render.ts`.
- `src/lib/components/`: `SignupForm`, `Turnstile`, `LanguageSwitcher`, `TranslationNotice`, `Logo`.
- `messages/de.json`, `messages/en.json`: all UI and mail text. `src/lib/paraglide/` is generated and gitignored.
- `test/`: Vitest suites.

## Rules

- All user-facing text goes through Paraglide messages, in both `de.json` and `en.json`. No second i18n mechanism, no hardcoded strings.
- No analytics, tracking or third-party scripts except Cloudflare Turnstile. CSP allows only own sources plus `challenges.cloudflare.com`.
- Never reveal whether an address is registered: every valid sign-up returns the same response.
- Never log email addresses, tokens or full URLs with tokens. Never store IP addresses.
- Confirm and unsubscribe pages act only on POST (button), never on GET, so mail scanners cannot trigger them.
- The logo (cloud) is at `src/lib/assets/logo.svg` (source copy in `static/logo.svg`), included only via `Logo.svelte`; keep it replaceable in one place.
- Dark mode follows the browser or OS setting only; there is no theme switcher.
- Dev env comes only from `.env.local`; production values live in `.env.production` (Vite loads it only for builds). Do not create a plain `.env` (Vite loads it in every mode) or `.dev.vars` (Wrangler would then ignore the `.env.*` files). Never commit `.env*` files except `.env.example`.
- Production builds set `REQUIRE_PROD_CONFIG=1`, which fails on an empty `TURNSTILE_SITE_KEY` or placeholders in the legal notice.
