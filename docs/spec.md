# KruScan — screen spec

Derived from `CLAUDE.md`. This file is the per-screen source of truth: field
lists, branches, and navigation targets. `CLAUDE.md` remains the source of truth
for canonical demo data, confidence bands, and validation rules — this file does
not restate them, it applies them.

English headings below are labels for the author. **Every string that reaches
the user ships in Thai**, `aria-label` included.

---

## Shared patterns

Copy these verbatim into each screen. They are defined once here so thirteen
screens do not drift.

### Screen shell

Root: `height:100%;position:relative;overflow:hidden;display:flex;flex-direction:column`.
Header `flex:none` + 2px bottom rule. Middle `flex:1;overflow:auto;padding:20px 16px 18px`.
Footer `flex:none` + 2px top rule + `padding:12px 16px`. Overlays are
`position:absolute;inset:0` siblings inside the root — 50 sheet, 60 success.
The FAB is a non-overlay sibling at z-30 so every overlay still covers it.

### Header — two kinds

**App screens** (Home, Project detail, Schedule, Profile) carry the brand:

```html
<header style="flex:none;display:flex;align-items:center;gap:6px;padding:10px 14px;border-bottom:2px solid var(--color-divider);background:var(--color-bg)">
  <div style="flex:1;font-family:var(--font-heading);font-weight:800;font-size:17px;letter-spacing:-0.01em;line-height:1.1">Kru<span style="color:var(--color-accent-700)">Scan</span></div>
  <!-- optional 44×44 action, then the 36×36 avatar -->
  <div style="width:36px;height:36px;background:var(--color-text);color:var(--color-bg);…">บ</div>
</header>
```

**Task screens** (Scan, Processing, Review, Export, Create project, Help,
Register) swap the wordmark for a 44×44 back arrow (`margin-left:-10px`,
`aria-label="ย้อนกลับ"`, path `M15 5l-7 7 7 7`) plus a 15px/800 screen title.

There is no hamburger and no menu overlay anywhere in the app.

### Bottom tab bar

`flex:none` sibling **after** the action footer, still inside the root column.
A screen with both stacks: scroll → footer (2px `--color-divider` top rule) →
tab bar (2px `--color-text` top rule). The heavier ink rule marks app chrome;
the divider rule marks the screen's own action band.

Three tabs — หน้าแรก / ตารางงาน / โปรไฟล์, 62px tall, `flex:1` each. Active tab
= 2px `--color-accent` top rule + `--color-accent-700` icon and label +
`aria-current="page"`; inactive = transparent rule + 55% muted text. Each button
carries `margin-top:-2px` so the accent segment overprints the bar's own ink
rule and the top edge stays one unbroken line.

Icons are 24×24, `stroke-linecap="square"`, stroke-width 2. Two of the three
need more than one `<path>`, so ship all three as literal SVG blocks selected by
`<sc-if value="{{ t.isHome }}">` rather than interpolating a `d` string. Every
tab object must set **all three** `isHome`/`isSchedule`/`isProfile` booleans — a
missing one resolves to undefined and the runtime warns.

### FAB — Home only

`position:absolute;right:16px;bottom:78px;z-index:30`, 60×60, `--color-accent`
fill, `2px solid var(--color-text)` border, camera glyph in `--color-bg`,
`aria-label="สแกนเอกสารใหม่"`. Square, no shadow — the ink border does the
lifting the design system refuses to do with elevation. `bottom:78px` = the
62px bar plus a 16px gutter.

### Field row

The workhorse of Screen 6. Never a bare value — every AI field carries its
confidence and stays editable.

```
┌──────────────────────────────────────────────┐
│ ประเภทเอกสาร                    [96%]  [✎]  │   label 12px / 70%
│ ใบเสร็จ                                      │   value 15px / 600
└──────────────────────────────────────────────┘
   1px solid color-mix(in srgb, var(--color-text) 18%, transparent)
```

