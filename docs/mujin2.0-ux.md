# Mujin 2.0 — UX Design (Sally)

> Companion file to `mujin2.0.md`. Load when working on UX, flows, or wireframes.

---

## Decisions Locked

- **Device:** Desktop-first, mobile-responsive
- **Language:** English primary, Japanese toggle (global, persists across sessions)
- **Check-ins:** In-person bi-weekly (mentor logs attendance — no student action required)
- **Trust Score visibility:** Within group only (first names / initials — peer-supportive, not competitive)
- **Group size:** 5 students per group
- **Town Hall sentiment summary:** Structured (Morale / Themes / Flags) — no free-text AI narrative; enables objective staff review
- **Reflection flag notification:** Delivered via student Inbox with live countdown timer; resubmission accessed from Inbox item

---

## Design System — Public Marketing Pages (Session 25)

### Color Palette
| Token | Hex | Usage |
| :--- | :--- | :--- |
| Primary | `#465f88` | Navy — CTAs, active states, headings |
| Secondary | `#486558` | Forest green — accent chips, tags, borders |
| Background | `#f9f9f9` | Page background |
| Surface | `#ffffff` | Card backgrounds |
| On-Surface | `#1a1a2e` | Body text |
| Primary Light | `#e8edf5` | Hover fills, tag backgrounds |
| Secondary Light | `#e8f0ed` | Alternate tag backgrounds |

Implementation: all tokens stored in a per-file `C` constants object using inline styles — **not Tailwind dynamic classes** — to avoid purge issues.

### Typography
| Role | Font | Usage |
| :--- | :--- | :--- |
| Display headings | Noto Serif | Hero h1, section titles |
| Body / labels | Space Grotesk | Body copy, nav, buttons, cards |
| Data / metadata | IBM Plex Mono | Stats, scores, tags, metadata |
| Ghost initials | Cormorant Garamond | Decorative large initials (team page) |

### Navigation
- **Public marketing pages:** Top nav (horizontal, sticky/transparent-on-scroll). Links: About · Network · FAQ · Demo.
- **Authenticated dashboard routes:** Sidebar nav retained (existing pattern).

### Recurring UI Patterns
- **Grain texture overlay:** `opacity: 0.03` noise on hero sections and dark panels
- **Pulse-live indicator:** Animated green dot (`.pulse-live` class) for "active program" status
- **Left gradient accent:** Thin left-border gradient strip on cards (navy → transparent)
- **Ghost initial:** Large faded letter watermark behind team/section headers
- **Tag chips:** IBM Plex Mono, `#486558` border + `#e8f0ed` bg — used for role tags, signal labels
- **Bento grid:** Mixed-size card grid for stats + feature highlights (3-col → asymmetric on desktop)

---

## Student Flow

```
ONBOARDING
└── Accept grant offer
└── Sign Pledge of Honor (digital)
└── Create venture profile (name, description, co-founders)
└── Join assigned group (cohort of 5 students)

RECURRING — BI-WEEKLY
└── Attend in-person mentor check-in (mentor marks attendance)

RECURRING — MONTHLY
└── Receive P&L submission reminder
└── Complete P&L form (revenue / expenses / net / notes)
└── Upload receipts if expenses ≥ ¥50,000
└── Attend peer Town Hall (no mentor/admin present)
└── Submit anonymous Town Hall form — two components:
    ├── Attendance report (who was present — majority ≥3/5 rules; non-submission = absent)
    └── Reflection (50+ words, meaningful; AI-assessed; not visible to mentor or staff)
        └── If flagged: 48-hour resubmission window (once per quarter)
        └── Second flag same quarter = score 0, no window

ANYTIME — DASHBOARD
└── View own Trust Score (traffic light + number)
└── View score breakdown (Responsiveness / Transparency / Mutualism / Reflection)
└── View group members' scores (within cohort only)
└── View graduation progress checklist

ANYTIME — INBOX
└── Reflection flagged notification (🔴 Action Required + 48hr countdown)
└── P&L approved/flagged notifications
└── P&L due reminders
```

---

## Mentor Flow

```
DASHBOARD — GROUP VIEW (own group only)
└── 5 students with Trust Score traffic lights
└── Flags: upcoming check-in, students at risk

ATTENDANCE LOGGING — BI-WEEKLY
└── Open check-in session for their group
└── Mark present / absent per student
└── Score updates automatically

⚠ Mentors cannot: review P&Ls, override scores, access other groups, or hold STAFF/ADMIN role simultaneously
```

---

## Admin (Staff) Flow

