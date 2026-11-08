# Security Policy

## Scope

This policy covers vulnerabilities in the **Tomu site**: its source, its build and deployment, and anything this repository ships.

In scope: the newsletter sign-up (`api/subscribe`), the confirm and unsubscribe flow and its tokens, mail sending, Turnstile verification, and the security headers (CSP). Of special interest is anything that reveals whether an address is registered, lets someone confirm or unsubscribe an address they do not own, or leaks email addresses or tokens.

Out of scope: the app and sync server (repo `Tomu-App/app`, which has its own policy), and third-party services the site runs on (Cloudflare). Report those to their owners.

## Reporting a vulnerability

Please report privately. Do **not** open a public issue for a security report.

- **Preferred:** email **[contact.lukez@proton.me](mailto:contact.lukez@proton.me)**.
- **Or:** private vulnerability reporting in the [Security tab](https://github.com/Tomu-App/site/security/advisories/new) of `Tomu-App/site`.

Include the affected file or component, a minimal reproduction, the impact as you understand it, and any fix you have in mind.

## What to expect

- Credit in the commit or PR if you would like it; coordinated disclosure once a fix is deployed.

This project is maintained on a best-effort basis, without a contractual SLA.

## Supported versions

Only the live site is supported. Fixes land on `main` and deploy to production on merge.
