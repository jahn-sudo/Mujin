# Mujin 2.0 — Session History

All completed session logs, the full Decisions Made record, and the completed Next Steps changelog. Extracted from the working doc after session 20.

---

## Sessions 1–12: Sprint Build Phase

Sessions 1–12 were not individually logged by name. Work in this phase is captured through the Next Steps changelog below (items 1–26) and the sprint stories in `mujin2.0-sprints.md`.

**Summary of what sessions 1–12 covered:**

- Session 1–2: Product definition, scoring model, legal architecture, initial PRD and architecture with Winston and John
- Session 3: Sprint planning with Bob (Scrum Master) — Epics E1–E10 defined and ordered
- Session 4: Sprint 1 — E1 Foundation & Auth (Amelia) — Organization, User, JWT, roles, seed
- Session 5: E2 schema design (Winston) + Sprint 2 — E2 Onboarding (Amelia) — Cohort, InviteToken, StudentProfile, VentureProfile, PledgeRecord
- Session 6: Sprint 3 — E3 Attendance + E4 P&L in parallel (Amelia) — CheckInSession, AttendanceRecord, TownHall, TownHallSubmission, ReflectionAssessment, PLSubmission, PLReview
- Session 7: Sprint 4 — E5 Scoring Engine (Amelia) — TrustScore, TrustScoreOverride, scoring algorithm, test suite
- Session 8: Sprint 5 — E6 + E7 Dashboards in parallel (Amelia) — student dashboard, admin dashboard, all role views
- Session 9: Sprint 6 — E8 Graduation Tracking (Amelia) — GraduationRecord, state machine, exit interview package
- Session 10: Sprint 7 — E9 Notifications (Amelia) — RED alert email, graduation eligible email, Vercel cron. Check-in notes feature (student submission + mentor grading + staff metrics). Deploy to Vercel + Railway.
- Session 11: Google Sheets application intake + admin review queue. Public marketing site (homepage, /about, /program, /team, /alumni, /faq). [TEST] stakeholder demo pages.
- Session 12: Sprint 8 — E10 i18n EN/JP (Amelia). Full UX overhaul (emojis removed, [TEST] → Demo banners, indigo purged). Homepage cinematic overhaul (dark hero, Cormorant Garamond, scroll animations). QA walkthrough. Mentor demo page.

---

## Session 13 — Completed

- Public site simplified (homepage trimmed to 6 sections, /about de-duped, /program operational language removed, /alumni journey section removed, team bios cut to 1 paragraph)
- Frontier Commons attribution added to all 6 page footers + /about section (links to frontiercommons.org)
- `.env.local` created for local dev (JWT secrets generated, DATABASE_URL pointed to Railway)
- `/activate` page built — token validation, password set, ToS checkbox, redirects to /login?activated=1 with success banner
- `/dashboard/admin/cohorts` page built — create cohorts, expand/assign students, invite mentors by email, unassigned students panel
- `GET /api/admin/students` route added — lists all activated students with cohort assignment status
- "Cohorts" nav link added to admin dashboard nav
- `GrantTranche2` schema + migration (`20260318155245_add_grant_tranche2`) applied to Railway
- `GET /api/admin/students/[id]/grant` — tranche 1 from pledge, tranche 2 eligibility (M2/M3 scores)
- `POST /api/admin/students/[id]/grant/release-tranche2` — validates conditions, writes audit record
- Grant Disbursement card added to student detail page with eligibility checklist + release form
- `/dashboard/student/pledge` page built — full 7-clause Pledge of Honor (EN + JP title, versioned 1.0), acknowledgement checkbox, signs via POST /api/student/pledge
- Student dashboard pledge guard — checks pledge on load, redirects to /pledge if not signed

---

## Session 14 — Completed

