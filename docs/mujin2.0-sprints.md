# Mujin 2.0 — Sprint Plan (Bob)

> Companion file to `mujin2.0.md`. Load when sprint planning, writing stories, or executing builds.

---

## Epic Overview

| # | Epic | Depends On |
| :--- | :--- | :--- |
| E1 | Foundation & Auth | — |
| E2 | Onboarding | E1 |
| E3 | Attendance Logging | E1, E2 |
| E4 | P&L Submission & Review | E1, E2 |
| E5 | Scoring Engine | E3, E4 |
| E6 | Student Dashboard | E5 |
| E7 | Admin Dashboard | E5 |
| E8 | Graduation Tracking | E5, E7 |
| E9 | Notifications | E3, E4, E8 |
| E10 | Internationalisation (EN/JP) | E6, E7 |

---

## Build Order

```
Sprint 1:  E1 — Foundation & Auth
Sprint 2:  E2 — Onboarding
Sprint 3:  E3 + E4 — Attendance + P&L (parallel)
Sprint 4:  E5 — Scoring Engine
Sprint 5:  E6 + E7 — Dashboards (parallel)
Sprint 6:  E8 — Graduation Tracking
Sprint 7:  E9 — Notifications
Sprint 8:  E10 — Internationalisation
```

---

## Stories

**E1 — Foundation & Auth** ✅ Sprint 1 Complete
- ✅ S1.1 Scaffold Next.js project (TypeScript, App Router, Prisma, PostgreSQL)
- ✅ S1.2 Define base data model: `Organization`, `User`, `Role` (includes `MENTOR` role + `MentorCohortAssignment` table)
- ✅ S1.3 Build registration endpoint (email + password, bcrypt, org-scoped)
- ✅ S1.4 Build login endpoint (JWT access token + refresh token, DB-stored)
- ✅ S1.5 Build refresh token rotation (invalidate old, issue new)
- ✅ S1.6 Build auth middleware (role-gated route protection)
- ✅ S1.7 Password reset flow (email token, expiry, one-time use)
- ✅ S1.8 Consent logging (`ConsentRecord` table)
- ✅ S1.9 Enforce MENTOR/STAFF mutual exclusion at DB level (check constraint)

**E2 — Onboarding** ✅ Sprint 2 Complete
- S2.1 Staff creates a `Cohort` (name, org, max 5 students)
- S2.2 Staff enters accepted applicant's email + role → system generates activation link + sends email (`InviteToken`); applications managed externally via Google Forms → Sheets
- S2.3 Student clicks activation link → creates account → onboarding flow
- S2.4 Student signs Pledge of Honor (digital checkbox + timestamp + IP logged in `PledgeRecord`; pledge version stored)
- S2.5 Student creates venture profile (name, description, co-founders) + selects venture category (matches Google Form dropdown: FINTECH / EDTECH / HEALTHTECH / SOCIAL_ENTERPRISE / ECOMMERCE / FOOD_BEVERAGE / CREATIVE_MEDIA / OTHER)
- S2.6 Staff manually assigns student to cohort (mixed categories — no auto-sort); enforces max 5
- S2.7 Staff assigns mentor to cohort via activation link (1:1 constraint enforced; mentor gets activation email)

**E3 — Attendance Logging** ✅ Sprint 3 Complete
- S3.1 Staff creates `CheckInSession` (date, cohort)
- S3.2 Mentor marks present/absent per student (own cohort only) → `AttendanceRecord` written
- S3.3 Staff creates `TownHall` (date, org-wide)
- S3.4 Student submits anonymous `TownHallSubmission` (attendance report + reflection text); non-submission = absent
- S3.5 System applies majority-rule to town hall attendance (≥3/5 present = attended; ties go absent)
- S3.6 AI assesses reflection on submission (min 50 words, coherence, topical relevance) → `MEANINGFUL` / `NOT_MEANINGFUL` stored in `ReflectionAssessment`; text never surfaced in staff-facing queries
- S3.7 Resubmission window logic: one 48hr window per quarter on first flag; second flag same quarter = score 0, no window; state tracked in `ReflectionAssessment`

