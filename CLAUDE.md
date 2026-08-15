# SchoolBackoffice AI — Prototype

AI document processing for Thai school finance, procurement, payment and asset
work. Teachers photograph paperwork; AI reads it, classifies it, links it to a
project and funding source, validates it, and exports structured data.

## What this project IS

A **clickable prototype for a hackathon demo.** Mobile-shaped UI running in a
browser. There is no backend, no real OCR, no database, no auth. Every screen
runs on hardcoded fixture data and local component state.

Judge every technical decision against one question: *does this make the demo
read better in three minutes?* If not, do not build it.

## What this project is NOT

- Not a production system. Do not add a backend, API layer, database, ORM,
  auth library, state manager, router, or build step.
- Not a React app. Screens are `.html` files on the `x-dc` runtime.
- Not a place for real credentials, real school data, or real API endpoints.

---

## Stack

- Plain HTML + CSS, no build step.
- `x-dc` template runtime (`support.js`): `{{ }}` interpolation, `<sc-if>`,
  `<sc-for>`, and a `class Component extends DCLogic` with `state` and
  `renderVals()`.
- Design system: `_ds/modernist-<id>/styles.css` (tokens + component classes).
- `ios-frame.jsx` — vendored device frame, marked `@ds-adherence-ignore`. Do
  not edit it, do not copy its conventions.

Run locally:

```bash
python -m http.server 8000 --bind 127.0.0.1
```

---

## Read these before building

| When | Read |
|---|---|
| Any UI work at all | `.claude/skills/modernist-ds/SKILL.md` — **binding** |
| Building a specific screen | `docs/spec.md`, that screen's section only |
| Matching an existing pattern | `ScanScreen.dc.html` — the reference screen |

`docs/spec.md` is the product spec. Read the section for the screen you are
building. Do not read it end to end and do not build screens you were not
asked for.

---

## Non-negotiables

**UI copy is Thai.** The spec is written with English headings for the author's
convenience — those are labels for *him*, not UI text. Every string the user
sees ships in Thai. `aria-label` too. Latin product names stay Latin
(`SchoolBackoffice AI`, `CHQ-008421`, `SCI-000234`).

**Mobile layout.** Every screen is a phone screen: fixed header, scrolling
middle, fixed action footer, overlays as absolutely-positioned siblings. Where
the spec describes a two-column desktop layout (Screen 3 — AI Review), build it
as a mobile screen instead: preview on top, extracted fields scrolling below.
Ask before inventing a different resolution.

**Design at 390×844.** Every screen is authored to fit a 390px-wide,
844px-tall viewport — that is the canvas, not a breakpoint. The root element
uses `height:100%` inside a fixed-size box; never `100vw`/`100vh`, never a
max-width container, never a media query. Open `preview.html` to see screens
side by side at true size. The iOS device frame is added once at the end and
is not your concern while building.

**The design system is fixed.** Read `modernist-ds` and follow it. Zero border
radius, Archivo 800 headings, square icon linecaps, left-aligned buttons,
2px structural rules. Do not restyle existing screens while adding new ones.

**One screen per task.** Build the screen you were asked for. Do not
scaffold ahead, do not refactor neighbours, do not touch `styles.css` during
feature work.

---

## Canonical demo data

Every screen must show the *same* transaction so the demo hangs together. When
a screen needs an example, use this one. Do not invent new numbers.

| Field | Value |
|---|---|
| Document | `DOC-0012` · ใบเสร็จ · `INV-0012` · 14/08/2026 |
| Vendor | ร้านสมใจ |
| Project | โครงการจัดซื้อวัสดุห้องวิทยาศาสตร์ (`SCI-2026-024`) |
| Funding source | เงินอุดหนุน |
| Disbursement | บจ. · ครั้งที่ 3 / 5 |
| Item | กล้องจุลทรรศน์ · 1 หน่วย · ฿8,500 |
| Asset | ครุภัณฑ์ · ครุภัณฑ์วิทยาศาสตร์ · `SCI-000234` |
| Payment | เช็ค · `CHQ-008421` · ธนาคารตัวอย่าง · 14/08/2026 |
| Batch totals | 12 เอกสาร · 8 ใบเสร็จ · 8 การเบิกจ่าย · 7 ครุภัณฑ์ · ฿40,980 |
| User | ครูเบญจมาศ · โรงเรียนตัวอย่าง |

