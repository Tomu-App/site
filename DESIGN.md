---
name: Tomu
description: A shared list by link, shown as a note pinned to the fridge door.
colors:
  door: "#e2e8e5"
  door-dark: "#1a1f1e"
  door-deep: "#d3dbd7"
  door-deep-dark: "#232a28"
  door-ink: "#15204a"
  door-ink-dark: "#e7ecea"
  door-muted: "#3b4766"
  door-muted-dark: "#b1bcc6"
  slip: "#ffffff"
  slip-dark: "#dfe3e3"
  slip-rule: "#c4d1ec"
  slip-rule-dark: "#a9b6d0"
  slip-shadow: "rgb(21 32 74 / 0.18)"
  slip-shadow-dark: "rgb(0 0 0 / 0.55)"
  pen: "#1f3aa0"
  pen-soft: "#5a6ba8"
  pen-soft-dark: "#48578f"
  magnet: "#cf3427"
  magnet-dark: "#d9402f"
  magnet-light: "#ef6a5c"
  magnet-light-dark: "#f27a68"
  action: "#1f3aa0"
  action-dark: "#3553d6"
  action-hover: "#172d82"
  action-hover-dark: "#4562e0"
  action-ink: "#ffffff"
  field: "#ffffff"
  field-dark: "#262d2b"
  field-line: "#5f6b85"
  field-line-dark: "#8d99a6"
  ok: "#d9efe0"
  ok-dark: "#1d3a28"
  ok-ink: "#12462a"
  ok-ink-dark: "#c7ecd3"
  error: "#fbe0dd"
  error-dark: "#43201c"
  error-ink: "#7a1b12"
  error-ink-dark: "#ffd3cc"
  ring: "#cf3427"
  ring-dark: "#f27a68"
  selection: "#c4d1ec"
  selection-dark: "#3a4a7a"
typography:
  display:
    fontFamily: "Atkinson Hyperlegible Next Variable, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 1.3rem + 2.4vw, 3.1rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Atkinson Hyperlegible Next Variable, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.11
  title:
    fontFamily: "Atkinson Hyperlegible Next Variable, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
  body-large:
    fontFamily: "Atkinson Hyperlegible Next Variable, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "Atkinson Hyperlegible Next Variable, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Atkinson Hyperlegible Next Variable, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.56
  button:
    fontFamily: "Atkinson Hyperlegible Next Variable, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.2
  hand-title:
    fontFamily: "Kalam, Segoe Print, cursive"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: "2.75rem"
  hand-item:
    fontFamily: "Kalam, Segoe Print, cursive"
    fontSize: "1.6rem"
    fontWeight: 400
    lineHeight: "2.75rem"
  stamp:
    fontFamily: "Atkinson Hyperlegible Next Variable, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 700
    lineHeight: 1.5
rounded:
  paper: "2px"
  stamp: "3px"
  focus: "4px"
  check: "6px"
  control: "0.5rem"
  round: "9999px"
spacing:
  row: "2.75rem"
  row-compact: "2.5rem"
  gutter: "1.5rem"
  gutter-wide: "2.5rem"
  stack: "1.25rem"
  block: "3rem"
  section: "5rem"
  section-wide: "7rem"
  container: "72rem"
components:
  button-action:
    backgroundColor: "{colors.action}"
    textColor: "{colors.action-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0.75rem 2rem"
    height: "4rem"
  button-action-hover:
    backgroundColor: "{colors.action-hover}"
  button-action-on-slip:
    backgroundColor: "{colors.pen}"
    textColor: "{colors.action-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0.75rem 2rem"
    height: "4rem"
  button-action-on-slip-hover:
    backgroundColor: "{colors.action-hover}"
  input-field:
    backgroundColor: "{colors.field}"
    textColor: "{colors.door-ink}"
    typography: "{typography.body-large}"
    rounded: "{rounded.control}"
    padding: "0.875rem 1rem"
  checkbox-consent:
    backgroundColor: "{colors.field}"
    rounded: "{rounded.check}"
    size: "1.75rem"
  checkbox-consent-checked:
    backgroundColor: "{colors.action}"
  language-link:
    textColor: "{colors.door-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 1rem"
    height: "3rem"
  language-link-current:
    backgroundColor: "{colors.door-deep}"
    textColor: "{colors.door-ink}"
  door-panel:
    backgroundColor: "{colors.door-deep}"
    textColor: "{colors.door-ink}"
    rounded: "{rounded.control}"
    padding: "1rem 1.25rem"
  status-ok:
    backgroundColor: "{colors.ok}"
    textColor: "{colors.ok-ink}"
    rounded: "{rounded.control}"
    padding: "1rem 1.25rem"
  status-error:
    backgroundColor: "{colors.error}"
    textColor: "{colors.error-ink}"
    rounded: "{rounded.control}"
    padding: "1rem 1.25rem"
  slip:
    backgroundColor: "{colors.slip}"
    textColor: "{colors.pen}"
    rounded: "{rounded.paper}"
  magnet:
    backgroundColor: "{colors.magnet}"
    rounded: "{rounded.round}"
    size: "3.25rem"
