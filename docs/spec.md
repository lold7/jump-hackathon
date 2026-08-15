# SchoolBackoffice AI — screen spec

Derived from `CLAUDE.md`. This file is the per-screen source of truth: field
lists, branches, and navigation targets. `CLAUDE.md` remains the source of truth
for canonical demo data, confidence bands, and validation rules — this file does
not restate them, it applies them.

English headings below are labels for the author. **Every string that reaches
the user ships in Thai**, `aria-label` included.

---

## Shared patterns

Copy these verbatim into each screen. They are defined once here so eleven
screens do not drift.

### Screen shell

Root: `height:100%;position:relative;overflow:hidden;display:flex;flex-direction:column`.
Header `flex:none` + 2px bottom rule. Middle `flex:1;overflow:auto;padding:22px 16px 18px`.
Footer `flex:none` + 2px top rule + `padding:12px 16px`. Overlays are
`position:absolute;inset:0` siblings inside the root — 40 menu, 50 sheet,
60 success.

### Header

Identical on every screen except 0 and 0b (which have no header):

```html
<header style="flex:none;display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:2px solid var(--color-divider);background:var(--color-bg)">
  <!-- 44×44 hamburger, margin-left:-10px, aria-label="เมนู" -->
  <div style="flex:1;font-family:var(--font-heading);font-weight:800;font-size:15px;letter-spacing:-0.01em;line-height:1.1">SchoolBackoffice <span style="color:var(--color-accent-700)">AI</span></div>
  <div style="width:36px;height:36px;background:var(--color-text);color:var(--color-bg);…">บ</div>
</header>
```

### Menu overlay

Copied from `ScanScreen.dc.html:83-107`. Six items, current screen highlighted
with `--color-accent-100`, user block pinned at the bottom
(ครูเบญจมาศ · โรงเรียนตัวอย่าง · ใช้งานอยู่).

| Label | Note | Target |
|---|---|---|
| เอกสาร | — | `scan` |
| การเบิกจ่าย | รอตรวจ 8 รายการ | `disbursement` |
| ครุภัณฑ์ | 7 รายการ | `assetRegister` |
| โครงการ | 4 โครงการ | `validation` |
| ประวัติการใช้งาน | — | `scan` |
| ช่วยเหลือ | — | `scan` |

The current screen's row uses note `คุณอยู่ที่นี่` and the accent-100 background.

### Field row

The workhorse of screens 3, 4, 5, 6, 8, 9. Never a bare value — every AI field
carries its confidence and stays editable.

```
┌──────────────────────────────────────────────┐
│ ประเภทเอกสาร                    [94%]  [✎]  │   label 12px / 70%
│ ใบเสร็จ                                      │   value 15px / 600
└──────────────────────────────────────────────┘
   1px solid color-mix(in srgb, var(--color-text) 18%, transparent)
```

Row padding `12px 0`. Edit button 44×44. `chipClass` and `chipText` are computed
in `renderVals()` — the template cannot branch.

### Confidence chip

| Band | Class | Meaning |
|---|---|---|
| ≥ 80% | `.tag .tag-neutral` | settled, editable |
| < 80% | `.tag .tag-accent-2` | flagged; blocks export until confirmed |
| blocking | `.tag .tag-accent` | validation failure, text `ต้องแก้ไข` |

Always `font-size:11px;font-family:var(--font-heading);font-weight:800`.

### Validation banner

Inline, no new class. Critical uses `--color-accent` / `--color-accent-100`;
warnings use `--color-accent-2` / `--color-accent-2-100`. 4px left border,
`12px 14px` padding, uppercase 12px/800 label over 13px body. Never green.

### Bottom-sheet editor

Copied from `ScanScreen.dc.html:132-159`. `z-index:50`, dim backdrop
`color-mix(in srgb, #201e1d 45%, transparent)`, panel
`border-top:2px solid var(--color-text)`, `max-height:86%`, `.input` inside,
ยกเลิก / บันทึก in the sheet footer.

### Success overlay

Copied from `ScanScreen.dc.html:161-168`. `z-index:60`, opaque `--color-bg`,
46px checkmark in `--color-accent`, 24px/800 title, 14px/62% paragraph,
secondary button out.