Row padding `12px 0`. Edit affordance 36×36 inside a full-width button.
`chipClass`, `chipText` and `rowBg` are computed in `renderVals()` — the
template cannot branch. Confirmed low-confidence rows swap the chip for a
checkmark and drop the tinted background.

### Confidence chip

| Band | Class | Meaning |
|---|---|---|
| ≥ 80% | `.tag .tag-neutral` | settled, editable |
| 70–79% | `.tag .tag-accent-2` | flagged, editable |
| < 70% | `.tag .tag-accent` | blocks export until explicitly confirmed |

Always `font-size:11px;font-family:var(--font-heading);font-weight:800`.

### Disclosure row

Used by Screen 6's three sections and by Screen 11's FAQ. 15px/800 title with a
one-line 12px/55% summary beneath that **carries the branch value**, so the
section reads without being opened. Optional count chip, then a 36×36 chevron.
`border-bottom: 2px solid var(--color-divider)`.

The chevron swaps its `d` string — `M6 9l6 6 6-6` closed, `M6 15l6-6 6 6` open.
Never a CSS rotation: the design system bans transitions, and a rotating chevron
implies one.

### Validation banner

Inline, no new class. Critical uses `--color-accent` / `--color-accent-100`;
warnings use `--color-accent-2` / `--color-accent-2-100`. 4px left border,
`12px 14px` padding, uppercase 12px/800 label over 13px body. Never green.

### Bottom-sheet editor

`z-index:50`, dim backdrop `color-mix(in srgb, #201e1d 45%, transparent)`, panel
`border-top:2px solid var(--color-text)`, `max-height:86%`, `.input` inside,
ยกเลิก / บันทึก in the sheet footer. The save button relabels to `ยืนยันค่านี้`
when the field is below 70%, and a `ต้องยืนยัน` banner appears above it.

### Voice sheet

Same z-50 chrome as the field editor. Driven by one `setInterval(…, 200)`
started on demand and cleared in `componentWillUnmount` and at the end of the
script — the same shape `ProcessingScreen.dc.html` already uses. See Screen 6.

### Success overlay

`z-index:60`, opaque `--color-bg`, 46px checkmark in `--color-accent`, 24px/800
title, 14px/62% paragraph, button out.

---

## Screen 1 — Login

No header bar; a 38×38 accent logo tile beside the `KruScan` wordmark and the
tagline `AI จัดการงานเอกสาร คืนเวลาครูสู่ห้องเรียน`.

Three fields, each validated live, each reddening its own border and printing
its own error line: **อีเมล** (must contain `@` and `.`), **รหัสผ่าน**
(≥ 8 chars, with a 48×48 eye button that toggles `type` between `password` and
`text` — the eye gains a `M4 4l16 16` strike path while visible), and
**หมายเลข API ของโรงเรียน** (`^SCH-\d{4}-\d{4}$`).

`ลืมรหัสผ่าน?` is a `.btn-ghost` opening a z-50 explanatory sheet. Below the
fields, the numbered 1-2-3 explainer grid.

Footer: primary `ขอรหัส OTP` → `otp`, disabled with label
`กรอกข้อมูลให้ครบก่อน` while any field is bad; secondary
`ยังไม่มีบัญชี? สมัครสมาชิก` → `register`; then the demo disclaimer.

## Screen 2 — Register

Back arrow → `login`. Six fields in one `<sc-for>`: ชื่อ-นามสกุล, อีเมล,
รหัสผ่าน (eye), ยืนยันรหัสผ่าน (eye, must match รหัสผ่าน), โรงเรียน,
หมายเลข API (same regex). Then a 24×24 square consent checkbox — accent fill
with a `--color-bg` tick when checked.

Footer primary relabels three ways: `ยอมรับเงื่อนไขก่อน` / `กรอกข้อมูลให้ครบก่อน`
/ `สมัครสมาชิก`. Submitting paints the z-60 success overlay
`สมัครสมาชิกสำเร็จ`, whose button `ยืนยันรหัส OTP` → `otp`.

