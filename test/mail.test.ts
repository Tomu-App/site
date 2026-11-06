import { describe, expect, it } from "vitest";
import { buildConfirmationMail } from "../src/lib/server/mail";

const confirmUrl = "https://tomu.foo/bestaetigen?token=abc.def.ghi";
const unsubscribeUrl = "https://tomu.foo/abmelden?token=xyz.uvw.rst";
const mail = buildConfirmationMail({
  to: "oma@example.de",
  from: "hallo@tomu.foo",
  confirmUrl,
  unsubscribeUrl,
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
});