---

## Screen 0 — Login

**Purpose.** Sign in with the school's API number.

- Title `เข้าสู่ระบบ`, subtitle `ใช้หมายเลข API ของโรงเรียนเพื่อเริ่มใช้งาน`
- Field `หมายเลข API` — `.input`, prefilled `SCH-1042-8890`
- Field `เบอร์โทรศัพท์` — `.input`, prefilled `08X-XXX-4471`
- Footer primary `ขอรหัส OTP` → `otp`
- No header, no menu. Wordmark centred in the scroll area instead.

## Screen 0b — OTP

**Purpose.** Confirm the one-time code.

- Title `ยืนยันรหัส OTP`, body `กรอกรหัส 6 หลักที่ส่งไปยัง 08X-XXX-4471`
- Six square boxes, 48×56, `--color-surface` fill, 1px divider border,
  `--color-accent` border on the active box. Tapping fills the next digit.
- `ขอรหัสใหม่ (60 วินาที)` as `.btn-ghost`
- Footer primary `ยืนยัน` → `scan`, disabled until six digits are entered

## Screen 1 — Scan documents — **built**

`ScanScreen.dc.html`. Footer `ส่ง {n} เอกสารให้ AI` → `processing`.

## Screen 2 — AI processing

**Purpose.** Show the AI reading the batch, so the extraction on Screen 3 has
visible provenance.

- Title `AI กำลังอ่านเอกสาร`
- Progress: `{done} / 12 เอกสาร`, plus a 2px rule filling in `--color-accent`
- Per-document row: filename, then a stage label stepping through
  `อ่านตัวอักษร` → `จำแนกประเภท` → `ดึงข้อมูล` → `เสร็จ`.
  Completed rows show the checkmark in `--color-text`; the active row shows its
  stage in `--color-accent-700`; pending rows are 55% muted.
- Interval started in `componentDidMount()`, cleared in
  `componentWillUnmount()`. Tapping the title advances instantly so a presenter
  is never waiting.
- Footer `ดูผลลัพธ์` appears only when all 12 are done → `review`

## Screen 3 — AI review — **the centrepiece**

**Purpose.** Prove the core claim: AI extracts, the human stays in control, and
low confidence is visibly gated.

Mobile adaptation of the spec's two-column layout, per `CLAUDE.md`: preview on
top, extracted fields scrolling below.

- Pager `เอกสาร 1 / 12` with chevron prev/next, and `DOC-0012` as meta
- Preview block ~150px tall: `--color-neutral-200` fill, 1px divider border,
  centred `ตัวอย่างเอกสาร` label
- Section header `ข้อมูลที่ดึงได้` with the field count on the right
- Field rows:

  | Label | Value | Confidence |
  |---|---|---|
  | ประเภทเอกสาร | ใบเสร็จ | 96% |
  | เลขที่เอกสาร | `INV-0012` | 95% |
  | วันที่ | 14/08/2026 | 94% |
  | ผู้ขาย | ร้านสมใจ | 91% |
  | รายการ | กล้องจุลทรรศน์ | 88% |
  | จำนวน | 1 หน่วย | 93% |
  | **จำนวนเงิน** | **฿8,500** | **72%** |

- **The 72% amount is the money shot.** Flagged with `.tag-accent-2`, a warning
  banner reading `ลายมือในช่องจำนวนเงินอ่านได้ไม่ชัด กรุณาตรวจสอบก่อนยืนยัน`,
  and the footer button **disabled** until the user opens that field and taps
  `ยืนยันค่านี้`. Once confirmed the chip becomes a checkmark in `--color-text`.
- Tapping any row opens the bottom-sheet editor
- Footer `ยืนยันและไปต่อ` → `categorize` (Phase A: `payment`)

## Screen 4 — Smart categorization

**Purpose.** Show the system linking a document to a project and a funding
source, not just reading it.

- Section `โครงการ` — AI pick โครงการจัดซื้อวัสดุห้องวิทยาศาสตร์ `SCI-2026-024`
  at **94%**, with `เปลี่ยนโครงการ` opening a sheet of three alternates
- Section `แหล่งเงิน` — AI pick เงินอุดหนุน at **93%**, alternates
  เงินรายได้สถานศึกษา / เงินบริจาค
