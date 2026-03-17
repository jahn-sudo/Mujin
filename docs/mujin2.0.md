# Mujin 2.0 — Project Working Document

## Overview

A "Redemptive Fintech" platform that modernizes Japan's historical mutual aid systems. Mujin 2.0 leverages a **Recyclable Grant Model** to provide capital and community to those excluded from Japan's mainstream financial system — bypassing the Money Lending Business Act via Christian Religious Corporation assets.

**Version:** 1.0 (Draft)
**Date:** February 17, 2026
**Owner:** Jonathan (Founder)
**Status:** DRAFT - PENDING LEGAL REVIEW

---

## How to Resume This Project

At the start of a new session, tell Claude:
> *"Read /Users/jonathanahn/Desktop/mujin2.0/docs/mujin2.0.md and resume as the consulting team on Mujin 2.0."*

Claude will re-read this file and pick up from the **Session State** section at the bottom.

**Companion files** (load when working with the relevant persona):
- `/Users/jonathanahn/Desktop/mujin2.0/docs/mujin2.0-ux.md` — UX decisions, user flows, wireframes (Sally)
- `/Users/jonathanahn/Desktop/mujin2.0/docs/mujin2.0-sprints.md` — Epics, build order, sprint stories (Bob / Amelia)

---

## Consulting Team (BMAD Personas)

| Persona | Name | Role | When to Invoke |
| :--- | :--- | :--- | :--- |
| 📊 **Analyst** | Mary | Business Analyst | Market research, competitive analysis, requirements discovery |
| 📋 **PM** | John | Product Manager | PRD creation, feature definition, success metrics |
| 🏗️ **Architect** | Winston | System Architect | Tech stack, system design, scalability decisions |
| 🎨 **UX Designer** | Sally | UX Designer | User flows, wireframes, UI planning |
| 💻 **Dev** | Amelia | Senior Engineer | Story implementation, code, tests |
| 🏃 **Scrum Master** | Bob | Scrum Master | Sprint planning, story creation, sprint tracking |
| 📚 **Tech Writer** | Paige | Technical Writer | Documentation, diagrams, clarity |
| 🚀 **Quick Flow Dev** | Barry | Full-Stack Solo Dev | Fast implementation, quick specs |
| 🧪 **Test Architect** | Murat | Master Test Architect | Test strategy, quality gates, CI/CD |

---

## Goals

- Prove that "Social Collateral" (behavior) is a better predictor of creditworthiness than financial history
- Launch a ¥500,000 Recyclable Grant Program for 50 university students as a pilot
- **Individual graduation metric:** Bank introduction (4 hard gates + exit interview)
- **Program success metric:** Business Manager Visa obtained (org-level lagging indicator; happens downstream after graduation as student grows with bank capital)
- Build financial rails to eventually serve broader credit-invisible populations in Japan

---

## Target Users

### Pilot Focus
- **International students** in Christian student ministry interested in entrepreneurship
- **Japanese youth** locked out of traditional borrowing markets (fear of debt, no co-signer)
- **Refugees** — steepest credit invisibility; second cohort after student pilot

### Key Insight
The church/ministry is not just a real estate play — **it is the distribution channel and trust pipeline.** Ministry leaders are de facto character references. Recruitment for the pilot is largely solved through existing ministry relationships.

---

## The Core Model

### Recyclable Grant Loop
1. **Inflow:** Donor gives to NPO/Religious Corp (tax deductible)
2. **Outflow:** NPO gives ¥500,000 "Venture Scholarship" to student (grant, not loan)
3. **Recycling:** Student signs non-binding "Pledge of Honor" (Seiyaku-sho) — upon success, donates principal + 5% "Success Tithe" back to fund

### Legal Architecture
- **Entity:** Religious Corporation (Shukyo Hojin)
- **Tax Shield:** "Deemed Donation" — up to 20% of co-working revenue donated tax-free to Mutual Aid Fund
- **Key boundary:** Pledge is non-binding. No debt collection. Structured to avoid FSA classification as de facto loan.