```
DASHBOARD — DAILY VIEW
└── All students across all groups sorted by risk (Red first)
└── Flags: upcoming P&L deadlines, students missing check-ins

P&L REVIEW — MONTHLY
└── View submitted P&Ls
└── Approve / Flag for audit / Request more info
└── Add internal annotation
└── Override score (requires written reason)

TOWN HALL MONITORING — MONTHLY
└── View aggregate attendance per group (majority-rule result)
└── View anonymous group sentiment summary (no individual attribution)

GRADUATION TRACKING
└── Per-student checklist:
    ├── Company incorporated + product live ✓/✗
    ├── 3 months non-negative cash flow ✓/✗
    ├── Green score 6 consecutive months ✓/✗
    └── Exit interview passed ✓/✗
└── System auto-notifies staff when criteria 1–3 met
└── Staff schedules + conducts exit interview
└── "Introduce to bank" action unlocks after interview passed
```

---

## Wireframes (Key Screens)

**Student Dashboard**
```
┌─────────────────────────────────────────┐
│  Mujin                        [EN | JP] │
├─────────────────────────────────────────┤
│  Hi, [Name] · [Venture Name]            │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  TRUST SCORE          🟢  82   │    │
│  │  Responsiveness  ████████░░ 80% │    │
│  │  Transparency    █████████░ 90% │    │
│  │  Mutualism       ███████░░░ 75% │    │
│  │  Reflection      █████████░ 90% │    │
│  └─────────────────────────────────┘    │
│                                         │
│  GRADUATION PROGRESS                    │
│  ☑ Company incorporated                 │
│  ☐ 3 months non-negative cash flow      │
│  ☐ Green score × 6 consecutive months  │
│                                         │
│  UPCOMING                               │
│  📋 P&L due  Mar 31                     │
│  📅 Town Hall  Mar 22                   │
├─────────────────────────────────────────┤
│  MY GROUP                               │
│  [A] 🟢91  [B] 🟡63  [C] 🟢78         │
│  [D] 🔴44  [You] 🟢82                  │
└─────────────────────────────────────────┘
```

**Monthly P&L Form**
```
┌─────────────────────────────────────────┐
│  Monthly Report · March 2026            │
├─────────────────────────────────────────┤
│  Revenue (¥)        [ _____________ ]   │
│  Expenses (¥)       [ _____________ ]   │
│  Net                  ¥ (auto-calc)     │
│                                         │
│  Notes (optional)                       │
│  [ ________________________________ ]   │
│  [ ________________________________ ]   │
│                                         │
│  Receipts                               │
│  Required if expenses ≥ ¥50,000         │
│  [ + Upload receipt ]                   │
│                                         │
│  [ Submit Report ]                      │
└─────────────────────────────────────────┘
```

**Admin Dashboard**
```
┌─────────────────────────────────────────┐
│  Mujin Admin                            │
├─────────────────────────────────────────┤
│  NEEDS ATTENTION                        │
│  🔴 Student D · Group 1 · Score: 44    │
│  🔴 Student F · Group 2 · Score: 38    │
│                                         │
│  ALL STUDENTS                           │
│  Group 1                                │
│  [A]🟢91 [B]🟡63 [C]🟢78             │
│  [D]🔴44 [E]🟢82                      │
│                                         │
│  Group 2                                │
│  [F]🔴38 [G]🟢88 [H]🟡55             │
│  [I]🟢79 [J]🟢91                      │
│                                         │
│  ACTIONS DUE                            │
│  📋 P&L reviews pending       4        │
│  📅 Check-in session  Mar 18           │
└─────────────────────────────────────────┘
```

**Admin P&L Review**
```
┌─────────────────────────────────────────┐
│  P&L Review · [Student Name] · Mar 2026 │
├─────────────────────────────────────────┤
│  Revenue      ¥120,000                  │
│  Expenses     ¥85,000                   │
│  Net          ¥35,000  ✅ Positive      │
│                                         │
│  Notes: "Sold 12 units, hosting cost    │
│  increased this month."                 │
│                                         │
│  Receipts     [View uploaded receipt]   │
│                                         │
│  Staff Note (internal)                  │
│  [ ________________________________ ]   │
│                                         │
│  [ ✅ Approve ]  [ 🚩 Flag for Audit ] │
│  [ Override Score — requires reason ]   │
└─────────────────────────────────────────┘
```

---

## Sprint 3 Wireframes (Sally — added 2026-03-17)

**Mentor — Mark Attendance (Check-In Session)**
```
┌─────────────────────────────────────────┐
│  Check-In Session · Mar 18, 2026        │
│  Group 1                                │
├─────────────────────────────────────────┤
│  Mark attendance for each student:      │
│                                         │
│  [A] Aiko Tanaka                        │
│      ● Present   ○ Absent               │
│                                         │
│  [B] Ben Carter                         │
│      ● Present   ○ Absent               │
│                                         │
│  [C] Chidi Obi                          │
│      ○ Present   ● Absent               │
│                                         │
│  [D] Dana Kim                           │
│      ● Present   ○ Absent               │
│                                         │
│  [E] Erik Sato                          │
│      ● Present   ○ Absent               │
│                                         │
├─────────────────────────────────────────┤
│  ⚠ Once submitted, attendance is locked │
│  Contact staff to correct errors.       │
│                                         │
│  [ Submit Attendance ]                  │
└─────────────────────────────────────────┘
```

