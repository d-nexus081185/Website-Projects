---
version: 1.0
name: Veridale Health
description: >
  Warm editorial design system for Veridale Health, an outpatient psychiatric
  practice in Modesto, California. A cream "paper" canvas, Fraunces serif
  headlines at regular weight, Satoshi body text, colour-blocked surfaces and
  hairline rules instead of shadowed cards. The full brand palette (navy, teal,
  turquoise, wellness green, healing purple) is kept; wellness green is the
  dominant accent and the only filled button colour. Light and dark themes.
source-of-truth: styles.css  # tokens live in :root; this file explains them

colors:
  # Brand (fixed; never change between themes when used as backgrounds)
  navy: "#0C2E64"            # var(--c-navy) for backgrounds, var(--navy) for text
  teal: "#055A7E"            # var(--c-teal) for backgrounds, var(--teal) for text
  turquoise: "#099292"
  wellness-green: "#2A8362"  # dominant accent, every filled button
  wellness-green-dark: "#1F6B4F"  # links, hover, green text on cream
  healing-purple: "#483785"
  # Neutrals, light theme
  canvas: "#FAF7F0"          # --bg
  surface: "#FFFDF8"         # --surface: inputs, raised panels
  tint: "#F3EEE3"            # --tint: cream bands and colour-block cards
  tint-2: "#E9E2D4"          # --tint-2: stronger cream
  ink: "#0E1D33"             # --ink: headings
  ink-2: "#413E38"           # --ink-2: running text
  ink-3: "#6B675E"           # --ink-3: muted text, numerals, captions
  line: "#E6DECF"            # --line: hairlines
  line-strong: "#D5CAB6"     # --line-strong: list rules, ghost-button borders
  field-border: "#857E70"    # form controls (3.6:1 on surface)
  danger: "#B42318"
  danger-bg: "#FEF3F2"
  # Neutrals, dark theme ([data-theme="dark"])
  dark-canvas: "#0A1320"
  dark-surface: "#101C2C"
  dark-tint: "#0D1826"
  dark-tint-2: "#1A2940"
  dark-ink: "#EDF2F8"
  dark-ink-2: "#B9C5D4"
  dark-ink-3: "#8F9DB1"
  dark-line: "#213149"
  dark-navy-text: "#DCE7F5"  # --navy is remapped to a light text colour in dark mode
  dark-teal-text: "#6CC7D9"
  dark-green-text: "#74D3A8"
  # Condition pastels (condition index only): swatch / accent pairs
  pastel-coral: ["#F6C5B9", "#9A3B22"]
  pastel-blue: ["#B9DCE9", "#11577A"]
  pastel-yellow: ["#F4DF9B", "#775700"]
  pastel-purple: ["#D7C9E8", "#5B3F8C"]
  pastel-green: ["#C4DFC9", "#2A6B3E"]
  pastel-orange: ["#F3C99D", "#8A4A0F"]
  pastel-teal: ["#B9DFD7", "#0E6B5C"]
  pastel-pink: ["#EDC7D8", "#8E2F5C"]

typography:
  display: '"Fraunces", "Iowan Old Style", "Palatino Linotype", Georgia, serif'
  body: '"Satoshi", "Manrope", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
  script: '"Mrs Saint Delafield"'   # founder signature on the About page only
  h1-hero: { size: "clamp(2.5rem, 1.45rem + 3.1vw, 4rem)", weight: 400, lineHeight: 1.02, tracking: "-0.035em" }
  h1-page: { size: "clamp(2.4rem, 1.6rem + 3.4vw, 4.25rem)", weight: 400, tracking: "-0.032em" }
  h2: { size: "clamp(2rem, 1.35rem + 2.6vw, 3.375rem)", weight: 400, lineHeight: 1.06, tracking: "-0.028em" }
  h3-serif: { size: "1.35rem–1.6rem", weight: 400, tracking: "-0.015em" }   # list and card titles
  h3-sans: { size: "clamp(1.125rem, 1.08rem + .25vw, 1.25rem)", weight: 700, tracking: "-0.012em" }
  lead: { size: "clamp(1.0625rem, 1rem + .4vw, 1.3125rem)", lineHeight: 1.6 }
  body: { size: "clamp(1rem, .96rem + .2vw, 1.0625rem)", lineHeight: 1.65 }
  small: { size: "0.9375rem" }
  eyebrow: { family: display, style: italic, weight: 400, size: "clamp(1rem, .95rem + .25vw, 1.125rem)", case: sentence }