### Physical Layer — "Campus-Adjacent" Commons
- Church assets within 15 min walk of major universities
- Mon–Fri: "The Mujin Commons" (secular co-working)
- Sat–Sun: Church / community center
- Church issues Usage Agreement (~¥10,000/mo) satisfying Immigration Bureau's "Physical Office" requirement for Business Manager Visa — applies to **all cohorts** (students and refugees alike)
- Church earns rent income from leasing → flows to church funds (sustainable for the church partner)

---

## The Trust Engine (Core Digital Product)

This is the software we are building. Everything else is the ecosystem.

### Scoring Model

| Signal | How Measured | Weight |
| :--- | :--- | :--- |
| **Responsiveness** | % of bi-weekly in-person mentor check-ins attended (mentor-logged) | 25% |
| **Transparency** | Monthly P&L submitted on time + completeness | 25% |
| **Mutualism** | % of monthly peer Town Halls attended (peer-reported via anonymous form, majority ≥3/5 rules) | 25% |
| **Reflection** | Monthly anonymous reflection submitted + AI-assessed as meaningful | 25% |

### Trust Score → Traffic Light
- 🟢 **Green:** 75–100
- 🟡 **Yellow:** 50–74
- 🔴 **Red:** 0–49

### Graduation Criteria (Bank Introduction Trigger)
1. Company incorporated + product live
2. 3 months non-negative cash flow (or clear breakeven path)
3. 🟢 Green trust score for 6 consecutive months
4. Exit interview passed (staff-conducted, triggered by system when criteria 1–3 met)

**No hard revenue floor.** Revenue trend is a soft signal visible in the exit interview package, not a hard gate.

**Graduation State Machine:** `INELIGIBLE → ELIGIBLE → INTERVIEW_SCHEDULED → INTERVIEW_PASSED / INTERVIEW_FAILED → GRADUATED`

**Exit Interview Package (system-generated):**
- Trust Score history (6-month chart)
- P&L summary (last 6 months revenue / expenses / net)
- Revenue trend (Growing / Stable / Declining)
- Cash flow streak (X consecutive non-negative months)
- Attendance record (check-ins + town halls)
- Aggregated staff notes

### P&L Completeness Scoring (3-Layer Model)
- **Layer A — Binary (system, instant):** Did the student submit before the deadline? NO = score penalized immediately.
- **Layer B — Auto-score (system, on submission):** Revenue filled (+25) + Expenses filled (+25) + Notes provided (+25) + Receipts uploaded if required (+25) = 0–100
- **Layer C — Staff grade (human, async):** Staff can adjust completeness score + add annotation. Override requires written reason (audit trail).
- **Final Transparency score** = 0 (if not submitted) OR Layer B score adjusted by Layer C if staff intervened.

### Reflection Scoring Model
- **Submission:** Student submits anonymous monthly reflection after Town Hall
- **AI Assessment:** Checks for (1) minimum 50 words, (2) coherence (not gibberish/filler), (3) topical relevance (venture, struggles, learnings, peer observations)
- **Result:** `MEANINGFUL` | `NOT_MEANINGFUL` — stored as assessment only; text not visible to mentor or staff
- **Resubmission policy:** One 48-hour resubmission window per quarter. Second flag in the same quarter = score 0, no window. Resets each quarter.
- **Transparency:** Students are informed upfront that an automated system checks for meaningfulness and that staff cannot read their submission.

---

## Risk Assessment

| Risk | Description | Mitigation |
| :--- | :--- | :--- |
| **Regulatory** | FSA views grant as de facto loan | Non-binding pledge. No debt collectors. Legal opinion secured. |
| **Market** | Banks won't recognize Trust Score | Dual-track: JFC + Tokyo regional banks. Entry via FinCity Tokyo + ministry network. |
| **Operational** | Student ghosts after receiving grant | Social Kill-Switch: exclusion from alumni network + university career support |
| **Bank Timing** | Bank MOU not until Q1 2027 | Outreach begins Q2 2026 in parallel with legal review. Initial ask = 30-min call only. |

---

## Roadmap

