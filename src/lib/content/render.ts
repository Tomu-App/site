import MarkdownIt from "markdown-it";
import { requireProdConfig } from "../build-mode";
import legal from "./legal.json";

const values: Record<string, string> = {
  businessName: legal.businessName,
  name: legal.name,
  address: legal.addressLines.join("  \n"), // two trailing spaces = markdown line break
  email: legal.email,
};

// Raw HTML in the markdown stays disabled (default); content is own repo files.
const md = new MarkdownIt({ linkify: false, breaks: true });

// External links open in a new tab.
const defaultLinkOpen =
  md.renderer.rules.link_open ??
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const href = String(tokens[idx].attrGet("href") ?? "");
  if (/^https?:\/\//.test(href)) {
    tokens[idx].attrSet("target", "_blank");
    tokens[idx].attrSet("rel", "noopener noreferrer");
  }
  return defaultLinkOpen(tokens, idx, options, env, self);
};

/** Renders trusted repo markdown at build time, filling `{{name}}`, `{{address}}`, `{{email}}` from legal.json. */
export function renderLegalMarkdown(source: string): string {
  const filled = source.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    if (!(key in values)) throw new Error(`Unknown legal placeholder: ${key}`);
    return values[key];
  });
  if (requireProdConfig) {
    const left = filled.match(/\[[A-ZÄÖÜ_ -]{3,}\]/);
    if (left) throw new Error(`Unfilled placeholder in legal content: ${left[0]}`);
  }
  return md.render(filled);
}