- Selected row uses `--color-accent-100`
- Footer `ยืนยันการจัดหมวดหมู่` → `disbursement`

## Screen 5 — Disbursement review

**Purpose.** The disbursement-type branch and the "count already used" rule.

- Field `ประเภทการเบิกจ่าย` — `.radio` list: บจ. / ค่าจ้าง / ค่าตอบแทน / อื่น ๆ.
  Default บจ.
- **Branch อื่น ๆ** → reveals free-text `.input` labelled
  `ระบุประเภทการเบิกจ่าย`
- Field `ครั้งที่` — `3` of `5`, shown as `ครั้งที่ 3 / 5`
- Validation: setting the count to `2` raises the critical banner
  `ครั้งที่ 2 ถูกใช้ไปแล้วในโครงการนี้` and disables the footer
- Footer `ยืนยันการเบิกจ่าย` → `payment`

## Screen 6 — Payment validation

**Purpose.** The four-way payment branch — the clearest proof the system
understands documents.

- Field `วิธีการชำระเงิน` — `.radio` list (vertical; four Thai labels will not
  fit a segmented control at 390px): เช็ค / เงินสด / เงินโอน / บัญชีธนาคาร.
  Default เช็ค.
- Four sibling `<sc-if>` blocks on `isCheque` / `isCash` / `isTransfer` /
  `isBankAcct`:

  | Branch | Fields |
  |---|---|
  | เช็ค | เลขที่เช็ค `CHQ-008421` **(required)** · วันที่ 14/08/2026 · ธนาคาร ธนาคารตัวอย่าง · จำนวนเงิน ฿8,500 · สถานะ ผ่านการเรียกเก็บแล้ว |
  | เงินสด | วันที่ชำระ · จำนวนเงิน |
  | เงินโอน | ธนาคาร · เลขที่บัญชี · เลขอ้างอิงรายการ · วันที่โอน |
  | บัญชีธนาคาร | ชื่อธนาคาร · ชื่อบัญชี · เลขที่บัญชี · วันที่ · จำนวนเงิน |

- Validation, both visibly demonstrable:
  - Clearing the cheque number → critical banner `เลขที่เช็คจำเป็นต้องระบุ`,
    footer disabled
  - Entering `CHQ-008400` → critical banner
    `เลขที่เช็คนี้ถูกใช้ไปแล้วกับ DOC-0007`
- Footer `ยืนยันการชำระเงิน` → `crossdoc` (Phase A: `assetClassify`)

## Screen 7 — Cross-document validation

**Purpose.** Catch a contradiction no single document reveals.

- `.table` comparing four amounts for `SCI-2026-024`:

  | เอกสาร | จำนวนเงิน |
  |---|---|
  | ใบเสนอราคา | ฿8,500 |
  | ใบเสร็จ `INV-0012` | ฿8,500 |
  | การเบิกจ่าย ครั้งที่ 3 | ฿8,500 |
  | การชำระเงิน `CHQ-008421` | **฿8,050** |

- The ฿8,050 row is highlighted and raises the critical banner
  `ยอดชำระเงินไม่ตรงกับใบเสร็จ ต่างกัน ฿450` with a
  `แก้ไขการชำระเงิน` button → `payment`
- A `แก้ไขให้ตรงกัน` action resolves it to ฿8,500 so the demo can proceed
- Footer `ยืนยันการตรวจสอบ` → `assetClassify`, disabled while unresolved

## Screen 8 — Asset classification

**Purpose.** The ครุภัณฑ์ / วัสดุ branch.

- Item card: กล้องจุลทรรศน์ · 1 หน่วย · ฿8,500
- AI call `ครุภัณฑ์` at **94%**, with the reasoning line
  `มูลค่าต่อหน่วยเกิน ฿5,000 และมีอายุการใช้งานเกิน 1 ปี`
- Two options, `--color-accent-100` on the selected one:
  - **ครุภัณฑ์** → shows `หมวดหมู่` = ครุภัณฑ์วิทยาศาสตร์, footer
    `ไปลงทะเบียนครุภัณฑ์` → `assetRegister`
  - **วัสดุ** → the category and asset-ID fields visibly disappear, an info line
    reads `วัสดุไม่ต้องลงทะเบียนครุภัณฑ์`, footer becomes `ยืนยันและไปต่อ` →
    `export`