**E4 — P&L Submission & Review** ✅ Sprint 3 Complete
- S4.1 System generates monthly `PLSubmission` record per student on 1st of month
- S4.2 Student submits P&L form (revenue, expenses, net auto-calc, notes)
- S4.3 Receipt upload to Cloudflare R2 (required if expenses ≥ ¥50,000)
- S4.4 System auto-scores completeness on submission (Layer B: 0–100)
- S4.5 Staff P&L review screen (approve / flag / request more info)
- S4.6 Staff can override completeness score with written reason (Layer C)
- S4.7 Staff internal annotation field (not visible to student)
- S4.8 Random spot audit flag (10–20% of submissions flagged automatically)

**E5 — Scoring Engine** ✅ Sprint 4 Complete
- S5.1 Implement `calculateTrustScore(studentId, month)` function (4-signal: Responsiveness 25% / Transparency 25% / Mutualism 25% / Reflection 25%)
- S5.2 Write score to `TrustScore` table on each trigger
- S5.3 Staff score override → `TrustScoreOverride` record (written reason required)
- S5.4 Traffic light assignment (🟢 75–100 / 🟡 50–74 / 🔴 0–49)
- S5.5 6-consecutive-month Green streak detector (graduation input)
- S5.6 Reflection score computation: 100 if `MEANINGFUL`, 0 if `NOT_MEANINGFUL` or not submitted (resubmission window active = score pending)

**E6 — Student Dashboard** ✅ Sprint 5 Complete
- S6.1 Trust score display (traffic light + number + breakdown bars)
- S6.2 Score breakdown (Responsiveness / Transparency / Mutualism / Reflection — 4 bars)
- S6.3 Graduation progress checklist (4 hard gates + interview status)
- S6.4 Upcoming events widget (P&L due date, next Town Hall)
- S6.5 Cohort group view (first names/initials + traffic light, within group only)
- S6.6 Anonymous Town Hall form UI (attendance report + reflection text field; word count indicator; one submission per month)
- S6.7 Resubmission flow UI: notification when reflection flagged + 48hr countdown + resubmission form; messaging clarifies AI (not staff) assessed it

**E7 — Admin Dashboard** ✅ Sprint 5 Complete
- S7.1 "Needs Attention" panel (Red students sorted by score ascending)
- S7.2 All students view (grouped by cohort, traffic light per student)
- S7.3 "Actions Due" panel (P&L reviews pending, next check-in date)
- S7.4 Per-student detail view (score history, P&L history, attendance, staff notes)
- S7.5 Auto-generated exit interview package
- S7.6 Town Hall monitoring view: aggregate attendance per group (majority-rule result) + anonymous group sentiment summary; no individual reflection text surfaced

**E8 — Graduation Tracking** ✅ Sprint 6 Complete
- ✅ S8.1 System detects all 3 hard criteria met → `graduation_status = ELIGIBLE`
- ✅ S8.2 Staff schedules exit interview (date logged, status → INTERVIEW_SCHEDULED)
- ✅ S8.3 Staff marks interview pass/fail (fail resets trust score streak)
- ✅ S8.4 Staff triggers bank introduction (status → GRADUATED, `bank_intro_date` written)

**E9 — Notifications** ✅ Sprint 7 Complete
- ✅ S9.1 P&L submission reminder (student, 7 days before month end) — cron day 24
- ✅ S9.2 P&L overdue alert (student, day after deadline missed) — cron day 1
- ✅ S9.3 Graduation eligible alert (staff) — wired into detectEligibility on ELIGIBLE transition
- ✅ S9.4 Red score alert (staff) — wired into calculateTrustScore on RED label
- ✅ S9.5 Check-in session reminder (mentor + staff) — cron daily, sessions scheduled tomorrow

**E10 — Internationalisation (EN/JP)** ✅ Sprint 8 Complete
- ✅ S10.1 Set up i18next with EN and JP locale files
- ✅ S10.2 EN/JP toggle in nav (persists to localStorage)
- ✅ S10.3 Translate all student-facing strings
- ✅ S10.4 Translate all admin-facing strings