## Screen 2b — OTP

Back arrow → `login`. Six 58px boxes; the next empty box takes a
`2px solid var(--color-accent)` border. `กรอกรหัสถัดไป` (`.btn-secondary`)
reveals one character of `402817` per tap; `ล้างรหัส` (`.btn-ghost`) resets.
Static resend hint below a 2px rule.

**Demo gate 1.** Footer is `disabled` and reads `กรอกรหัสให้ครบ 6 หลัก` until
six digits are in, then `ยืนยัน` → `home`.

## Screen 3 — Home / project list

Brand header with a notification button (8×8 accent dot, opens a z-50 sheet of
three alerts) and a tappable avatar → `profile`.

`สวัสดี ครูเบญจมาศ` + school line. Two stat blocks side by side: `6`
เอกสารรอตรวจสอบ (accent border, accent-700 number) and `฿246,500`
ยอดใช้จ่ายเดือนนี้ (divider border). Then a full-width primary
`สร้างโครงการ` → `newProject`.

`โครงการของฉัน` — three cards, each with name, `code · owner`, a status tag,
a 6px progress bar with its percentage, doc count and last-updated line; all
→ `project`. Status tags: กำลังดำเนินการ `.tag-accent-2` · รอตรวจสอบ
`.tag-outline` · เสร็จสิ้น `.tag-neutral`.

`งานที่ต้องทำ` — two rows with a 4px severity bar → `review` / `export`.

No action footer. Tab bar (Home active) + FAB → `scan`. The scroll pads
`96px` at the bottom so the FAB never covers the last row.

## Screen 4 — Project detail

Back arrow → `home`, title, and a 44×44 ⋮ opening a z-50 options sheet
(แก้ไขโครงการ → `newProject`, ส่งออกข้อมูล → `export`, ดูภาพรวมโครงการ →
`schedule`).

Project name as `h1` with a status tag beside it, `code · owner` beneath, then
the 8px progress bar. `ข้อมูลโครงการ` — nine label/value rows (ชื่อโครงการ,
รหัสโครงการ, ผู้รับผิดชอบ, แหล่งที่มาของเงิน, งบประมาณ, ใช้ไปแล้ว,
ครั้งที่เบิกจ่าย, วันที่เริ่มต้น, วันที่สิ้นสุด) closed by a 2px
`--color-text` rule and `คงเหลือ ฿113,500`.

`เอกสารในโครงการ` — five rows with an extension thumbnail, document type,
`DOC-id · อัปโหลด date`, an AI + validation state line, and a right-hand tag;
all → `review`.

Footer: primary `อัปโหลดเอกสาร` → `scan`, secondary `ดูภาพรวมโครงการ` →
`schedule`. **Plus the tab bar** (Home active) — this is the both-bands case.

## Screen 5 — Scan / upload

Back arrow → `home`. Large tap-target dropzone (`วางเอกสารที่นี่ / หรือ /
สแกนด้วยกล้อง`) with JPG PNG PDF `.tag-outline` chips, opening the camera.

Conditional `พร้อมส่ง` list with per-row remove buttons, then the numbered
explainer grid.

Footer: the primary `ส่ง {n} เอกสารให้ AI` → `processing` **only exists when
the batch is non-empty**, so the presenter must scan or upload first. Below it,
a two-up secondary row `อัปโหลดไฟล์` / `สแกนเอกสาร`.

Two overlays, both z-50 and both kept as-is: the full-bleed dark camera view
(`#141312` / `#211f1e` / `#fff` — the one place hard-coded hex is legal) with
corner brackets and a 74px shutter, and the multi-select upload sheet.

## Screen 5b — AI processing