- The branch must be *seen* to change the field set — that is the point.

## Screen 9 — Asset registration

**Purpose.** Close the loop from a photograph to a registered asset.

Reachable only from the ครุภัณฑ์ branch.

- `เลขครุภัณฑ์` `SCI-000234` with the uniqueness check shown as satisfied —
  checkmark in `--color-text` and `ไม่ซ้ำกับรายการเดิม`. No green.
- `หมวดหมู่` ครุภัณฑ์วิทยาศาสตร์
- `สถานที่จัดเก็บ` ห้องปฏิบัติการวิทยาศาสตร์ 1
- `ผู้รับผิดชอบ` ครูเบญจมาศ
- `วันที่รับเข้า` 14/08/2026
- QR placeholder: 96×96 `--color-neutral-200` block, 2px `--color-text` border,
  caption `QR สำหรับติดครุภัณฑ์`
- Footer `ลงทะเบียนครุภัณฑ์` → success overlay → `export`

## Screen 10 — Validation center

**Purpose.** One place showing everything still wrong across the batch.

- Section header `ต้องแก้ไข` with count, then `ควรตรวจสอบ` with count
- Issue rows: severity chip, one-line description, the document it belongs to,
  and a chevron deep-linking to the screen that fixes it
  - `ยอดชำระเงินไม่ตรงกับใบเสร็จ` · `DOC-0012` → `crossdoc` (critical)
  - `เลขที่เช็คซ้ำกับ DOC-0007` · `DOC-0007` → `payment` (critical)
  - `ลายมือในช่องจำนวนเงินอ่านได้ไม่ชัด` · `DOC-0012` → `review` (warning)
  - `ยังไม่ระบุผู้รับผิดชอบครุภัณฑ์` · `SCI-000238` → `assetRegister` (warning)
- Footer `ไปหน้าส่งออกข้อมูล` → `export`

## Screen 11 — Export

**Purpose.** The payoff — structured data out.

- Section header `สรุปชุดเอกสาร` with the canonical totals:
  12 เอกสาร · 8 ใบเสร็จ · 8 การเบิกจ่าย · 7 ครุภัณฑ์ · **฿40,980**
- Section `การตรวจสอบก่อนส่งออก` — the five rules from `CLAUDE.md`, each with a
  checkmark in `--color-text`:
  - เลขที่เช็คครบถ้วน
  - เลขที่เช็คไม่ซ้ำ
  - เลขครุภัณฑ์ไม่ซ้ำ
  - ครั้งที่เบิกจ่ายไม่ซ้ำ
  - ยอดเงินตรงกันทุกเอกสาร
  Any unresolved item shows the critical chip and blocks the footer, with a link
  to `validation`.
- Section `รูปแบบไฟล์` — `.seg` with Excel / CSV / PDF, Excel default
- Footer `ส่งออกข้อมูล` → success overlay
  `ส่งออก 12 เอกสารเรียบร้อยแล้ว`, body naming the file
  `SCI-2026-024_14082026.xlsx`, secondary button `กลับไปหน้าสแกนเอกสาร` →
  `scan`

---

## Flow

```
login → otp → scan → processing → review → categorize → disbursement
      → payment → crossdoc → assetClassify → assetRegister → export
                                    └ (วัสดุ) ──────────────→ export
```

All thirteen screens are built and the full order above runs on footer buttons
alone. Targets live in `flow.js`; handlers call `go('review')`.

Three gates must be cleared by hand — they are what the demo is for:

| Screen | Gate | Cleared by |
|---|---|---|
| 0b | footer locked until six digits | tapping `กรอกรหัสถัดไป` six times |
| 3 | footer locked by the 72% amount | opening the field and tapping `ยืนยันค่านี้` |
| 7 | footer locked by the ฿450 mismatch | tapping `แก้ยอดชำระเป็น ฿8,500` |

Two more validations are demonstrable but not blocking by default: entering
`CHQ-008400` on Screen 6 trips the cheque-uniqueness rule, and entering `2` on
Screen 5 trips the disbursement-count rule.
