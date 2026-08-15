# KruScan — Prototype

> สแกนครั้งเดียว ให้ AI จัดการงานเอกสาร คืนเวลาครูสู่ห้องเรียน

AI document processing for Thai school finance, procurement, payment and asset
work. Teachers create a project, photograph the paperwork, and AI reads it,
classifies it, links it to a funding source, validates it across documents, and
exports structured data to Excel. Wrong fields can be corrected by voice.

## What this project IS

A **clickable prototype for a hackathon demo.** Mobile-shaped UI running in a
browser. There is no backend, no real OCR, no database, no auth, no speech
recognition. Every screen runs on hardcoded fixture data and local component
state.

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

Serving over HTTP is required — the runtime re-fetches its own URL, so
`file://` will not boot.

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
(`KruScan`, `CHQ-008421`, `SCI-000234`, `Excel`).

**Mobile layout.** Every screen is a phone screen: fixed header, scrolling
middle, fixed action footer, overlays as absolutely-positioned siblings.

**Design at 390×844.** Every screen is authored to fit a 390px-wide,
844px-tall viewport — that is the canvas, not a breakpoint. The root element
uses `height:100%` inside a fixed-size box; never `100vw`/`100vh`, never a
max-width container, never a media query. Open `preview.html` to see screens
side by side at true size.

**The design system is fixed.** Read `modernist-ds` and follow it. Zero border
radius, Archivo 800 headings, square icon linecaps, left-aligned buttons,
2px structural rules. Do not restyle existing screens while adding new ones.

The product brief asks for rounded cards, soft shadows, a blue/indigo palette
and green success states. **That direction is deliberately not followed** — the
project keeps the Modernist system. Its intent is carried over like this:
rounded cards → `.card` with 2px rules · shadows → borders · blue/indigo →
`--color-accent` · green success → a checkmark in `--color-text` on
`--color-neutral-200` · orange warning → `--color-accent-2` · red error →
`--color-accent`.

**One screen per task.** Build the screen you were asked for. Do not
scaffold ahead, do not refactor neighbours, do not touch `styles.css` during
feature work.

---

## Canonical demo data

Every screen must show the *same* transaction so the demo hangs together. When
a screen needs an example, use this one. Do not invent new numbers.

| Field | Value |
|---|---|
| Document | `DOC-0012` · ใบเสร็จ · 15/08/2026 |
| Vendor | ร้าน ABC |
| Project | โครงการจัดซื้ออุปกรณ์วิทยาศาสตร์ (`SCI-2026-024`) |
| Funding source | เงินอุดหนุน |
| Financial doc type | บจ. |
| Item | กล้องจุลทรรศน์ · **จำนวน 20 → 10** · ฿8,500 / หน่วย |
| Receipt total | ฿85,000 |
| Payment | เช็ค · `CHQ-008421` · ธนาคารตัวอย่าง · 15/08/2026 |
| Asset | ครุภัณฑ์ · ครุภัณฑ์วิทยาศาสตร์ · `SCI-000234` |
| Project budget | ฿360,000 · ใช้ไป ฿246,500 · คงเหลือ ฿113,500 |
| Batch totals | 12 เอกสาร · 8 ใบเสร็จ · 8 การเบิกจ่าย · 7 ครุภัณฑ์ · 4 วัสดุ · ฿246,500 |
| Disbursement | บจ. · ครั้งที่ 3 / 5 |
| User | ครูเบญจมาศ ใจดี · โรงเรียนตัวอย่าง · เจ้าหน้าที่พัสดุ |

**ยอดรวม is derived, not extracted.** `จำนวน × ราคาต่อหน่วย` is computed in
`renderVals()` (the template cannot do arithmetic) and compared against the
receipt total. Before the correction: `20 × ฿8,500 = ฿170,000`, which does not
match the receipt's ฿85,000 — so the cross-document check fails. After it:
`10 × ฿8,500 = ฿85,000`, and the check flips to passing. That flip is the
payoff of the whole demo; do not break it by hardcoding a total.

Confidence values shown in the demo: ประเภทเอกสาร 96% · ราคาต่อหน่วย 96% ·
ยอดในใบเสร็จ 95% · วิธีชำระเงิน 95% · โครงการ 94% · ครุภัณฑ์ 94% ·
แหล่งเงิน 93% · ประเภทการเงิน 92% · **จำนวน 62%**.

---

## Presenting AI behaviour

Never show a bare extracted value. Every AI-produced field carries its
confidence and stays editable — that is the product's core claim, and a field
that looks like a locked database read undercuts it.

Confidence bands used across screens:

- **≥ 80%** — show the value with its confidence in `.tag-neutral`, editable.
- **70–79%** — show the value flagged in `.tag-accent-2`, editable.
- **< 70%** — show the value in `.tag-accent` on an `--color-accent-100` row,
  and **block export** until the user explicitly confirms it.

Validation severity maps to color: critical uses `--color-accent`, warnings use
`--color-accent-2`. Never introduce a green "success" color — verified states
are shown with a checkmark in `--color-text` or `--color-accent`.

---

## Conditional UI

These branches are the demo's proof that the system understands documents
rather than just reading them. They all now live on **Screen 6 (AI review)**,
inside its collapsible sections.

- Payment method **เช็ค** → cheque number (required), date, bank, amount, status
- Payment method **เงินสด** → payment date and amount only
- Payment method **เงินโอน** → bank, account, transaction reference, transfer date
- Payment method **บัญชีธนาคาร** → bank name, account name, account number, date, amount
- Asset type **ครุภัณฑ์** → category, asset ID, location, responsible person, QR
- Asset type **วัสดุ** → no asset ID, no registration, no QR

**Branches are composed in `renderVals()`, never in the template.** A section's
`rows` array *is* `PAY_FIELDS[state.method]` / `ASSET_FIELDS[state.assetType]`;
the template holds one `<sc-for>` and does not know the word `เช็ค`. The
runtime has no arithmetic and no function calls inside `{{ }}`, so any logic
that looks like branching must be resolved in JS first.

Validation rules the demo must visibly enforce: computed amount must equal the
receipt total; cheque number required when paying by cheque; cheque numbers
unique; asset IDs unique; disbursement count not already used for that project.

---

## Screen inventory

Spec sections in `docs/spec.md`. Build order follows demo order.

| # | Screen | Status |
|---|---|---|
| 1 | Login | **built** — `LoginScreen.dc.html` |
| 2 | Register | **built** — `RegisterScreen.dc.html` |
| 2b | OTP verification | **built** — `OtpScreen.dc.html` |
| 3 | Home / project list | **built** — `HomeScreen.dc.html` |
| 3b | All projects | **built** — `ProjectsScreen.dc.html` |
| 4 | Project detail | **built** — `ProjectDetailScreen.dc.html` |
| 5 | Scan / upload | **built** — `ScanScreen.dc.html` |
| 5b | AI processing | **built** — `ProcessingScreen.dc.html` |
| 6 | AI review (the centrepiece) | **built** — `ReviewScreen.dc.html` |
| 7 | Export | **built** — `ExportScreen.dc.html` |
| 8 | Project overview / schedule | **built** — `ScheduleScreen.dc.html` |
| 9 | Create project | **built** — `CreateProjectScreen.dc.html` |
| 10 | Account profile | **built** — `ProfileScreen.dc.html` |
| 11 | Help / how it works | **built** — `HelpScreen.dc.html` |

Screens navigate via `flow.js` — handlers call `go('review')`, never a raw
`location.href`. Add a screen to the map there and to the `SCREENS` list in
`preview.html` when it lands.

**Navigation shell.** *App screens* (Home, Project detail, Schedule, Profile)
carry a brand header and the fixed bottom tab bar. There is no FAB — scanning
is reached from the project detail screen's อัปโหลดเอกสาร button.
*Task screens* (Login, Register, OTP, All projects, Scan, Processing, Review,
Export, Create project, Help) carry a 44×44 back arrow with a title, and no tab
bar. There is
no hamburger menu anywhere.

**Demo path.** `login → otp → home → project → scan → processing → review →
export → home`. Two gates must be cleared by hand, and they are the point of
the demo:

1. **six OTP digits** on Screen 2b — tap the boxes and type `402817`.
2. **the 62% จำนวน field** on Screen 6 — the footer stays disabled until the
   user clears it, via `แก้ด้วยเสียง` (the scripted voice sheet) or `แก้เอง`
   (the z-50 field editor). Clearing it flips `ยอดคำนวณ` from ฿170,000 to
   ฿85,000 and the cross-document check from failing to passing.

Update the status column when a screen lands.

---

## Naming

- Screens: `<Name>Screen.dc.html` — matches `ScanScreen.dc.html`. The `.dc.html`
  suffix is load-bearing: the runtime derives the component name by stripping it.
- State keys and handlers: camelCase, verbs for handlers (`openCamera`,
  `addPicked`, `closeAll`).
- Every value and handler referenced in a template must be returned from
  `renderVals()`. A missing one renders empty and logs
  `{{ x }} never resolved` — treat any such warning as a build failure.

## Ask before

- Adding a screen not in the inventory.
- Adding a class to `styles.css`.
- Any layout that departs from the mobile shell.
- Any dependency at all.
