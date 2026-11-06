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

## Lokale Umgebungsvariablen

Secrets liegen in `.env` (Produktionswerte, nur lokal, nie committen; Upload mit `pnpm exec wrangler secret bulk .env`) und/oder `.env.local` (Entwicklungswerte). `wrangler dev` und `vite dev` laden beide, `.env.local` überschreibt `.env`. Vorlage: `.env.example`. Eine `.dev.vars`-Datei darf nicht existieren, sonst ignoriert Wrangler die `.env`-Dateien.

## Lizenz

[Elastic License 2.0](LICENSE)