- Town Hall Form emoji removed from en.json + ja.json locale files
- `BankIntroTracking` model added to schema — migration `20260318161620_add_bank_intro_tracking` applied to Railway
- `GET/PUT /api/admin/students/[id]/graduation/bank-tracking` — upserts bank tracking, GRADUATED-only
- Bank intro tracking card added to student detail page — 4-milestone strip + edit form
- `ALUMNI` role added to `Role` enum — migration `20260318162238_add_alumni_role` applied to Railway
- `trigger-bank-intro` now also transitions `User.role → ALUMNI` (in a single DB transaction)
- `/api/alumni` added to proxy PROTECTED_ROUTES (roles: ALUMNI, STAFF, ORG_ADMIN, SUPER_ADMIN)
- `GET /api/alumni/me` — alumni journey summary (venture, grad record, bank milestones, trust history)
- `GET /api/alumni/directory` — all alumni in org (venture, category, cohort, bank milestones)
- `/dashboard/alumni/page.tsx` — personal alumni dashboard (venture summary, trust score bar chart, bank journey milestones)
- `/dashboard/alumni/directory/page.tsx` — community directory (cards with milestone dots per alumnus)
- Layout updated: `isAlumni` detection, Alumni nav (Dashboard + Community), redirect guard (alumni → /dashboard/alumni)
- Alumni seed account added to `prisma/seed.ts`: `alumni@mujin.jp / alumni2026!` with full journey data

---

## Session 15 — Completed

- Seed fixed (Prisma 7.x client path + PledgeRecord userId fix) and run against Railway prod
- Alumni seed account live: `alumni@mujin.jp / alumni2026!`
- Application detail page: indigo back link → gray, bright Accept/Waitlist/Reject buttons → neutral (gray-900 / outlined), emojis removed
- Deployed to production: https://mujin2.vercel.app

---

## Session 16 — Completed

**Bug fixes:**

- **Login 500 (local):** `issueRefreshToken` used a two-step write with `tokenHash: "pending"` as a placeholder. Since `tokenHash` has a unique constraint, the 2nd login attempt crashed. Fixed: generate UUID upfront, sign JWT with that ID, compute hash, create record in a single write. Deleted 1 stale "pending" row from Railway prod.
- **Login 500 (production — root cause):** Prisma 7's generated TypeScript client (`src/generated/prisma/client.ts`) runs `globalThis['__dirname'] = path.dirname(fileURLToPath(import.meta.url))` at module load time. In Vercel's production Turbopack build, `import.meta.url` is not a valid `file://` URL, causing `fileURLToPath` to throw. This crashes the module import chain for every API route using Prisma. **Fix:** Added `serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"]` to `next.config.ts`, preventing Turbopack from bundling these packages and letting Node.js load them natively.
- **Vercel Deployment Protection:** The entire site was gated behind Vercel SSO, blocking all external requests. User disabled this in the Vercel dashboard (Settings → Deployment Protection → None).
- **DATABASE_URL trailing newline:** Production env var had a `\n` embedded. Re-set via `vercel env add DATABASE_URL production --force`.
- **PrismaPg SSL:** Added `ssl: { rejectUnauthorized: false }` for production in `src/lib/prisma.ts` to handle Railway's SSL requirement from Vercel's AWS network.

**Alumni dashboard polish:**

- `/dashboard/alumni/demo` page added — hardcoded YenWise seed data: venture summary, 8-month trust score bar chart, 4-milestone bank journey, community directory tab (3 alumni cards). Demo nav link added to alumni nav.
- Live alumni dashboard simplified: removed venture summary card, trust score chart, and bank milestones (no real company tied yet). Now shows: "Welcome back" + cohort name + two nav cards (Community Directory / Demo). Graduation date hidden.

**Infrastructure notes:**

- `next.config.ts` now has `serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"]`
- `src/lib/prisma.ts` now has `ssl: { rejectUnauthorized: false }` for production
- `src/lib/auth/tokens.ts` — `issueRefreshToken` rewritten to single-write (no "pending" placeholder)

---

## Session 17 — Completed

- Alumni login was broken on `mujin2.vercel.app` — root cause: `vercel --prod` only auto-aliases `www.mujin2vercel.app`, not `mujin2.vercel.app`. The old deployment (with a pre-ALUMNI role Prisma client) was still live.
- Fix: manually ran `vercel alias set <deployment-url> mujin2.vercel.app` to point to latest build.
- Added `r.ok` check to alumni dashboard page (was silently swallowing API errors → infinite Loading state).
- Added error logging to `/api/alumni/me` route.
- **Deploy pattern updated:** always run `vercel alias set` after `vercel --prod --yes`.