spacing:
  gutter: "clamp(1rem, .5rem + 2.5vw, 2rem)"
  section-y: "clamp(4.5rem, 2.75rem + 7vw, 9rem)"
  container: 1200px          # header spans full width
  header-height: "76px (68px at ≤1320px)"

rounded:
  sm: 10px
  md: 14px       # --radius
  lg: 20px       # --radius-lg
  xl: 28px       # --radius-xl
  button: 12px   # 10px small, 14px large
  pill: 999px    # pills, chips, jump links only

shadows:  # warm-tinted, used sparingly
  sm: "0 1px 2px rgba(62,46,22,.06)"
  md: "0 1px 2px rgba(62,46,22,.05), 0 14px 34px -18px rgba(62,46,22,.22)"
  lg: "0 2px 6px rgba(62,46,22,.05), 0 30px 60px -28px rgba(62,46,22,.32)"

motion:
  ease: "cubic-bezier(.22, .61, .36, 1)"
  ease-out: "cubic-bezier(.16, 1, .3, 1)"
  reveal: "opacity + 22px rise, .8s ease-out, 70ms stagger between siblings"
---

# Veridale Health design system

This file describes how Veridale Health should look and feel, so new pages
stay consistent with the rest of the site. The code is the source of truth:
every token below is a CSS custom property in `styles.css` (`:root`, with dark
overrides under `[data-theme="dark"]`). If this file and the CSS disagree,
the CSS wins; update this file.

## 1. Visual theme and atmosphere

Calm, literate, human. The site should feel like a thoughtfully printed
practice brochure, not a SaaS landing page. People arriving here may be
anxious, so the design avoids anything loud: generous white space, a warm
cream canvas, serif headlines at regular weight, and slow, gentle motion.

- **Canvas:** warm cream `#FAF7F0`, never pure white or cool grey.
- **Voice of the type:** Fraunces serif for headlines and section labels,
  Satoshi for everything you read or tap.
- **Depth:** comes from colour blocks (cream on cream, navy bands) and 1px
  hairlines, not from shadows.
- **Texture:** a very faint grain sits over the whole page (`body::after`).
- **Rhythm:** cream sections alternate with cream-tint bands; a navy band
  ("A safe space to begin") and the navy footer close each page.

## 2. Colour palette and roles

All brand colours are kept. Use them with these roles:

| Colour | Role |
|---|---|
| Wellness green `#2A8362` | The accent. Every filled button, active states, checkmarks, progress. |
| Green dark `#1F6B4F` | Links and green text on cream (keeps 4.5:1 contrast). Section labels. |
| Navy `#0C2E64` | Headline ink, the emergency bar, navy bands, the footer, featured cards. |
| Teal `#055A7E` / turquoise `#099292` | Secondary accents: icons, credential lines, soft background glows. |
| Healing purple `#483785` | Rare. The faith-informed care card and some icon gradients. |
| Condition pastels | Only in the conditions index (home) as 42px swatches. Each has a darker accent for its icon. |
| Danger `#B42318` | Emergency and safety messaging only. |

**Two naming rules that matter:**

- `--navy` and `--teal` are *text* colours. In dark mode they turn light so
  headings stay readable. For a navy or teal **background**, always use the
  fixed `--c-navy` / `--c-teal`, which never change.
- Use tokens (`var(--ink-2)`, `var(--line)`), not raw hex, so dark mode keeps
  working. If you must hard-code a light colour, add a
  `[data-theme="dark"]` counterpart.

## 3. Typography

- **Fraunces** (Google Fonts, variable, optical sizing): h1, h2, card and list
  titles, section labels, pull quotes, the footer mission line.
  - Always weight **400** for headlines, with **negative tracking**
    (−0.015em to −0.035em; larger size, tighter). Never bold serif.
  - Italic is used for emphasis lines ("Centered on You.", "You matter."),
    section labels, and index numerals (01, 02 …).
- **Satoshi** (Fontshare, weights 400/500/700): body, navigation, buttons,
  form labels, captions. Headings in Satoshi (h3 in dense panels) use 700.
