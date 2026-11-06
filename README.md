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

Build und Deploy laufen komplett über GitHub Actions (kein Workers Builds). Push auf `main` deployt Produktion (`.github/workflows/deploy.yml`), PRs aus demselben Repo bekommen eine Worker Preview `pr-<nummer>` (`.github/workflows/preview.yml`), die beim Schließen des PRs gelöscht wird. Previews sind öffentlich erreichbar. PRs aus Forks bekommen nur die Prüfungen aus `ci.yml`.

1. D1-Datenbanken (beide in der EU): **bereits angelegt**, die IDs stehen in `wrangler.jsonc` (`tomu-site` im Top-Level `d1_databases`, `tomu-site-preview` unter `previews.d1_databases`) und für Previews zusätzlich in `wrangler.preview-migrations.jsonc` (beide Stellen müssen dieselbe ID haben). Zur Referenz, falls neu anzulegen: `pnpm exec wrangler d1 create tomu-site --jurisdiction eu` bzw. `... tomu-site-preview --jurisdiction eu`, danach IDs eintragen und `pnpm gen`.
2. API-Token anlegen (Cloudflare Dashboard, My Profile, API Tokens) mit minimalen Rechten: Account / Workers Scripts / Edit, Account / D1 / Edit, Account / Account Settings / Read. In GitHub unter Settings, Environments zwei Environments anlegen und den Token **als Environment-Secret** `CLOUDFLARE_API_TOKEN` in beiden speichern (nicht als Repo-Secret):
   - `production`: Deployment branches auf `main` beschränken.
   - `preview`: optional Required reviewers setzen.
     Hinweis: Wer Schreibrechte im Repo hat, kann in einem PR aus demselben Repo auch die Workflows ändern und so an das Environment-Secret `preview` gelangen. Schreibrechte nur an vertrauenswürdige Mitwirkende vergeben. Der Token wird in den Workflows nur den `wrangler`-Schritten übergeben, nicht Installation und Build.
3. Repo-Variablen setzen (oder in beiden Environments): `CLOUDFLARE_ACCOUNT_ID`, `TURNSTILE_SITE_KEY` (öffentlicher Prod-Site-Key, wird beim Prod-Build eingebettet). `DEPLOY_ENABLED` kommt erst in Schritt 9.
4. Domain `tomu.foo` in Cloudflare unter Email Service, Email Sending einrichten (SPF, DKIM und DMARC-Einträge setzen und prüfen lassen). Bis das erledigt ist, gehen Mails nur an verifizierte Adressen des eigenen Accounts.
5. Turnstile-Widget für `tomu.foo` anlegen. Der Site Key ist öffentlich, der Secret Key geheim. Previews verwenden die Turnstile-Testkeys und brauchen keinen Hostname `*.workers.dev` im Widget. Soll eine Preview mit dem echten Widget laufen, muss der Preview-Hostname im Widget stehen.
6. Prod-Secrets setzen: `JWT_SECRET` (erzeugen mit `openssl rand -base64 48`) und `TURNSTILE_SECRET`, entweder einzeln mit `pnpm exec wrangler secret put JWT_SECRET` bzw. `pnpm exec wrangler secret put TURNSTILE_SECRET` oder gesammelt aus `.env.production` mit `pnpm exec wrangler secret bulk .env.production`. Der Worker `tomu-site` muss dafür schon existieren: einmal `pnpm build && pnpm exec wrangler deploy` lokal ausführen oder den ersten Deploy abwarten und die Secrets danach setzen.
7. Preview-Secrets setzen (getrennt von Produktion, wirken auf neu angelegte Previews): eigenes `JWT_SECRET` und das Turnstile-Testsecret `1x0000000000000000000000000000000AA` als `TURNSTILE_SECRET`.
   - `pnpm exec wrangler preview base-config secret put JWT_SECRET`
   - `pnpm exec wrangler preview base-config secret put TURNSTILE_SECRET`
   - Oder gesammelt: `pnpm exec wrangler preview base-config secret bulk <datei>` (JSON oder .env).
8. Verifizierte Zieladressen für Previews: Adressen in Cloudflare Email Routing als Destination hinzufügen und bestätigen, dann in `wrangler.jsonc` unter `previews.send_email[0].allowed_destination_addresses` eintragen. Solange die Liste leer ist, kann eine Preview keine Mails versenden.
9. Zum Schluss die Repo-Variable `DEPLOY_ENABLED` auf `true` setzen. Davor überspringen beide Workflows den Deploy, damit `main` nicht rot wird.
10. Für die Custom Domain darf kein konfligierender DNS-Eintrag auf dem Apex existieren (A, AAAA oder CNAME), sonst lässt sich die Domain nicht dem Worker zuweisen.

Alle Previews teilen sich eine D1 (`tomu-site-preview`). Eine destruktive Migration in einem PR wirkt deshalb auf alle offenen Previews. Dependabot-PRs bekommen keine Preview. Die Action-Versionen sind auf Commit-SHAs gepinnt; `.github/dependabot.yml` hält sie wöchentlich aktuell.

Build-Schutz: Nur der Produktions-Deploy setzt `REQUIRE_PROD_CONFIG=1`. Mit dem Flag bricht der Build ab, wenn `TURNSTILE_SITE_KEY` leer ist oder im Impressum Platzhalter stehen. Ohne das Flag (CI, Previews, `pnpm dev`, `pnpm test`, auch bei `CI=true`) gilt der Test-Key.

Wer lokal einen Produktions-Build prüfen will: `REQUIRE_PROD_CONFIG=1 TURNSTILE_SITE_KEY=<key> pnpm build`.

## Lizenz

[Elastic License 2.0](LICENSE)
