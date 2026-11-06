# Tomu Site

Marketing-Seite und Newsletter-Anmeldung für Tomu. SvelteKit auf Cloudflare Workers mit D1 (Drizzle), Tailwind 4 und Paraglide (nur Deutsch).

## Lokale Befehle

```sh
pnpm install
pnpm dev               # Dev-Server
pnpm test              # Vitest im Workers-Runtime mit lokalem D1
pnpm check             # svelte-check
pnpm lint              # prettier --check
pnpm build             # Produktions-Build
pnpm db:generate       # Migrationen aus schema.ts erzeugen (./migrations)
pnpm db:migrate:local  # Migrationen auf lokale D1 anwenden
```

Nach Änderungen an `wrangler.jsonc` `pnpm gen` ausführen und `worker-configuration.d.ts` committen.

## Lizenz

[Elastic License 2.0](LICENSE)
