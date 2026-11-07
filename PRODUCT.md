# Product

<!-- impeccable:product-schema 1 -->

> Drafted from repository evidence, then confirmed by the user on 2026-11-06 (audience, voice, accessibility target). Facts still marked "(inferred)" are not confirmed. Sources: `../docs/spec.md`, `../docs/specs/2026-11-06-repos-site-anmeldung-design.md`, `messages/*.json`, `src/`.

## Platform

web

## Users

Primary visitor of this site (confirmed by the user): the younger relative who finds Tomu, signs up for updates, and will later set up a list and share the link with an older family member. Older readers remain a secondary audience and must still find every page easy to read. Tomu's audiences, as named in the product spec:

- Families across generations, for example a grandmother ("Oma") and her grandchild. Older people are an explicit audience; the site should be readable for them.
- Shared flats (WGs) that shop together.
- Later: anyone who wants a shared list without registering (wish list, cleaning rota, packing list).

Job on this site: understand in a short visit what Tomu is and why it differs, then leave an email address to get development updates (inferred: that a typical visitor arrives through a shared link or word of mouth, not through search or ads, is not documented).

The visitor reads in German by default; English is a secondary audience (inferred: German default and the `/en` prefix point to a primarily German-speaking audience).

## Product Purpose

Tomu is a shared list by link, for lists of any kind (to-dos, household tasks, packing lists, shopping lists; confirmed by the user: not a grocery-list product): no account, end-to-end encrypted, synced in real time, usable offline, and simple enough for an older person to use. Sharing works through labels: share a label once, and every list with that label (including future ones) is shared. One-sentence pitch (used verbatim as site copy): "Gemeinsame Listen für Familie, WG und Freunde. Alle sehen Änderungen sofort, und niemand sonst kann mitlesen." / "Shared lists for family, flatmates and friends. Everyone sees changes right away, and nobody else can read along." Site visitors are mostly not developers: site copy stays in everyday words, no URLs, keys or crypto terms (user, 2026-11-06).

The app is not built yet. This site exists before the app: it explains Tomu and collects newsletter sign-ups with double opt-in. Subscribers later receive updates the operator writes himself about development progress and the timeline (for example native apps).

Success for the site: people understand Tomu and confirm their sign-up, and the site keeps the product's privacy promise while doing so (no tracking, minimal data). No numeric sign-up target is documented.

## Positioning

The problem Tomu addresses: an older person writes a shopping list on paper or in WhatsApp, a grandchild retypes it and ticks items off in the shop, and later additions get lost. Existing apps such as Bring! or AnyList need accounts, are overloaded for older people, or can read list contents in plain text.

Tomu's distinct mechanism: the link is the permission. The encryption key lives only in the URL fragment (`https://app.tomu.foo/share/<docId>#<key>`) and never reaches the server, so the server stores only ciphertext. No registration, no account, real-time sync, offline-first. A competitor with server-side accounts cannot truthfully claim "the server can't read any of it" together with "no account at all".

## Operating Context

- Domain `tomu.foo`. The site runs on `tomu.foo/*`; the list app runs on its own subdomain, `app.tomu.foo` (shared links: `https://app.tomu.foo/share/<docId>#<key>`; decided by the user 2026-11-06, replacing the earlier `tomu.foo/l/*` plan in `../docs`; on 2026-11-07 `app.tomu.foo` replaced `link.tomu.foo`).
- Pages: home (`/`, prerendered, with sign-up form), legal notice and privacy policy (prerendered from Markdown in `src/lib/content/`), confirm and unsubscribe pages (server-rendered, reached from email links, each with a single button that performs the action via POST).
- Sign-up flow: email field, required consent checkbox with link to the privacy policy, Cloudflare Turnstile check, then always the same message: "Almost done. Check your inbox and confirm your sign-up." Confirmation link valid for 48 hours; unsubscribe link never expires and deletes the record completely.
- The confirmation email is plain (text plus simple HTML), sent from `Tomu <hallo@tomu.foo>`, with no external images, tracking links, or pixels.
- Languages: German at `/`, English at `/en`, switched via a language switcher in the header. Legal texts exist in English as a translation; the German version is legally binding, and English legal pages say so.
- Repositories are public under the GitHub organization `Tomu-App`, licensed Elastic License 2.0; the footer links to GitHub.