Confidence values shown in the demo: project match 94%, funding source 93%,
asset classification 94%, handwriting warning 72%.

---

## Presenting AI behaviour

Never show a bare extracted value. Every AI-produced field carries its
confidence and stays editable — that is the product's core claim, and a field
that looks like a locked database read undercuts it.

Confidence bands used across screens:

- **≥ 80%** — show the value with its confidence, editable.
- **< 80%** — show the value flagged, and require explicit user confirmation
  before it can be exported.

Validation severity maps to color: critical uses `--color-accent`, warnings use
`--color-accent-2`. Never introduce a green "success" color — verified states
are shown with a checkmark in `--color-text` or `--color-accent`, per the
existing success screen.

---

## Conditional UI

These branches are the demo's proof that the system understands documents
rather than just reading them. Get them right.

- Payment method **เช็ค** → cheque number (required), date, bank, amount, status
- Payment method **เงินสด** → payment date and amount only
- Payment method **เงินโอน** → bank, account, transaction reference, transfer date
- Payment method **บัญชีธนาคาร** → bank name, account name, account number, date, amount
- Disbursement type **อื่น ๆ** → free-text "ระบุประเภทการเบิกจ่าย"
- Asset type **ครุภัณฑ์** → category, asset ID, location, responsible person, QR
- Asset type **วัสดุ** → no asset ID, no registration

Validation rules the demo must visibly enforce: cheque number required when
paying by cheque; cheque numbers unique; asset IDs unique; disbursement count
not already used for that project; quotation / receipt / disbursement / payment
amounts must agree.

---

## Screen inventory

Spec sections in `docs/spec.md`. Build order follows demo order.

| # | Screen | Status |
|---|---|---|
| 0 | Login + API number verification | **built** — `LoginScreen.dc.html` |
| 0b | OTP verification | **built** — `OtpScreen.dc.html` |
| 1 | Scan documents | **built** — `ScanScreen.dc.html` |
| 2 | AI processing | **built** — `ProcessingScreen.dc.html` |
| 3 | AI review (the centrepiece) | **built** — `ReviewScreen.dc.html` |
| 4 | Smart categorization | **built** — `CategorizeScreen.dc.html` |
| 5 | Disbursement review | **built** — `DisbursementScreen.dc.html` |
| 6 | Payment validation | **built** — `PaymentScreen.dc.html` |
| 7 | Cross-document validation | **built** — `CrossDocScreen.dc.html` |
| 8 | Asset classification | **built** — `AssetClassifyScreen.dc.html` |
| 9 | Asset registration | **built** — `AssetRegisterScreen.dc.html` |
| 10 | Validation center | **built** — `ValidationScreen.dc.html` |
| 11 | Export | **built** — `ExportScreen.dc.html` |

Screens navigate via `flow.js` — handlers call `go('review')`, never a raw
`location.href`. Add a screen to the map there and to the `SCREENS` list in
`preview.html` when it lands.

The demo runs 0 → 0b → 1 → 2 → … → 11 on footer buttons alone. Three gates
must be cleared by hand, and they are the point of the demo: six OTP digits,
the 72% handwriting field on Screen 3, and the ฿450 mismatch on Screen 7.
Screen 8's วัสดุ branch skips Screen 9 and goes straight to Screen 10.

Update the status column when a screen lands.

---

## Naming

- Screens: `<Name>Screen.dc.html` — matches `ScanScreen.dc.html`. The `.dc.html`
  suffix is load-bearing: the runtime derives the component name by stripping it.
- State keys and handlers: camelCase, verbs for handlers (`openCamera`,
  `addPicked`, `closeAll`).
- Every value and handler referenced in a template must be returned from
  `renderVals()`.

## Ask before

- Adding a screen not in the inventory.
- Adding a class to `styles.css`.
- Any layout that departs from the mobile shell.
- Any dependency at all.