| Quarter | Milestone |
| :--- | :--- |
| Q2 2026 | Merge legal/ops drafts. Secure legal opinion. Informal bank outreach (1–2 regional banks + JFC). |
| Q3 2026 | Fundraising ($500k). Secure church partner. |
| Q1 2027 | Build Trust Engine MVP. Sign bank MOU. |
| Q2 2027 | **LAUNCH Pilot Cohort (50 Students)** |

---

## Strategic Context

- **Visa Crisis (Oct 16, 2025):** Business Manager Visa capital requirement surged ¥5M → ¥30M
- **The "8050 Problem":** Future demographic target — 80-year-old parents supporting 50-year-old shut-ins
- **The "2030 Problem":** 50% of Protestant churches in Japan face closure by 2030
- **Competitive Whitespace:** Grant orgs give money and walk away. Banks require history students can't build. Mujin is the bridge — no one is doing the full pipeline.

---

## System Architecture (Winston)

### Tech Stack

| Layer | Choice | Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 14+ (App Router, TypeScript) | Full-stack in one repo; strong ecosystem; solo-dev friendly |
| **Database** | PostgreSQL | Relational audit trails; JSON fields for flexibility |
| **ORM** | Prisma | Type-safe queries; migrations; excellent DX |
| **Auth** | Custom JWT (built from scratch) | Future white-label SaaS for non-profits; full control |
| **File Storage** | Cloudflare R2 | S3-compatible; cheap egress; Tokyo PoP |
| **Email** | Resend | Simple API; good deliverability |
| **Hosting** | Vercel (app) + Railway or Supabase (Postgres) | Fast deploys; managed DB |
| **Language** | i18next (EN/JP toggle) | Persists in localStorage |

