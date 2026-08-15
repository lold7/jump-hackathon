---
name: modernist-ds
description: The design system for this project (Modernist — Swiss/International Typographic style, zero-radius, Archivo 800, red-orange accent). Use whenever building, editing, extending, or reviewing ANY screen, page, component, or UI in this repo. This system already exists and is the source of truth — extend it, never redesign it.
---

# Modernist — Project Design System

This project has a finished visual identity. Your job is to **extend it**, not
to improve it, modernize it, or apply your own taste. Every choice below is
deliberate. If something looks "wrong" or "dated" to you, it is intentional.

## Before writing any UI

1. Read `_ds/modernist-<id>/styles.css` — it is the source of truth for tokens
   and component classes.
2. Look at the two or three screens nearest to what you are building and copy
   their structure, spacing, and markup conventions.
3. State in one line which existing patterns you are reusing. Then build.

**Never** invent a token, a size, or a component pattern when an existing one
is close enough. Reuse beats invention.

---

## Direction

- **Personality:** Swiss / International Typographic. Editorial, dense,
  high-contrast, unapologetically flat.
- **Depth strategy:** borders and rules, not shadows. Hierarchy comes from
  weight, size, and 2px lines — not from elevation or color washes.
- **Corners:** square. Everywhere. No exceptions.

---

## Tokens — use the variable, never the literal

Always `var(--color-accent)`, never `#ec3013`. If a value you want has no
token, you are probably about to break the system — use the nearest token.

### Color

| Role | Token | Use for |
|---|---|---|
| Page background | `--color-bg` (`#f3f2f2`) | app background, sheet background |
| Raised surface | `--color-surface` (`#eae9e9`) | inputs, `.card` |
| Text | `--color-text` (`#201e1d`) | all body and heading text |
| Accent fill | `--color-accent` (`#ec3013`) | primary buttons, capture button, focus rings, scan-frame corners |
| Accent text | `--color-accent-700` | accent-colored **text and icon strokes** on light backgrounds |
| Selected row | `--color-accent-100` | active nav item, selected list row |
| Divider | `--color-divider` | all rules and borders |
| Ramps | `--color-neutral-100…900`, `--color-accent-100…900`, `--color-accent-2-100…900` | tints, placeholder blocks |

Muted text is not a token — it is written inline as
`color-mix(in srgb, var(--color-text) 55%, transparent)`.
Use **55%** for secondary/meta text, **62%** for body paragraphs under a
heading, **18%** for light row dividers. Match those numbers exactly.

Hard-coded hex is allowed in exactly one situation: full-bleed dark overlays
that are not part of the light theme (the camera view uses `#141312` /
`#211f1e` / `#fff`). Nowhere else.

### Type

- One family for everything: `--font-heading` / `--font-body` = Archivo +
  Noto Sans Thai. Never introduce a second typeface.
- Headings and any emphasized label: `font-family: var(--font-heading);
  font-weight: 800`. There is no 600-weight heading in this system.
- Heading letter-spacing: `-0.01em` to `-0.015em`. Line-height `1.12`–`1.35`.
- Body: 14px / line-height 1.65. Meta and captions: 11–13px.
- `h6` is a rule, not a heading: uppercase, `letter-spacing: 0.08em`, ~12px.
  Use it for section labels.

### Space

`--space-1: 4px` · `--space-2: 8px` · `--space-3: 12px` · `--space-4: 16px` ·
`--space-6: 24px` · `--space-8: 32px`

Screen padding is `16px` horizontal. Vertical rhythm between blocks is
20–26px. Stay on the 4px grid.

### Radius

`--radius-sm` / `--radius-md` / `--radius-lg` are **all `0px`**. This is the
single most identity-defining property of the system. Do not add
`border-radius` to anything. The one exception already in the design is the
`.radio` dot, which is a circle.

### Elevation

`--shadow-sm/md/lg` exist but are used sparingly — `.dialog` only. Do not add
shadows to cards, buttons, headers, or sheets. Use a border instead.

---

## Component classes (already written — use them)

