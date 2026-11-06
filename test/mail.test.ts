import { describe, expect, it } from "vitest";
import { buildConfirmationMail } from "../src/lib/server/mail";

const confirmUrl = "https://tomu.foo/bestaetigen?token=abc.def.ghi";
const unsubscribeUrl = "https://tomu.foo/abmelden?token=xyz.uvw.rst";
const mail = buildConfirmationMail({
  to: "oma@example.de",
  from: "hallo@tomu.foo",
  confirmUrl,
  unsubscribeUrl,
  locale: "de",
});

describe("buildConfirmationMail", () => {
  it("sets recipient, sender and subject", () => {
    expect(mail.to).toBe("oma@example.de");
    expect(mail.from).toEqual({ email: "hallo@tomu.foo", name: "Tomu" });
    expect(mail.subject).toBe("Bitte bestätige deine Anmeldung bei Tomu");
  });
  it("contains both links in text and html", () => {
    for (const body of [mail.text, mail.html]) {
      expect(body).toContain(confirmUrl);
      expect(body).toContain(unsubscribeUrl);
    }
  });
  it("html has no images and no other URLs", () => {
    expect(mail.html).not.toContain("<img");
    const urls = mail.html.match(/https?:\/\/[^\s"'<>]+/g) ?? [];
    expect(urls.every((u) => u === confirmUrl || u === unsubscribeUrl)).toBe(true);
  });
  it("contains the ignore hint", () => {
    expect(mail.text).toContain("Wenn du dich nicht angemeldet hast");
  });
  it("sets lang de in html", () => {
    expect(mail.html).toContain('<html lang="de">');
  });
});

describe("buildConfirmationMail (en)", () => {
  const enConfirm = "https://tomu.foo/en/confirm?token=abc.def.ghi";
  const enUnsub = "https://tomu.foo/en/unsubscribe?token=xyz.uvw.rst";
  const en = buildConfirmationMail({
    to: "gran@example.com",
    from: "hallo@tomu.foo",
    confirmUrl: enConfirm,
    unsubscribeUrl: enUnsub,
    locale: "en",
  });
  it("uses English subject and copy", () => {
    expect(en.subject).not.toBe(mail.subject);
    expect(en.subject).toMatch(/confirm/i);
    expect(en.text).toContain("If you did not sign up");
    expect(en.html).toContain('<html lang="en">');
  });
  it("contains the /en links", () => {
    for (const body of [en.text, en.html]) {
      expect(body).toContain(enConfirm);
      expect(body).toContain(enUnsub);
    }
  });
});
