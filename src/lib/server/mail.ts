import * as m from "../paraglide/messages.js";
import type { MailLocale } from "./subscriptions";

export type ConfirmationMail = {
  to: string;
  from: { email: string; name: string };
  subject: string;
  text: string;
  html: string;
};

const translator = (locale: MailLocale) => {
  const opts = { locale };
  return {
    subject: () => String(m.mail_confirm_subject({}, opts)),
    greeting: () => String(m.mail_confirm_greeting({}, opts)),
    intro: () => String(m.mail_confirm_intro({}, opts)),
    cta: () => String(m.mail_confirm_cta({}, opts)),
    hint: () => String(m.mail_confirm_link_hint({}, opts)),
    ignore: () => String(m.mail_confirm_ignore({}, opts)),
    unsubscribe: () => String(m.mail_confirm_unsubscribe({}, opts)),
    signoff: () => String(m.mail_confirm_signoff({}, opts)),
  };
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function buildConfirmationMail(p: {
  to: string;
  from: string;
  confirmUrl: string;
  unsubscribeUrl: string;
  locale: MailLocale;
}): ConfirmationMail {
  const t = translator(p.locale);
  const text = [
    t.greeting(),
    "",
    t.intro(),
    "",
    `${t.cta()}: ${p.confirmUrl}`,
    t.hint(),
    "",
    t.ignore(),
    "",
    `${t.unsubscribe()} ${p.unsubscribeUrl}`,
    "",
    t.signoff(),
    "",
  ].join("\n");

  const html = `<!doctype html>
<html lang="${p.locale}"><body>
<p>${esc(t.greeting())}</p>
<p>${esc(t.intro())}</p>
<p><a href="${esc(p.confirmUrl)}">${esc(t.cta())}</a></p>
<p>${esc(t.hint())}</p>
<p>${esc(t.ignore())}</p>
<p>${esc(t.unsubscribe())} <a href="${esc(p.unsubscribeUrl)}">${esc(p.unsubscribeUrl)}</a></p>
<p>${esc(t.signoff())}</p>
</body></html>
`;

  return { to: p.to, from: { email: p.from, name: "Tomu" }, subject: t.subject(), text, html };
}