---

# Design System: Tomu

## Overview

**Creative North Star: "The Note on the Fridge Door"**

Every page is a fridge door. The page ground is the door's enamel: cool grey-green by day, anthracite steel in the evening. Content that matters is paper pinned to the door with one red round magnet: a white slip, slightly tilted, written in ballpoint blue. Everything else is written straight onto the door in large, plain, highly legible type. There are two grounds and only two: door and slip.

The density is low and the type is big. The root size is 18px (`html { font-size: 112.5% }`), so every `rem` in this file is 18px, and older readers are a real audience. Atkinson Hyperlegible Next carries all UI text. Handwriting (Kalam) appears only as list content written on the demo slip. Light and dark both follow the OS setting through `prefers-color-scheme`. There is no theme switcher. Both modes target WCAG 2.2 AA.

Motion belongs to the pen alone. A new item writes itself in at ink speed, and a check and strike-through draw on. The finished item then slides down. The sequence plays once when the note scrolls into view, a replay control offers it again, and reduced motion shows the final state. Nothing else on the page moves.

The logo is a placeholder (`src/lib/assets/logo.svg`). The final logo will show a cloud, and it must sit directly on the door ground at the header's top left (rendered 3rem tall), with no plate or frame.

**Key Characteristics:**

- Two grounds: door enamel (page) and white paper slip (pinned content).
- One red: the magnet. It also marks the key in the link, the status dot, the focus ring and the caret.
- Ballpoint blue is both the ink on paper and the action color.
- 18px root, Atkinson Hyperlegible Next everywhere, Kalam only on the demo slip.
- Paper is tilted a little (-0.8deg to 1.6deg), has near-square corners (2px) and a soft drop shadow.
- Motion is ink drawing only: plays once, replay on request, static under reduced motion.

## Colors

The palette is a cool enamel door, white paper, blue ballpoint ink and one red magnet. Every color has a light and a dark value in `src/routes/layout.css`. In this file the plain key is the light value and the `-dark` key is the dark value. A key without a `-dark` twin stays the same in both modes.

### Primary

- **Ballpoint Blue** (`pen`, `action`): the ink. It colors all text on the slip and fills the primary button. In dark mode the door-level button brightens (`action-dark`) so it reads on anthracite. Pen ink on the slip stays the same, because the slip stays paper.
- **Pressed Ballpoint** (`action-hover`): the hover state for the action button.

### Secondary

- **Magnet Red** (`magnet`): the fridge magnet. It also colors the status dot before the "in development" line, the key part of the sample link, the key arrow, the text caret and, as `ring`, the focus outline. `magnet-light` is the lighter red used for the dark-mode focus ring.

### Neutral

- **Door Enamel** (`door`): the page ground on every route.
- **Door Panel** (`door-deep`): section rules (2px), the current-language pill, the translation notice and legal blockquotes. These are recesses in the door, not objects on it.
- **Door Ink** (`door-ink`): all text written directly on the door (headings, pitch, body, footer links).
- **Door Muted** (`door-muted`): secondary text on the door: the status line, consent text, captions and inactive language links.
- **Slip Paper** (`slip`): the pinned note. In dark mode it dims to `slip-dark` but stays light paper.
- **Slip Rule** (`slip-rule`): the ruled lines on the demo slip and the dividers between items on a pinned note.
- **Soft Ink** (`pen-soft`): done items and secondary text on paper.
- **Field / Field Line** (`field`, `field-line`): the input fill and its 2px stroke. `field-line` is also the default border color everywhere.
- **Ok / Error** (`ok`, `ok-ink`, `error`, `error-ink`): tinted status panels for the success message and form errors.
- **Selection** (`selection`): the text selection highlight.

### Named Rules

**The Door and Slip Rule.** A surface is either the door or paper pinned to it. New content goes on the door as type, or onto a slip held by a magnet. Never add a third surface such as a floating card, a panel with a border or a tinted section band.

**The Slip Stays Paper Rule.** In dark mode the door goes dark and the paper does not. The slip only dims to `slip-dark`, and ballpoint ink on it stays `pen`. A button placed on a slip uses `pen`, not the brighter door-level `action-dark`.