Back arrow → `scan`. Tapping the `h1` calls `skip()` — the presenter's escape
hatch. 12-cell segmented rule: done `--color-accent`, active
`--color-accent-400`, pending `--color-neutral-300`.

`setInterval(…, 120)` in `componentDidMount`, cleared in `componentWillUnmount`
and on completion. Three working stages per document — อ่านเอกสาร → จำแนกประเภท
→ ตรวจสอบข้อมูล — landing in เสร็จสิ้น, which is the fourth step the brief
lists. While running, an accent banner names the current stage and filename;
when finished, a summary grid appears.

Footer is `disabled` and reads `กำลังประมวลผล…` until done, then `ดูผลลัพธ์`
→ `review`.

## Screen 6 — AI review (the centrepiece)

**This screen absorbs what used to be seven separate screens.** Back arrow →
`scan`. Sticky pager over three documents, sorted lowest-confidence first, so
the reviewer lands on the one that needs a human.

Height budget: header 64 · pager 61 · scroll 587 · footer 132.

Six bands in the scroll:

1. **Preview strip** — 108px placeholder + caption
   `AI อ่านได้ N ช่อง · ความมั่นใจเฉลี่ย 93%`.
2. **Error spotlight** (`hasError`) — 4px `--color-accent` bar on
   `--color-accent-100`, `.tag-accent` chip, the value at 22px/800, a two-line
   explanation, and two buttons: `แก้ด้วยเสียง` (primary, 46px) and `แก้เอง`
   (secondary, 44px, opens the z-50 editor on the same field). Never collapsed.
   After correction it is replaced by a neutral tick row
   `จำนวน 20 → 10 · แก้ไขด้วยเสียง`.
3. **ข้อมูลหลัก** — six always-visible field rows: ผู้ขาย, วันที่, รายการ,
   **จำนวน**, ราคาต่อหน่วย, ยอดในใบเสร็จ. The จำนวน row is the same field as
   the spotlight and flips to a tick at the same moment — that is the visible
   proof the fix landed. Closed by a 2px `--color-text` rule carrying
   **ยอดคำนวณ** (`qty × unit`, computed in `renderVals()`), its
   `20 × ฿8,500` note, and a `ไม่ตรงกับใบเสร็จ` `.tag-accent` while mismatched.
4. **Three disclosure sections**, all collapsed on first paint:
   - **เอกสารและโครงการ** — ประเภทเอกสาร 96%, ประเภทการเงิน บจ. 92%,
     โครงการ 94%, แหล่งเงิน 93%. Summary `ใบเสร็จ · บจ. · SCI-2026-024`.
   - **การชำระเงิน** — a four-option `.radio` group, then that method's rows.
     Summary `เช็ค · CHQ-008421 · ฿85,000`.
   - **ครุภัณฑ์และวัสดุ** — a two-option `.radio` group with note lines, then
     that type's rows, plus the 96px QR block for ครุภัณฑ์ only. Summary
     `ครุภัณฑ์ · ครุภัณฑ์วิทยาศาสตร์ · SCI-000234` or
     `วัสดุ · ไม่ต้องลงทะเบียนครุภัณฑ์`.

   Deviating from the AI's pick reveals an `แก้ไขจากที่ AI แนะนำ` accent-2
   banner inside that section.
5. **การตรวจสอบ** — five check rows, never collapsed. `ยอดคำนวณตรงกับยอดใน
   ใบเสร็จ` fails while the quantity is wrong and flips when it is fixed.
6. **Footnote** — the 12.5px/62% "ทุกช่องแก้ไขได้" paragraph.

**Editing is always the z-50 bottom sheet.** No inline `.input` on this screen:
fifteen rows have to stay the same height, and it is the only way an on-screen
keyboard does not destroy the layout.