`.btn` `.btn-primary` `.btn-secondary` `.btn-ghost` `.btn-icon` `.btn-block` ·
`.field` `.input` `.radio` `.seg` `.seg-opt` · `.card` `.card-kicker`
`.card-title` `.card-body` `.card-meta` · `.tag` `.tag-accent` `.tag-accent-2`
`.tag-neutral` `.tag-outline` · `.nav` `.nav-brand` · `.table` · `.dialog`
`.dialog-backdrop` `.dialog-title` `.dialog-body` `.dialog-actions` · `.hr` ·
`.elev-sm/md/lg` · `.text-muted` · `.grayscale`

Write the class first, then add inline style only for size and layout
overrides. Do not re-implement a button from scratch.

---

## Established patterns — copy these exactly

**Buttons are left-aligned.** Full-width buttons in this app use
`justify-content: flex-start` with `padding-inline: 16px`. Do not center
button labels. Primary action height 50–52px, secondary 48px.

**Icons.** Inline SVG, `viewBox="0 0 24 24"`, `fill="none"`,
`stroke="currentColor"`, `stroke-linecap="square"`, stroke-width 2–2.2 (1.6
for large decorative icons). Square linecaps are part of the identity — never
`round`. Do not import an icon library.

**Section header.** Row with `border-bottom: 2px solid var(--color-divider)`,
`padding-bottom: 8px`, an `h6` label on the left and an 800-weight count on
the right.

**List rows.** `padding: 12px 0`, separated by
`border-bottom: 1px solid color-mix(in srgb, var(--color-text) 18%, transparent)`.
Thumbnail block on the left (`--color-neutral-200` fill, 1px divider border),
name at 14px/600, meta at 12px muted, 44×44 icon button on the right.

**Structural rules are 2px; row separators are 1px.** Headers, footers, and
section boundaries get 2px. Items within a list get 1px.

**Touch targets are 44×44 minimum**, with negative margin
(`margin-left: -10px`) to keep optical alignment at screen edges.

**Screen shell.** `display:flex; flex-direction:column; height:100%;
position:relative; overflow:hidden` — fixed header, scrolling middle
(`flex:1; overflow:auto`), fixed action footer.

**Overlays** are `position:absolute; inset:0` siblings inside the screen root,
with z-index 40 (menu), 50 (camera / sheet), 60 (success). Bottom sheets have
`border-top: 2px solid var(--color-text)` — heavier than a normal divider.

**Selected state** = `--color-accent-100` background. Not a checkmark alone,
not a border change.

---

## Template runtime (`x-dc`)

Screens are `.html` files, not React. Structure:

- `<x-dc>` root, `<helmet>` for stylesheet and font links.
- `{{ expr }}` for interpolation, `<sc-if value="{{ flag }}">`,
  `<sc-for list="{{ items }}" as="item">`.
- Logic in `<script type="text/x-dc" data-dc-script>` as
  `class Component extends DCLogic` with a `state` field and `renderVals()`
  returning every value and handler the template references.
- Handlers are returned from `renderVals()` and bound as `onClick="{{ fn }}"`.

Keep `hint-placeholder-val` / `hint-placeholder-count` attributes on `sc-if`
and `sc-for` — the editor uses them.

`ios-frame.jsx` is a vendored starter marked `@ds-adherence-ignore`. It uses
raw hex and Apple system fonts by design. Do not "fix" it and do not copy its
conventions into project screens.

---

## Language

UI copy is Thai. Headings are sentence-style and plain-spoken, not marketing
voice. Keep `aria-label` in Thai too. Latin product names stay Latin
(`SchoolBackoffice AI`).

---

## Do NOT

- Add `border-radius` to anything.
- Add shadows, gradients, glows, blur, or glassmorphism.
- Introduce a color outside the tokens — including "just a lighter gray".
- Introduce a second typeface, or use font-weight 500/600/700 for headings.
- Center button labels or center-align body text.
- Swap square-linecap icons for rounded ones, or add an icon library.
- Add animation or transitions unless explicitly asked.
- Convert screens to React/Tailwind/a component framework.
- Refactor or "clean up" `styles.css` while doing feature work.
- Restyle existing screens while adding a new one. Touch only what was asked.

## When you genuinely need something new

Say so before building it. Propose it in terms of the existing system —
"a status pill; closest existing pattern is `.tag`, I'd add a
`.tag-warning` using `--color-accent-2-100` / `-800`" — and wait for a
decision. Then add it to `styles.css` as a token-based class, not as a
one-off inline style, and note it here.