**Student — Town Hall Anonymous Submission Form**
```
┌─────────────────────────────────────────┐
│  Town Hall · March 2026                 │
│  Anonymous Submission                   │
├─────────────────────────────────────────┤
│  PART 1 — Who was present today?        │
│  (Check all that attended)              │
│                                         │
│  ☑  [A] — Member A                     │
│  ☑  [B] — Member B                     │
│  ☐  [C] — Member C                     │
│  ☑  [D] — Member D                     │
│  ☑  [You]                              │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  PART 2 — Monthly Reflection            │
│  Share your honest thoughts. This is    │
│  anonymous — staff cannot read this.    │
│  An automated system checks that your  │
│  response is meaningful (not staff).   │
│                                         │
│  [ ________________________________ ]   │
│  [ ________________________________ ]   │
│  [ ________________________________ ]   │
│  [ ________________________________ ]   │
│                                         │
│  Word count: 0 / 50 minimum             │
│                                         │
│  [ Submit ]                             │
└─────────────────────────────────────────┘
```

**Student — Inbox**
```
┌─────────────────────────────────────────┐
│  Inbox                                  │
├─────────────────────────────────────────┤
│  🔴 Action Required                     │
│  Your March reflection needs attention  │
│  Resubmission window closes in 31:42:18 │
│  [ View → ]                             │
│  ─────────────────────────────────────  │
│  ✅ P&L Approved · Feb 2026             │
│  Your February report was approved.     │
│  [ View → ]                             │
│  ─────────────────────────────────────  │
│  📋 P&L Due · Mar 31                    │
│  Submit your March report by month end. │
│  [ Submit → ]                           │
└─────────────────────────────────────────┘
```

**Student — Reflection Resubmission Screen**
```
┌─────────────────────────────────────────┐
│  Reflection — Resubmission              │
│  March 2026                             │
├─────────────────────────────────────────┤
│  Your reflection was flagged by our     │
│  automated system as not meaningful.   │
│                                         │
│  ℹ️  This check is done by an automated │
│  system — not by your mentor or staff.  │
│  Your text remains private.             │
│                                         │
│  You have one chance to resubmit.       │
│  ⏱ Window closes in  31:42:18          │
│                                         │
│  Tips: Write at least 50 words. Share   │
│  real struggles, learnings, or what you │
│  observed in your peers this month.     │
│                                         │
│  [ ________________________________ ]   │
│  [ ________________________________ ]   │
│  [ ________________________________ ]   │
│                                         │
│  Word count: 0 / 50 minimum             │
│                                         │
│  [ Submit Resubmission ]                │
└─────────────────────────────────────────┘
```

**Admin — Create Check-In Session**
```
┌─────────────────────────────────────────┐
│  New Check-In Session                   │
├─────────────────────────────────────────┤
│  Date           [ Mar 18, 2026  ▼ ]    │
│                                         │
│  Cohort         [ Group 1       ▼ ]    │
│                                         │
│  Note (optional)                        │
│  [ ________________________________ ]   │
│                                         │
│  [ Create Session ]                     │
└─────────────────────────────────────────┘
```

**Admin — Create Town Hall**
```
┌─────────────────────────────────────────┐
│  New Town Hall                          │
├─────────────────────────────────────────┤
│  Date           [ Mar 22, 2026  ▼ ]    │
│                                         │
│  Applies to     All Groups (org-wide)   │
│                                         │
│  Submission     Opens after event date  │
│  Window         Closes +48hrs           │
│                                         │
│  [ Create Town Hall ]                   │
└─────────────────────────────────────────┘
```

**Admin — Town Hall Monitoring View**
```
┌─────────────────────────────────────────┐
│  Town Hall · March 2026                 │
├─────────────────────────────────────────┤
│  ATTENDANCE SUMMARY                     │
│                                         │
│  Group 1   ████████████░  4/5  ✅       │
│  Group 2   ██████░░░░░░░  3/5  ✅       │
│  Group 3   ████░░░░░░░░░  2/5  ❌       │
│  Group 4   █████████████  5/5  ✅       │
│                                         │
│  ✅ = majority present  ❌ = majority absent │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  GROUP SENTIMENT — March 2026           │
│  AI-structured summary · anonymous     │
│                                         │
│  Group 1                                │
│  Morale       🟢 High                  │
│  Themes       Growth momentum           │
│               Revenue milestones        │
│  Flags        None                      │
│                                         │
│  Group 2                                │
│  Morale       🟡 Mixed                 │
│  Themes       Team dynamics             │
│               Funding concerns          │
│  Flags        ⚠ 1 member struggling    │
│                                         │
│  Group 3                                │
│  Morale       🔴 Low                   │
│  Themes       Uncertainty               │
│               Motivation                │
│  Flags        ⚠ Group cohesion risk    │
│                                         │
│  Group 4                                │
│  Morale       🟢 High                  │
│  Themes       Product launches          │
│               Peer support              │
│  Flags        None                      │
└─────────────────────────────────────────┘
```