---

## Session 18 — Completed

- **Alumni showing as unassigned in cohorts page** — root cause: `GET /api/admin/students` used `where: { user: { orgId } }` with no role filter; alumni (who have StudentProfiles) appeared. Fixed: `where: { user: { orgId, role: "STUDENT" } }`
- **Email delivery not working** — Resend free tier restricts sending to account owner's email only. Needs a verified domain (SPF/DKIM via Resend DNS records). Temporary workaround: pull InviteToken directly from Railway DB via SQL query.
- **How to promote graduate to alumni** — explained the graduation state machine: Schedule Interview → Record Interview → Trigger Bank Introduction (atomically sets `GraduationStatus.GRADUATED` + transitions `User.role → ALUMNI`).
- All 4 seed accounts verified working on mujin2.vercel.app.
- Full i18n pass completed (5 previously untranslated pages + 2 minor gaps + nav bar + all demo pages).
- Alumni dashboard blank sections added (matching demo layout: venture, trust score chart, bank journey).
- Town Hall dedicated card added to student dashboard; Town Hall form emoji fix.
- Team page: Jonathan Ahn (Founder) + Andrew Feng (Director of Programs) added.

---

## Session 19 — Completed (combined with Session 18 in final working doc)

- **50-student demo seed** — 10 cohorts (Alpha–Kappa), deterministic pseudo-random trust scores/P&L, all 4 score profiles (GREEN_STRONG, GREEN_STEADY, YELLOW_RECOVERING, RED_ATRISK), graduation states, check-in sessions + attendance, town halls + reflections, check-in notes + grades for Cohort Alpha
- Notable demo students: Kai Watanabe (GREEN_STRONG, PayRoute, INTERVIEW_SCHEDULED), Yuki Tanaka (ELIGIBLE), Nana Kobayashi (RED_ATRISK, TsunagiNet, Cohort Gamma)
- Demo mentors: `mentor.alpha@demo.mujin.jp` through `mentor.kappa@demo.mujin.jp` / `mentor2026!`
- Demo students password: `demo2027!`
- **Demo data isolation** — `src/lib/demo.ts` exports `DEMO_COHORT_IDS` + `DEMO_EMAIL_DOMAIN`. All regular admin routes now filter OUT demo data. Demo-only endpoints return ONLY demo data.
- **Admin demo page** → now calls `GET /api/admin/demo/dashboard` (real seeded data, 50 students across 10 cohorts, real traffic lights, needs-attention panel)
- **Student demo page** → now calls `GET /api/student/demo/snapshot` (always returns Kai Watanabe's data regardless of logged-in student)
- **Mentor demo page** → kept as hardcoded constants (was already a good stakeholder preview; no API migration needed)
- **New routes:** `GET /api/admin/demo/dashboard`, `GET /api/mentor/cohort-summary`, `GET /api/student/demo/snapshot`
- **Site declared complete** — all 3 demo tabs working, full demo data live on mujin2.vercel.app
- **Bug:** TypeScript build error — `DEMO_COHORT_IDS` is `readonly`, must spread as `[...DEMO_COHORT_IDS]` in Prisma `in:` filters. Fixed.

---

## Session 20 — Completed

- **First external feedback processed** — coworker's wife (Japanese Christian) provided 6 reactions: kanji branding, ice age generation targeting, church conservatism, visa strategy, org registry types, legal/finance
- **Brand confirmed: 無尽（むじん）** — kanji locks in historical legitimacy; 無尽講 is Japan's original rotating mutual aid association; not a foreign import — a revival. Tagline: "Bringing back 無尽."
- **ISM conference notes analyzed** (`/Users/jonathanahn/Desktop/Work/IFI/Conference Notes.docx`) — key findings:
  - Practical life support IS the ministry; "life-support ministry often outweighs traditional programs"
  - Visa support called "most urgent issue" by pastors
  - 350,000 international students in Japan (92% Asian, 33% Chinese)
  - Churches actively seek community partners
  - Networks: KGK, CCC, JCMN, Lausanne, Japan Evangelical Association
- **Taito City Multicultural Coexistence Promotion Plan (FY2022–2026) identified** (https://www.city.taito.lg.jp/kurashi/kyodo/tabunka/kyouseiplan.files/eigo.pdf):
  - Government mandate actively seeking community partner organizations
  - Zero overlap with Mujin's entrepreneurship/financial inclusion focus — Mujin fills the gap
  - Registration pathway exists for multicultural coexistence supporting organizations (Measure 5, Direction 11 + 12)
  - "Toda City" referenced in conference notes was a misspelling of Taito City — same story, same framework
  - FY2027 cycle alignment: Mujin's pilot launch timing aligns with next planning cycle
- **Founding manifesto drafted** — dual-language EN/JP alternating paragraphs, theological framing (Acts 8 diaspora theology), 無尽講 historical anchor, government alignment line, no specific church names. Full text saved at `/Users/jonathanahn/Desktop/mujin2.0/docs/mujin2.0-manifesto.md`
- **Mary (Analyst) reviewed manifesto** — 5 annotations:
  1. (Critical) Add named contact + single next step — inspired pastors need one defined action
  2. (Critical) Add one line of organizational identity — trust requires accountability
  3. Replace "familiar gods" → "familiar shores" — removes unintended theological landmine
  4. Replace "tithe" → "covenant gift" — respects Japanese church theology
  5. Clarify student recipient is entrepreneurially-minded earlier in document
- **Government alignment line added** to manifesto: "Tokyo's wards are already building frameworks for multicultural coexistence. They are looking for community partners to reach where government cannot. The church is that partner."
- **Distribution strategy confirmed** — Andrew Feng is already known to ISM network (IFI background); parachurch orgs (KGK, CCC, JCMN) are the side door, not individual cold church outreach
- **Pastor contact identified in Japan** — manifesto to be sent via email + PDF (Canva A4, serif font, white background); cover email template saved in manifesto doc
- **mujin2.0.md split into 3 files** — lean main doc (vision/goals/roadmap/session state), tech doc (this companion), sessions doc (this file)

---

## Decisions Made

*Complete list of all product, technical, and operational decisions made across sessions 1–20.*

- Trust Engine = algorithm-processed, human-reviewable (hybrid)
- Pilot recruitment = international student ministry (church is the pipeline)
- Success metric = students graduating to traditional bank borrowing
- Refugee cohort = second wave after student pilot; unified model (same product); asylum seekers deferred
- Mission alignment filter = 3-part intake: Japan pain point statement (300w) + faith motivation statement (300w) + ministry leader endorsement
- The software to build = Trust Engine dashboard (scoring + human review)
- Human reviewers = Mujin staff only
- P&L submission = structured web form + receipts ≥¥50,000 + 10–20% random spot audit
- Check-in cadence = bi-weekly in-person (mentor logs attendance)
- Town Hall = monthly peer-led (no mentor/admin present); attendance via anonymous form (majority ≥3/5 rules; non-submission = absent); staff sees aggregate sentiment only
- Device = desktop-first, mobile-responsive
- Language = English primary, Japanese toggle (persists to localStorage)
- Trust Score visibility = within group only (groups of 5)
- Scoring weights: Responsiveness 25% / Transparency 25% / Mutualism 25% / Reflection 25%
- No hard revenue floor for graduation — revenue trend is soft signal in exit interview package
- Graduation = 4 hard gates: company incorporated, 3mo non-negative cash flow, 6mo Green streak, exit interview passed
- P&L completeness = 3-layer model (A: binary submission, B: auto-score, C: staff override)
- Reflection = AI-assessed (50+ words, coherent, topically relevant); text not visible to mentor or staff; resubmission once per quarter (48hrs); second flag same quarter = score 0
- Students informed upfront that AI (not staff) checks reflection meaningfulness
- Auth = custom JWT, multi-tenant from day one (future SaaS for non-profits)
- Tech stack = Next.js 14+ / TypeScript / PostgreSQL / Prisma / Cloudflare R2 / Resend / Vercel
- Pilot = 50 students (10 groups × 5)
- Mentor role = distinct; owns one group; can only see own group's data; volunteers/alumni eligible; cannot hold STAFF/ADMIN simultaneously (DB-enforced)
- Grant disbursement = 2-tranche: ¥300K on signing / ¥200K released at Month 3 (company incorporated + no Red score at M2 or M3)
- Grant allowable use = early venture operations only (office, tools, hosting, travel, marketing, incorporation fees — no personal living expenses)
- Bank strategy = dual-track: JFC (government) + Tokyo regional private banks (Kiraboshi, Tokyo Star primary). Entry via FinCity Tokyo, Fintech Association of Japan, ministry network. Value prop: warm referral + trust dossier, no liability transfer. Initial ask = 30-min call. Outreach Q2 2026 parallel to legal review. MOU target Q1 2027.
- Applications managed via Google Forms → Google Sheets (no application module in system; pilot scale)
- Cohorts = mixed venture categories (not same-category grouping) — prevents competition corrupting mutualism score
- Venture category used for mentor matching only (downstream), not cohort sorting
- Venture categories: FINTECH, EDTECH, HEALTHTECH, SOCIAL_ENTERPRISE, ECOMMERCE, FOOD_BEVERAGE, CREATIVE_MEDIA, OTHER — selected on Google Form; staff enters in system after acceptance
- E2 schema additions locked: `Cohort` (maxStudents), `InviteToken` (activation links for accepted students + mentors), `StudentProfile` (cohortId, ventureCategory), `VentureProfile` (name, description, coFounders), `PledgeRecord` (immutable, versioned audit trail), `VentureCategory` enum
- E3 schema additions locked: `CheckInSession` (cohortId, date, note, attendanceSubmittedAt — locked on submit), `AttendanceRecord` (studentProfileId × checkInSessionId, present, @@unique), `TownHall` (orgId, date — org-wide), `TownHallSubmission` (townHallId × submittedById @@unique, attendeeIds[], attended nullable, reflectionText — never returned to staff), `ReflectionAssessment` (submissionId @@unique, result enum, resubmissionState enum, windowExpiresAt, quarter), `ReflectionResult` enum (MEANINGFUL/NOT_MEANINGFUL), `ResubmissionState` enum (NONE/WINDOW_OPEN/WINDOW_EXPIRED/RESUBMITTED/LOCKED)
- E4 schema additions locked: `PLSubmission` (studentId × month @@unique, revenue/expenses/net, notes, receiptUrls[], autoScore/staffScore/finalScore, status enum, spotAudit bool — 15% probability at generation), `PLReview` (submissionId, staffId, action enum, annotation — internal only, scoreOverride, overrideReason — required on SCORE_OVERRIDE), `PLSubmissionStatus` enum (PENDING/SUBMITTED/APPROVED/FLAGGED/MORE_INFO), `PLReviewAction` enum (APPROVED/FLAGGED/MORE_INFO/SCORE_OVERRIDE)
- Town Hall sentiment summary = structured (Morale / Themes / Flags) — AI-generated, no free text; enables objective staff review
- Reflection flag notification = delivered via student Inbox with live countdown timer; resubmission accessed from Inbox item
- AI model for reflection assessment = `claude-haiku-4-5-20251001` (binary classification, ~$0.0003/call)
- Receipt storage = Cloudflare R2 via `@aws-sdk/client-s3`; key pattern: `receipts/{orgId}/{studentId}/{month}/{uuid}`
- Layer B auto-score formula: revenue(+25) + expenses(+25) + notes non-empty(+25) + receipts if expenses≥¥50k else free(+25)
- Majority-rule computation: threshold = ceil(submissionCount / 2); re-computed on every new submission (idempotent)
- Check-in notes = student submits 3-part structured form (agenda recap, actionItems, reflection) after each bi-weekly session; editable until mentor grades; locked after
- Check-in grading = mentor submits 1–5 star rating + written feedback per student note; feedback visible to student after grading
- Staff sees check-in metrics only (submission count, avg rating) — zero note content visible to staff
- Admin role = third-party oversight only; never attends meetings; reviews dashboards to decide graduation
- Town Halls = peers only (no mentor/admin present) — confirmed
- Check-in sessions = mentor + student bi-weekly — confirmed
- `CheckInNote` schema: checkInSessionId × studentProfileId @@unique, agendaRecap/actionItems/reflection, grade relation
- `CheckInGrade` schema: noteId @@unique, mentorId, rating (1–5), feedback, gradedAt
- Brand name: 無尽（むじん） — kanji form only; 無尽講 is the historical anchor
- Distribution: parachurch networks (KGK, CCC, JCMN) via Andrew Feng — not cold church outreach
- Manifesto format: dual-language EN/JP alternating paragraphs; Canva A4, serif font, white background
- "Familiar shores" not "familiar gods" in manifesto (avoids conversion program perception)
- "Covenant gift" not "tithe" in manifesto (respects Japanese church theology)
- Contact on manifesto: Andrew Feng by name (his network credibility is a trust signal)

---

## Next Steps Changelog (All 29 Items — All Completed)

1. ~~John (PM) — OQ #4: bank relationship strategy~~ ✅
2. ~~Winston (Architect) — architecture update: MENTOR role, Town Hall, 4-signal scoring~~ ✅
3. ~~Bob (Scrum Master) — update sprint stories~~ ✅
4. ~~Amelia (Dev) — Sprint 1 (E1 — Foundation & Auth)~~ ✅
5. ~~Winston (Architect) — E2 schema design~~ ✅
6. ~~Amelia (Dev) — Sprint 2 (E2 — Onboarding)~~ ✅
7. ~~Amelia (Dev) — Sprint 3 (E3 Attendance + E4 P&L, parallel)~~ ✅
8. ~~Amelia (Dev) — Sprint 4 (E5 — Scoring Engine)~~ ✅
9. ~~Amelia (Dev) — Sprint 5 (E6 + E7 — Dashboards, parallel)~~ ✅
10. ~~Amelia (Dev) — Sprint 6 (E8 — Graduation Tracking)~~ ✅
11. ~~Amelia (Dev) — Sprint 7 (E9 — Notifications)~~ ✅
12. ~~Amelia (Dev) — Sprint 8 (E10 — i18n EN/JP)~~ ✅
13. ~~Deploy to Vercel + Railway~~ ✅
14. ~~Add [TEST] stakeholder demo pages (admin + student)~~ ✅
15. ~~Check-in notes feature: student submission + mentor grading + staff metrics~~ ✅
16. ~~Investigate + fix client-side exception on mentor dashboard (sessions.filter crash on 404 response)~~ ✅
17. ~~Add mentor demo page + [TEST] nav tab~~ ✅
18. ~~QA walkthrough (all 3 roles, production)~~ ✅
19. ~~Full i18n pass — all 6 previously hardcoded pages (student townhall, student checkin, admin P&L reviews, admin townhall monitoring, mentor dashboard, mentor checkin grading) now use t()~~ ✅
20. ~~i18n extended to all 3 [TEST] demo pages (student, admin, mentor) — toggle now affects full site~~ ✅
21. ~~Google Sheets application intake + admin review queue (Applications page + detail + review)~~ ✅
22. ~~Public marketing site — homepage, /about, /program, /team, /alumni, /faq~~ ✅
23. ~~Full UX overhaul — emojis removed, [TEST] → Demo banners, indigo purged, SVG checkmarks, consistent nav height, loading indicators~~ ✅
24. ~~Homepage cinematic overhaul — dark hero, Cormorant Garamond + IBM Plex Mono fonts, transparent nav on scroll, FadeUp scroll animations, grain texture, comparison section, animated bars, live pulse indicator~~ ✅
25. ~~Team page — Jonathan Ahn (Founder) + Andrew Feng (Director of Programs)~~ ✅
26. ~~Town Hall form emoji fix (✅ → text, ✓ → SVG); Town Hall dedicated card added to student dashboard~~ ✅
27. ~~Alumni live dashboard — blank sections matching demo layout (venture, trust score chart, bank journey)~~ ✅
28. ~~Full i18n pass — 5 untranslated pages (pledge, cohorts, applications, application detail, alumni directory) + 2 minor gaps (student/admin dashboard) now fully translated~~ ✅
29. ~~Nav bar + all demo pages fully translated — nav.demo, nav.community, nav.applications, nav.cohorts added; alumni/demo wired to useTranslation~~ ✅