## Capabilities and Constraints

Confirmed:

- Pre-launch: the product is "in development"; the site must say so and must not imply the app is available.
- No tracking, no analytics, no tracking pixels, no click tracking, no third-party scripts except Cloudflare Turnstile. CSP allows only own sources plus `challenges.cloudflare.com`.
- The site must never reveal whether an address is already registered (no enumeration). Every valid submission shows the same response.
- The form must not let strangers spam other people's inboxes; mail scanners must not confirm sign-ups by opening links (hence the button-plus-POST pages).
- No email addresses, tokens, or full token URLs in logs. No IP addresses stored. Data in Cloudflare D1, EU jurisdiction.
- Sign-up needs JavaScript because Turnstile does; without JS the page shows a notice instead of the form.
- No accounts, logins, or admin interface on the site. Sending the actual newsletter updates is out of scope for now.
- All UI text goes through Paraglide (de, en); no second i18n mechanism.
- Hosting only on Cloudflare (Workers Paid); no extra running costs beyond that.
- Dark mode is required. It follows the browser or OS setting only; there is no theme switcher. Both modes must work fully, including for older readers (user's binding constraint).

Undecided:

- Operator name, address, and contact for the legal notice and privacy policy (placeholders until supplied).
- Final logo (see Brand Commitments).
- Which service will send the later newsletter updates.
- Launch date or timeline: none documented; do not state one.

## Brand Commitments

- Name: Tomu (a made-up name). Spelled "Tomu".
- Voice: plain, short, friendly sentences; informal "du" in German; addresses readers directly ("Du brauchst kein Konto. Du teilst einfach einen Link."). Sign-off "Dein Tomu-Team" / "Your Tomu team". (Confirmed by the user: keep this voice.)
- Logo: the current logo (`src/lib/assets/logo.svg`, used via `src/lib/components/Logo.svelte`) is a placeholder. The final logo will show a cloud. The logo must stay replaceable in one place, and nothing should be fixed so firmly that a cloud logo will not fit later.

## Evidence on Hand

- Real copy in German and English: `messages/de.json`, `messages/en.json` (pitch, three core points, status note, form, emails, confirm and unsubscribe pages).
- Legal texts: `src/lib/content/impressum.md`, `datenschutz.md`, `legal-notice.en.md`, `privacy.en.md` (operator details still placeholders).
- Product spec with the problem story, audiences, and technical design: `../docs/spec.md`.
- Absent, and must not be fabricated: testimonials, user quotes, user or sign-up counts, press, partner logos, pricing, launch dates, app screenshots (the app does not exist yet), final logo.

## Product Principles

1. Privacy is the product. The site practises what Tomu promises: no tracking, minimal data, nothing that could read along.
2. Simple enough for Oma. If an older reader cannot follow a page or a step, it is too complicated.
3. Honest about status. Tomu is in development; claim only what is decided and true.
4. Same answer for everyone. Flows never leak who has signed up, and errors stay calm and helpful.
5. One link instead of an account. Explanations lead with that mechanism, not with feature lists (inferred).

## Accessibility & Inclusion

- Older people are an explicit audience. The site must be calm, use large type, and be easy to read (stated in the site design doc; the product spec sets "Oma-tauglich" as a goal: large type, large buttons, few options).
- Dark mode follows the system setting; both light and dark must be fully readable and usable.
- German and English, with the German legal texts binding.
- Target: WCAG 2.2 AA (confirmed by the user), in both light and dark mode.
