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

Secrets liegen in `.env.production` (Produktionswerte, nur lokal, nie committen; Upload mit `pnpm exec wrangler secret bulk .env.production`) und `.env.local` (Entwicklungswerte). `vite dev` und `wrangler dev` nutzen nur `.env.local`; `.env.production` lädt Vite nur beim Build. Keine `.env` anlegen: die lädt Vite in jedem Modus, auch in der Entwicklung. Vorlage: `.env.example`. Eine `.dev.vars`-Datei darf nicht existieren, sonst ignoriert Wrangler die `.env`-Dateien.

## Einmaliges Setup

Build und Deploy laufen komplett über GitHub Actions (kein Workers Builds). Push auf `main` deployt Produktion (`.github/workflows/deploy.yml`). PRs bekommen nur die Prüfungen aus `ci.yml`, keine Preview-Deployments.

1. D1-Datenbank `tomu-site` (EU): **bereits angelegt**, die ID steht in `wrangler.jsonc`. Zur Referenz, falls neu anzulegen: `pnpm exec wrangler d1 create tomu-site --jurisdiction eu`, danach ID eintragen und `pnpm gen`.
2. API-Token anlegen (Cloudflare Dashboard, My Profile, API Tokens) mit minimalen Rechten: Account / Workers Scripts / Edit, Account / D1 / Edit, Account / Account Settings / Read. In GitHub unter Settings, Environments das Environment `production` anlegen, Deployment branches auf `main` beschränken und den Token dort **als Environment-Secret** `CLOUDFLARE_API_TOKEN` speichern (nicht als Repo-Secret). Der Token wird im Workflow nur den `wrangler`-Schritten übergeben, nicht Installation und Build.
3. Repo-Variablen setzen (oder im Environment): `CLOUDFLARE_ACCOUNT_ID`, `TURNSTILE_SITE_KEY` (öffentlicher Prod-Site-Key, wird beim Prod-Build eingebettet). `DEPLOY_ENABLED` kommt erst in Schritt 7.
4. Domain `tomu.foo` in Cloudflare unter Email Service, Email Sending einrichten (SPF, DKIM und DMARC-Einträge setzen und prüfen lassen). Bis das erledigt ist, gehen Mails nur an verifizierte Adressen des eigenen Accounts.
5. Turnstile-Widget für `tomu.foo` anlegen. Der Site Key ist öffentlich, der Secret Key geheim.
6. Prod-Secrets setzen: `JWT_SECRET` (erzeugen mit `openssl rand -base64 48`) und `TURNSTILE_SECRET`, entweder einzeln mit `pnpm exec wrangler secret put JWT_SECRET` bzw. `pnpm exec wrangler secret put TURNSTILE_SECRET` oder gesammelt aus `.env.production` mit `pnpm exec wrangler secret bulk .env.production`. Der Worker `tomu-site` muss dafür schon existieren: einmal `pnpm build && pnpm exec wrangler deploy` lokal ausführen oder den ersten Deploy abwarten und die Secrets danach setzen.
7. Zum Schluss die Repo-Variable `DEPLOY_ENABLED` auf `true` setzen. Davor überspringt der Workflow den Deploy, damit `main` nicht rot wird.
8. Für die Custom Domain darf kein konfligierender DNS-Eintrag auf dem Apex existieren (A, AAAA oder CNAME), sonst lässt sich die Domain nicht dem Worker zuweisen.

Die Action-Versionen sind auf Commit-SHAs gepinnt; `.github/dependabot.yml` hält sie wöchentlich aktuell.

Build-Schutz: Nur der Produktions-Deploy setzt `REQUIRE_PROD_CONFIG=1`. Mit dem Flag bricht der Build ab, wenn `TURNSTILE_SITE_KEY` leer ist oder im Impressum Platzhalter stehen. Ohne das Flag (CI, `pnpm dev`, `pnpm test`, auch bei `CI=true`) gilt der Test-Key.

Wer lokal einen Produktions-Build prüfen will: `REQUIRE_PROD_CONFIG=1 TURNSTILE_SITE_KEY=<key> pnpm build`.

## Mitwirken

Siehe [CONTRIBUTING.md](CONTRIBUTING.md). Es gilt der [Code of Conduct](CODE_OF_CONDUCT.md). Sicherheitslücken bitte wie in [SECURITY.md](SECURITY.md) beschrieben melden, nicht in öffentlichen Issues.

## Lizenz

[Elastic License 2.0](LICENSE)