### Auth Architecture
- **Multi-tenant from day one** — `Organization` is the tenancy root (Mujin = org #1; future non-profits = additional orgs)
- **Roles:** `STUDENT | MENTOR | STAFF | ORG_ADMIN | SUPER_ADMIN`
- **MENTOR constraint:** Cannot hold STAFF or ORG_ADMIN simultaneously (DB-level check constraint)
- **Flow:** Email + password → bcrypt verify → JWT access token (15min) + refresh token (30-day, DB-stored, rotated on use)
- **Compliance:** Consent logging (`ConsentRecord` table), soft-delete + PII anonymization on erasure requests, data retention configurable per org (default: archive 3 years post-graduation)

### Core Data Model

| Entity | Purpose |
| :--- | :--- |
| `Organization` | Tenancy root |
| `User` | Belongs to org; role-gated |
| `MentorCohortAssignment` | Links MENTOR user to exactly one Cohort (1:1 enforced) |
| `Cohort` | Group of 5 students within an org |
| `Student` | Extends User; venture profile |
| `CheckInSession` | Bi-weekly event, staff creates |
| `AttendanceRecord` | Student × CheckInSession → present/absent |
| `TownHall` | Monthly event, staff creates |
| `TownHallSubmission` | Student anonymous form — attendance report + reflection text |
| `ReflectionAssessment` | AI result (`MEANINGFUL` / `NOT_MEANINGFUL`) + resubmission state; text never returned in staff queries |
| `PLSubmission` | Monthly; revenue/expenses/net/notes/receipts; auto_score + staff_score + final_score |
| `PLReview` | Staff action on a PLSubmission |
| `TrustScore` | Computed monthly per student; stored (full audit trail) |
| `TrustScoreOverride` | Staff override + required written reason |
| `GraduationRecord` | Checklist state + graduation_status state machine |
| `ConsentRecord` | ToS version + timestamp (APPI/GDPR) |

### Scoring Engine
Runs server-side on every trigger (attendance marked, P&L finalised, reflection assessed, override applied). Writes to DB — never computed live on read.

```
score = (responsiveness_pct × 0.25) + (transparency_pct × 0.25) + (mutualism_pct × 0.25) + (reflection_pct × 0.25)

responsiveness_pct = check-ins attended / check-ins held (rolling 3 months)
transparency_pct   = final P&L completeness score (Layer B adjusted by Layer C)
mutualism_pct      = town halls attended / town halls held (rolling 3 months)
reflection_pct     = 100 if MEANINGFUL, 0 if NOT_MEANINGFUL or not submitted
```

### Compliance
- **APPI + GDPR:** Consent logging, data minimization, right to erasure (soft-delete + anonymize), configurable retention policy
- **Encryption:** At-rest via DB provider; sensitive receipt files server-side encrypted before R2
- **Data residency:** Vercel Edge + Railway JP region; R2 Tokyo PoP available
- **Reflection privacy:** `reflection_text` column never selected in staff-facing queries by design

---

## Session State
> Last updated: 2026-03-17 (session 7)
> Current phase: **MVP Complete — Ready for QA / Deploy**
> Last active persona: **Amelia (Dev) — All 8 sprints done. 231 tests passing. Dev server running at http://localhost:3000.**

### Decisions Made
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

### Open Questions
1. ~~**Pilot cohort size**~~ — Resolved.
2. ~~**Grant size + disbursement**~~ — Resolved.
3. ~~**Refugee cohort definition**~~ — Resolved.
4. ~~**Bank relationship**~~ — Resolved.

### Next Steps
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
13. **Next session: QA / manual walkthrough + decide on deployment (Vercel + Railway)**

### Seed Accounts (local dev)
- **Admin:** `admin@mujin.jp` / `mujin2026!` (role: ORG_ADMIN, org: org-mujin)
- **Student:** `student@mujin.jp` / `student2026!` (role: STUDENT, has StudentProfile)
- Org ID: `org-mujin` | Seeded directly via pg (no venture profile or cohort assigned yet)

### Infrastructure
- **Railway Postgres:** provisioned. Public URL: `ballast.proxy.rlwy.net:44544`. Internal URL: `postgres.railway.internal:5432` (use for Railway deployment).
- **First migration:** `20260316165517_init` — applied. All 8 base tables live.
- **Sprint 2 migrations applied:**
  - `20260317141539_add_cohort_max_students`
  - `20260317143706_add_invite_token_venture_category`
  - `20260317144001_add_student_profile_venture_pledge`
- **Sprint 3 migrations applied:**
  - `20260317153304_add_checkin_attendance`
  - `20260317154153_add_townhall_reflection`
  - `20260317155729_add_pl_submission_review`
- **Sprint 4 migration applied:**
  - `20260317161744_add_trust_score`
- **Sprint 6 migration applied:**
  - `20260317181832_add_graduation_record`
- **New dependencies:** `@anthropic-ai/sdk` (reflection AI assessment), `@aws-sdk/client-s3` (Cloudflare R2 receipt upload)
- **Test framework:** Jest + ts-jest. 231 tests passing across 22 suites.
- **Dev server:** `npm run dev` → http://localhost:3000. Next.js 16 proxy convention: `src/proxy.ts` (renamed from middleware.ts; exports `proxy` function).
- **Auth flow:** Login → POST /api/auth/login → reads `Authorization: Bearer <token>` from response header → saved to localStorage as `mujin_session`. Dashboard pages are client-side auth-guarded.
- **Sprint 5 pages live:** `/login`, `/dashboard/student`, `/dashboard/student/pl/[month]`, `/dashboard/student/townhall/[id]`, `/dashboard/student/inbox`, `/dashboard/admin`, `/dashboard/admin/students/[id]`, `/dashboard/admin/pl-reviews`, `/dashboard/admin/townhalls/[id]`
- **Sprint 6 graduation routes:** `GET/POST /api/admin/students/[id]/graduation`, `POST .../schedule-interview`, `POST .../record-interview`, `POST .../trigger-bank-intro`
- **Sprint 7 notifications:** Email wired into scoring (S9.4 RED alert) and detectEligibility (S9.3 graduation eligible). Cron route: `POST /api/cron/send-notifications` (Vercel daily at 09:00). `vercel.json` configured.
- **Sprint 8 i18n:** `i18next` + `react-i18next` installed. EN/JP toggle in nav (persists to localStorage). Locale files: `src/locales/en.json` + `src/locales/ja.json`. All student + admin-facing strings translated.
