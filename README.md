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

## Einmaliges Setup

1. D1 anlegen: `pnpm exec wrangler d1 create tomu-site --jurisdiction eu`, die ausgegebene `database_id` in `wrangler.jsonc` eintragen (aktuell ein Platzhalter aus Nullen), danach `pnpm gen`.
2. Domain `tomu.foo` in Cloudflare unter Email Service, Email Sending einrichten (SPF, DKIM und DMARC-Einträge setzen und prüfen lassen).
3. Turnstile-Widget für `tomu.foo` anlegen. Der Site Key ist öffentlich, der Secret Key geheim.
4. Secrets setzen: `JWT_SECRET` (erzeugen mit `openssl rand -base64 48`) und `TURNSTILE_SECRET`, entweder einzeln mit `pnpm exec wrangler secret put JWT_SECRET` bzw. `pnpm exec wrangler secret put TURNSTILE_SECRET` oder gesammelt aus `.env` mit `pnpm exec wrangler secret bulk .env`.
5. Workers Builds: Repository `Tomu-App/site` verbinden.
   - Build-Befehl: `pnpm build`
   - Deploy-Befehl: `pnpm db:migrate:remote && pnpm exec wrangler deploy`
   - Build-Variable `TURNSTILE_SITE_KEY` (öffentlicher Site Key). Ohne sie bricht ein Produktions-Build ab, damit nie der Test-Key live geht. In CI (`CI=true`), bei `pnpm dev` und `pnpm test` gilt weiter der Test-Key.
   - Preview-Einstellungen und Bindings getrennt von Production konfigurieren.
6. Für die Custom Domain darf kein konfligierender DNS-Eintrag auf dem Apex existieren (A, AAAA oder CNAME), sonst lässt sich die Domain nicht dem Worker zuweisen.

## Lizenz

[Elastic License 2.0](LICENSE)