**The One Red Rule.** Red belongs to the magnet. Use it for magnets, the key, the status dot, the caret and the focus ring. Do not use it for buttons, headings or decorative fills. Red text on a slip must use a deeper red than `magnet` so it keeps at least 4.5:1 on `slip-dark` (the build uses #a3241a for the "Beispiel" stamp and #b4261a for the dark-mode key).

## Typography

**Display Font:** Atkinson Hyperlegible Next Variable (with system-ui, sans-serif)
**Body Font:** Atkinson Hyperlegible Next Variable (with system-ui, sans-serif)
**Handwriting Font:** Kalam 400 and 700 (with Segoe Print, cursive), demo slip only

Both families are self-hosted through `@fontsource`. Do not use a CDN.

**Character:** One sturdy, highly legible sans does all the talking, from the bold pitch down to the consent line. A single warm hand, Kalam, appears only where a person would actually write: on the list itself.

### Hierarchy

- **Display** (700, clamp(2.1rem, 1.3rem + 2.4vw, 3.1rem), 1.08, -0.015em): the homepage pitch only, max 20ch.
- **Headline** (700, 1.875rem on mobile, 2.25rem from 640px): section headings on the door, the single heading on confirm and unsubscribe notes (1.875rem), and legal page h1 (clamp(1.9rem, 1.4rem + 2vw, 2.5rem), 1.15).
- **Title** (700, 1.5rem, 1.25): headings inside a pinned note and legal h2.
- **Body Large** (400, 1.25rem): the status line, notes around the link, item text on pinned notes and the input value.
- **Body** (400, 1rem = 18px, 1.6): running text, legal copy (max 68ch), consent text, captions. Headings use `text-wrap: balance` and paragraphs use `text-wrap: pretty`.
- **Label** (600, 1.125rem): field labels and language links.
- **Button** (700, 1.375rem): the action button.
- **Hand Title / Hand Item** (Kalam 700 1.75rem / Kalam 400 1.6rem, line height locked to the 2.75rem rule row): the list title and items on the demo slip. Below 480px, items drop to 1.4rem on a 2.5rem row.
- **Stamp** (700, 0.8rem): the "Beispiel" sample stamp, the only text below 1rem.

### Named Rules

**The Handwriting Stays on the Slip Rule.** Kalam writes list content on the demo slip and nothing else. Headings, buttons, captions and other pinned notes use Atkinson.

**The 18px Floor Rule.** The root is 18px. Readable copy never goes below 1rem. The sample stamp (0.8rem bold, with its own border) is the only exception.

## Layout

The layout is one centered column, max 72rem wide, with 1.5rem side gutters (2.5rem from 640px). The header has the logo at left and the language links at right. The footer has its links above a 2px `door-deep` rule. Sections on the homepage are separated by 2px `door-deep` rules and 5rem of vertical padding (7rem from 1024px).

From 1024px the hero is a two-column grid (1.15fr / 1fr, 5rem gap). Pitch and signup sit stacked at left, and the note is pinned at right, offset down by 1.5rem. Below 1024px the order is pitch, signup, then note, so the action stays in the first screen. The note is never wider than 30rem and is centered.

Form controls stack with 1.25rem gaps, and the signup block is max 36rem wide. Confirm and unsubscribe pages are a single pinned note in a 36rem column. Legal pages are a 68ch column on the bare door.

The ruled row (`--row`, 2.75rem; 2.5rem below 480px) drives the slip's line pitch and the handwriting line height together, so text always sits on the rules.

## Elevation & Depth

Depth is physical. Only objects pinned to the door cast shadows. Type written on the door and recesses in the door (`door-deep` panels, fields, status messages) stay flat. The dark-mode shadow is black at 0.55 alpha so paper still lifts off anthracite.

### Shadow Vocabulary

- **Paper** (`box-shadow: 0 1px 2px var(--slip-shadow), 0 18px 32px -18px var(--slip-shadow)`): slips and pinned notes. The small link label uses a lighter cut (`0 14px 26px -16px`).
- **Magnet** (`box-shadow: inset 0 -3px 6px rgb(0 0 0 / 0.18), 0 2px 3px rgb(0 0 0 / 0.25), 0 8px 14px -6px rgb(0 0 0 / 0.35)`): the round magnet. The inset shade gives it its dome.
- **Button** (`box-shadow: 0 2px 5px rgb(0 0 0 / 0.16)`): a slight lift on the action button. Pressing it moves the button down 1px.

### Named Rules

**The Pinned Only Rule.** A shadow means "this is a thing stuck to the door". Do not put shadows on fields, notices, door panels or text.

## Shapes

Paper has near-square corners (2px) and sits slightly off-true: the demo slip at 1.6deg, other notes at -0.6deg to -0.8deg. The magnet counter-rotates so it stays level. Controls are gently rounded (0.5rem): buttons, inputs, language links and status panels. The consent box has a 6px radius, the stamp 3px. Magnets and the status dot are perfect circles. Hand-drawn SVG strokes (the wobbly checkbox outline, the check, the strike-through and the link arrows) use round caps and joins, and are the only drawn line work.

## Components

### Buttons

Big, blue and calm: one obvious action per screen.

- **Shape:** gently rounded (0.5rem), at least 4rem tall, 0.75rem 2rem padding, full width on mobile.
- **Primary:** `action` fill, white text, button type, slight lift shadow.
- **Hover / Focus:** hover darkens to `action-hover` over 160ms ease-out. Active presses down 1px. Focus shows a 3px `ring` outline offset 3px; on paper (anything inside `.slip`) the ring uses `pen` instead, because the dark-mode red ring falls to 2.1:1 on `slip-dark`. Disabled drops to 60% opacity with a progress cursor.
- **On a slip:** uses `pen` in both modes (see The Slip Stays Paper Rule).
- **Text action:** the replay control is a 3rem-tall underlined text button in `door-ink`. It stays invisible until the demo has finished.

### Cards / Containers

There are no cards. Containers are paper pinned with a magnet.

- **Corner Style:** 2px.
- **Background:** `slip`, with `pen` text and `pen-soft` secondary text.
- **Shadow Strategy:** Paper (see Elevation & Depth).
- **Border:** none. Items inside are divided by 2px `slip-rule` lines.
- **Internal Padding:** 2.75rem 2rem 2rem; 3rem 3rem 2.5rem from 640px. The magnet overlaps the top edge.

### Inputs / Fields

- **Style:** `field` fill, 2px `field-line` stroke, 0.5rem radius, 0.875rem 1rem padding, body-large text.
- **Focus:** the stroke shifts to `door-ink` and the 3px `ring` outline appears. Hover also shifts the stroke to `door-ink`.
- **Checkbox:** a custom 1.75rem box with a 2px stroke. When checked it fills with `action` and shows a white check.
- **Error / Success:** a tinted panel below the fields (`error` / `ok`, 0.5rem radius, semibold) announced with `role="alert"` / `role="status"`.

### Navigation

The language switcher shows plain links (Deutsch / English), each at least 3rem square. Inactive links use `door-muted` and turn to `door-ink` with an underline on hover. The current language sits on a `door-deep` pill. Footer links are underlined `door-ink` text at 1.125rem. Links use a 0.08em underline, thickening to 0.14em on hover.

### Demo Note (signature)

A white ruled slip held by a centered magnet, carrying a handwritten list under a red "Beispiel" stamp. On first view (50% visible) it plays this sequence:

1. At 900ms a new item writes in, revealed left to right over 1700ms.
2. At 3800ms the first item gets a drawn check (420ms) and strike-through (520ms).
3. At 4700ms that item is marked done, turns `pen-soft` and slides to the bottom (flip, 600ms).

The replay control appears at 5600ms. With reduced motion, the final state renders at once and the replay control is not shown. The list is `aria-hidden`, and a screen-reader summary describes the change instead.

### Magnet

A 3.25rem red dome with the Magnet shadow. It sits on the top edge of every pinned note (2.4rem on the small link label) and is always decorative (`aria-hidden`).

## Do's and Don'ts

### Do:

- **Do** put new content either straight on the door as Atkinson type or on a 2px-cornered slip held by one magnet.
- **Do** keep the slip light in dark mode (`slip-dark`) and keep ballpoint ink on it unchanged.
- **Do** keep readable text at 1rem (18px) or larger, and keep every pairing at WCAG 2.2 AA in both modes.
- **Do** keep the action in the first screen on mobile: pitch, signup, then the note.
- **Do** give every animation a reduced-motion end state and play signature motion once, with a replay control.
- **Do** keep the logo replaceable in one file. It sits on the door ground, at 3rem tall.

### Don't:

- **Don't** use Kalam or any handwriting outside list content on the demo slip.
- **Don't** add a third surface: no floating cards, bordered panels or tinted section bands.
- **Don't** use red for buttons, headings or fills. Red belongs to the magnet, the key, the status dot, the caret and the focus ring.
- **Don't** add cream tints, grain or noise. The only surface pattern is the ruled lines on the demo slip.
- **Don't** put shadows on anything that isn't pinned to the door.
- **Don't** loop motion or animate anything other than the pen.
- **Don't** add a theme switcher. The mode follows the OS.