- **Section labels ("eyebrows")** are short, sentence-case, italic Fraunces in
  green-dark with a 32px hairline before them: *— Who we are*. Do not use
  spaced uppercase labels for new sections. The few remaining uppercase
  micro-labels (contact field labels, footer column titles) are fine where
  they already exist.
- Paragraphs: max ~65 characters wide; `text-wrap: pretty` on body,
  `balance` on headings (set globally).

## 4. Components

### Buttons (the green-or-white rule)

Every button on the site is either **green** or **white**. No navy, yellow,
outline-only or transparent buttons.

| Class | Look | Use |
|---|---|---|
| `.btn--primary` | Green fill, white text | The main action in any group. |
| `.btn--zocdoc` | Green fill (same as primary) | Links to the Zocdoc booking page. |
| `.btn--ghost` | White fill, navy text, hairline border | Secondary action on cream. |
| `.btn--light` | White fill, navy text | Secondary action on navy bands and the footer. |
| `.btn--outline-light` | Green fill | Pairs with a white button on navy bands (the name is historical). |
| `.btn--emergency` | White fill, red text | "Call 911" only. |

- Radius 12px (10px `.btn--sm`, 14px `.btn--lg`). Minimum height 48px.
- Pair one green with one white; never two greens side by side.
- Zocdoc links open in a new tab with
  `<span class="visually-hidden"> (opens in a new tab)</span>` and carry
  `data-zocdoc`. The yellow Zocdoc logo/mark may appear inside or beside a
  button, but the button itself stays green or white.

### Section head

`.section-head` with `.eyebrow`, `h2`, and optional `.section-head__lead`.
Left-aligned. At ≥1001px it becomes a two-column grid: label and headline on
the left, lead paragraph bottom-aligned on the right. Don't centre new
section heads.

### Lists instead of card grids

Prefer editorial lists with hairline rules over grids of equal white cards:

- **Numbered list** (`.value-grid` / `.value-card`): 1px `--line-strong` top
  rule per item, serif title, italic serif counter (01–06) top right; the
  rule turns green on hover.
- **Two-column list** (`.service-grid` / `.service-card`): icon square on the
  left, serif title and text on the right, top hairline per row.
- **Index rows** (`.cond-tiles` / `.cond-tile`): numeral, pastel swatch,
  serif title, arrow; rows share a height across both columns and tint with
  their pastel on hover.

### Surfaces and cards

- Cream colour block: `background: var(--tint)`, no border, no shadow (provider
  pane, quotes, notices).
- Raised panel: `background: var(--surface)` + `1px solid var(--line)`, no
  shadow (forms, condition groups, testimonials, info panels).
- Featured: navy (`--c-navy`) with a soft teal glow; white/pale text (the first
  testimonial, the "You matter" card, navy bands).
- Shadows (`--shadow`, `--shadow-lg`) only for things that float: the Zocdoc
  strip overlapping the hero, the provider photo, modals, the header once
  scrolled.

### Other patterns

- **FAQ:** `.accordion` as a hairline list; questions in serif 400; the
  emergency question uses `.accordion__item--alert` (red).
- **Testimonials:** featured navy quote beside two lighter ones on desktop;
  swipe carousel with dots on phones. Attribute as "Veridale Health patient"
  unless a patient has consented to more.
- **Forms:** `.request-form` + `.field` (labels above inputs, 50px inputs,
  12px radius, inline errors, a hidden `_honey` spam field). Submissions go
  through FormSubmit to support@veridalehealth.com. Every form must tell
  people not to include medical or personal health details.
- **Notices:** `.notice` (cream) for scope statements; `.notice--scope`
  (soft green) for "not every condition is appropriate…".
- **Chips:** `.chip` pills on cream; `.chip--green` / `.chip--teal` variants.

## 5. Layout principles

- Container max 1200px with `--gutter` side padding; the header spans the full
  window width.
- Vertical rhythm: `--section-y` (72–144px) between sections. Be generous.
- Prefer asymmetric splits (1.15fr / .85fr, 1.2fr / 1fr) over equal columns.
- Grids: CSS Grid with `minmax(0, 1fr)` columns.
- Every page has, in order: skip link, emergency bar, sticky header,
  `<main id="main">`, closing navy band (CTA), footer (emergency card, brand,
  links, services index line, bottom bar), WhatsApp widget, legal modal.