**Demo gate 2.** Anything below 70% that is unconfirmed sets `blocked` — the
footer primary is `disabled` and reads `แก้ช่องที่ความมั่นใจต่ำก่อน`. The
secondary `บันทึกไว้ก่อน` stays live at all times (a blocked screen with no
usable control is a dead end) and opens a z-60 `บันทึกฉบับร่างแล้ว` →  `home`.
Once cleared, the primary reads `ส่งออกข้อมูล` → `export`.

**Voice sheet.** `openVoice` sets `voiceTick: 0` (idle). Tapping the 72×72
square mic starts the ticker. Steps by tick: `1–6` กำลังฟัง… (mic fills accent,
12-bar level meter animates by rotating a fixed height array — the same idiom as
ProcessingScreen's progress strip, never a waveform or a glow), `7–11` ถอดความ
(transcript `เปลี่ยนจำนวนเป็น 10 ชิ้น` on a 4px accent bar), `12–16`
ใช้การแก้ไข — **commits here**, so closing later is safe — showing
`20 → 10` and `฿170,000 → ฿85,000` plus the cross-check line, `≥ 17` เรียบร้อย
and the ticker stops.

The sheet's primary is live at every step: `ข้าม` during 1–16 jumps to the end
and applies the change; `เสร็จสิ้น` at the end closes. `ยกเลิก` is offered only
while idle.

## Screen 7 — Export

Back arrow → `review`. `สรุปชุดเอกสาร` four rows closed by a 2px
`--color-text` rule and `ยอดรวม ฿246,500`. `การตรวจสอบก่อนส่งออก` five check
rows. A blocked branch exists (banner + disabled footer) but nothing in the UI
triggers it, so the demo path is always live.

`รูปแบบไฟล์` — a `.seg` control over **Excel / CSV / Word**, Excel first and
labelled แนะนำ. The filename line updates its extension reactively.

`ตัวอย่างข้อมูลที่จะส่งออก` — the design system's `.table`, finally used. All
**13 columns**, no subset, inside a `2px` bordered `overflow-x:auto` window at
`min-width:1080px` with `white-space:nowrap`; money and count columns
right-aligned. Three rows inline; `ดูทั้งหมด` opens a z-50 full-bleed overlay
with all twelve rows and `position:sticky;top:0` headers. `.table th` already
ships the 2px rule and `.table td` the 1px one, so the design system's 2px/1px
law needs no override.

Columns: เลขที่เอกสาร · ประเภทเอกสาร · ประเภทการเงิน · วันที่ · ผู้ขาย ·
โครงการ · แหล่งเงิน · รายการ · จำนวน · ราคาต่อหน่วย · ยอดรวม · วิธีชำระเงิน ·
เลขครุภัณฑ์.

Write `<thead>`/`<tbody>` explicitly and keep every `<sc-for>` *inside* a
`<tr>` — the loop emits a Fragment, legal as a child of `<tr>` but not between
`<table>` and its rows.

Footer primary `ส่งออกเป็นไฟล์ {format}` paints the z-60 success overlay
`ส่งออกไฟล์สำเร็จ`, whose button `กลับหน้าหลัก` → `home`.

## Screen 8 — Project overview / schedule

Brand header. Project name, an 8px progress bar at 68%, and a 2×2 stat grid
(งบที่ใช้ไป, เอกสารในโครงการ, ขั้นตอนที่เสร็จแล้ว, เหลือถึงกำหนดส่ง).

`ขั้นตอนการดำเนินงาน` — six timeline entries on a 14px square marker with a
2px rail between them (the last one's rail is transparent so it does not
dangle). Each carries name, date range, status tag, owner and document count.
Tones: `done` accent-filled marker + `.tag-neutral`, `active` accent-2 outlined
marker + `.tag-accent-2`, `wait` neutral-400 outlined marker + `.tag-outline`.

Closes with an accent-2 banner `คาดว่าจะเสร็จ 20 ส.ค. 2026`. No action footer.
Tab bar (Schedule active).

## Screen 9 — Create project

Back arrow → `home`. Seven `.input` fields in one `<sc-for>` (ชื่อโครงการ,
รหัสโครงการ with `^[A-Z]{3}-\d{4}-\d{3}$`, ผู้รับผิดชอบ, รายละเอียดโครงการ,
งบประมาณ, วันที่เริ่มต้น, วันที่สิ้นสุด), each with its own red border and
error line. Then `แหล่งที่มาของเงิน` as three `.radio` options — เงินอุดหนุน /
เงินรายได้สถานศึกษา / เงินอื่น ๆ.

`เพิ่มเติม` (ไม่บังคับ): แนบเอกสารโครงการ → `scan`, and เพิ่มผู้ร่วมโครงการ,
a toggling row whose tag flips between `เพิ่ม` and `2 คน`.

Footer primary `สร้างโครงการ` (or `กรอกข้อมูลให้ครบก่อน`) paints the z-60
`สร้างโครงการสำเร็จ` overlay → `project`. No tab bar.

## Screen 10 — Account profile

Brand header with a 44×44 help button → `help`. Avatar block (60×60 initial,
name, email, `school · role`) inside a 2px border.

`ข้อมูลบัญชี` — five label/value rows, then a neutral tick banner
`โรงเรียนได้รับการยืนยันแล้ว`.

`ตั้งค่า` — การแจ้งเตือน as a 52×28 square toggle (accent track, `--color-bg`
knob, `justify-content` flips the knob side), then four chevron rows:
แก้ไขข้อมูลส่วนตัว, เปลี่ยนรหัสผ่าน, การยืนยัน OTP, ความปลอดภัย.

`พื้นที่อันตราย` — a 2px `--color-accent` top rule, an accent-700 `h6`, an
explanatory line, and `ออกจากระบบ` as a `.btn-secondary` with accent border and
accent-700 text → `login`. Tab bar (Profile active).

## Screen 11 — Help / how it works

Back arrow → `profile`. `วิธีใช้งาน KruScan` as an eight-step vertical flow:
a 28×28 accent square holding the step number, a 2px rail between steps, then a
15.5px/800 label and a 12.5px/62% note.

`คำถามที่พบบ่อย` — eight FAQ entries using the **same disclosure row** as
Screen 6, which is what makes it a shared pattern rather than a one-off. Answers
are 14px/1.7 at 78% opacity.

Closes with a bordered contact block whose primary `ติดต่อทีมสนับสนุน` opens a
z-50 sheet listing อีเมล, โทรศัพท์ and เวลาทำการ. No tab bar.

---

## Flow

```
login ──▶ otp ──▶ home ──▶ project ──▶ scan ──▶ processing ──▶ review ──▶ export ──▶ home
  │                 │                                                        │
  └─▶ register ─────┘                                                        │
        │                                                                    │
        └─▶ otp                                                              │
                                                                             │
home ◀── tab bar ──▶ schedule                                                │
             └─────▶ profile ──▶ help                                        │
home ──▶ newProject ──▶ project                                              │
review ── บันทึกไว้ก่อน ────────────────────────────────────────────────────▶ home
```

Targets live in `flow.js`; handlers call `go(key)` and never a raw
`location.href`.

### Gates cleared by hand

| Gate | Screen | Cleared by |
|---|---|---|
| Six OTP digits | 2b | Tapping `กรอกรหัสถัดไป` six times |
| The 62% จำนวน field | 6 | `แก้ด้วยเสียง` (voice sheet) or `แก้เอง` (z-50 editor) |

Clearing the second gate also flips `ยอดคำนวณ` from ฿170,000 to ฿85,000 and the
`ยอดคำนวณตรงกับยอดในใบเสร็จ` check from failing to passing — one action, three
visible consequences. That is the demo's payoff.

### Demonstrable but non-blocking

Switching payment method or asset type on Screen 6 raises the
`แก้ไขจากที่ AI แนะนำ` banner and rewrites the section's field set and summary
line, but never blocks the footer.