## 6. Depth and elevation

| Level | Treatment | Examples |
|---|---|---|
| Flat | Canvas only | Section bodies, hero |
| Hairline | 1px `--line` / `--line-strong` | Lists, inputs, panels |
| Colour block | `--tint` or navy fill | Provider pane, quotes, bands |
| Floating | `--shadow` / `--shadow-lg` (warm tinted) | Zocdoc strip, provider photo, modals |

Grain overlay: fixed, `pointer-events: none`, opacity .045 (multiply) in light,
.05 (screen) in dark.

## 7. Motion

- Content reveals on scroll with `data-reveal` (fade + 22px rise, staggered
  70ms among siblings). Add `data-reveal` to new blocks; script.js handles it.
- Page-to-page navigation cross-fades (View Transitions; older browsers load
  normally).
- Header hides on scroll down and returns on scroll up; a green reading-progress
  line runs under it.
- Home intro (index.html only): 5 seconds on every load; background travels
  navy → green → the page canvas while a progress ring fills; the curtain then
  lifts to reveal the page.
- WhatsApp button: "TALK TO A MENTAL HEALTH SPECIALIST" text slowly orbits it
  (18s per turn), transparent background.
- Everything respects `prefers-reduced-motion`: decorative motion stops,
  progress cues (ring, intro colour change) keep their timing.

## 8. Responsive behaviour

| Width | Changes |
|---|---|
| ≤1440px | Header phone number collapses to an icon. |
| ≤1320px | Navigation moves into the menu button panel; social icons leave the header. |
| ≤1000px | Hero, split sections, FAQ and footer stack; section heads stop splitting; index rows go to one column. |
| ≤720px | Phone layout: single columns, full-width buttons in groups, sticky "Book on Zocdoc / Call" bar after the hero, testimonial carousel, bottom-sheet modals. |
| ≤380px | Header phone icon hidden. |

Touch targets are at least 44×44px. The layout must work at 320px with no
horizontal scrolling.

## 9. Do's and don'ts

**Do**

- Anchor every page on the cream canvas and use tokens for every colour.
- Use Fraunces 400 with negative tracking for headlines; go bigger, not bolder.
- Keep buttons green or white.
- Keep the emergency message on every page: the top bar, the footer emergency
  card, and 911 wording wherever people might reach out for help.
- Write plain, calm, specific copy in the practice's voice ("We take the time
  to understand…"). Sentence case for new headings.
- Add a `[data-theme="dark"]` rule for any hard-coded light colour.
- Test light, dark, phone width and reduced motion.

**Don't**

- Don't use pure white or cool grey page backgrounds, or bold serif headlines.
- Don't build rows of identical white cards with drop shadows.
- Don't add new button colours (navy, yellow, outline-only).
- Don't use spaced uppercase section labels for new sections.
- Don't use purple/blue "AI gradient" blobs as decoration.
- Don't present testimonials, credentials or photos as real unless they are.
- Don't collect health information in website forms.

## New page checklist

When adding a page, copy an existing inner page (about.html is the simplest)
so you inherit:

1. The `<head>`: the inline theme script (sets `data-theme` before paint),
   Google Fonts (Fraunces) and Fontshare (Satoshi) links, `styles.css`,
   canonical/OG tags, and JSON-LD where relevant.
2. The icon sprite, skip link, emergency bar and header (set
   `aria-current="page"` on the matching nav link).
3. A `.page-hero` with breadcrumb, eyebrow, h1 and lead.
4. Sections using the patterns above, each with `aria-labelledby`.
5. The closing navy band, the shared footer, WhatsApp widget, legal modal,
   and `<script src="script.js" defer>` (use `/script.js` and absolute asset
   paths on pages served from other paths, like 404.html).

## Agent prompt guide

When asking an AI assistant to build on this site, include:

> Follow DESIGN.md and reuse the classes and tokens in styles.css. Warm cream
> canvas, Fraunces 400 headlines with negative tracking, Satoshi body, italic
> serif section labels, hairline lists instead of card grids, green-or-white
> buttons only, light and dark themes, `data-reveal` on new blocks, and the
> emergency messaging on every page.
