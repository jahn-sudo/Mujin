# Roadmap: Mujin 2.0

## Overview

Mujin 2.0 is built in nine phases ordered strictly by feature dependency and pitfall prevention. The foundation (auth + multi-tenancy) must be airtight before any data is collected. Data collection phases (attendance, P&L, reflection) must exist before the scoring engine can be built. Dashboards read scored data, graduation reads dashboard state, and notifications + i18n wrap the complete system. Compressing this chain introduces the critical pitfalls identified in research — multi-tenant data leakage, live score computation, and graduation state bypass are all trust-destroying failures that cannot be patched after the fact.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation and Auth** - Multi-tenant architecture, custom JWT auth, 5-role RBAC, APPI consent foundation
- [ ] **Phase 2: Student Onboarding** - Invite flow, registration, pledge, venture profile, cohort assignment, grant disbursement tracking
- [ ] **Phase 3: Attendance Logging** - Bi-weekly check-in logging (mentor-marked), Town Hall anonymous attendance, mentor group scope isolation
- [ ] **Phase 4: P&L Submission and Review** - Monthly P&L form, receipt upload to R2, 3-layer completeness scoring, staff review workflow
- [ ] **Phase 5: Reflection** - Anonymous monthly reflection submission, AI meaningfulness assessment, privacy enforcement
- [ ] **Phase 6: Scoring Engine** - Trust Score calculation (4 signals x 25%), immutable triggered writes, audit trail
- [ ] **Phase 7: Dashboards** - Student, mentor, and admin role-specific dashboards with traffic light display
- [ ] **Phase 8: Graduation Tracking** - Graduation state machine, exit interview package generation, bank introduction trigger
- [ ] **Phase 9: Notifications and i18n** - Email notifications (reminders, alerts, triggers), EN/JP language toggle

## Phase Details

### Phase 1: Foundation and Auth
**Goal**: Users can securely authenticate and the system enforces multi-tenant isolation from the first query
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06, AUTH-07, AUTH-08, AUTH-09, AUTH-10, AUTH-11, AUTH-12
**Success Criteria** (what must be TRUE):
  1. User can register with email/password, receive verification email, log in, and receive an HttpOnly JWT cookie (no token ever visible in response body or localStorage)
  2. User can stay logged in across browser refresh via silent token refresh; token is revoked immediately on logout from any page
  3. User can reset a forgotten password via a one-time email link that expires in 24 hours
  4. Role-based route access is enforced server-side — a STUDENT cannot access mentor or admin routes even with a valid token
  5. All queries are scoped to `organizationId`; a cross-tenant data read is structurally impossible via the Prisma `$extends` client
**Plans**: TBD

### Phase 2: Student Onboarding
**Goal**: A student can be invited, registered, and placed into a cohort with their venture documented and grant disbursement tracked
**Depends on**: Phase 1
**Requirements**: ONBO-01, ONBO-02, ONBO-03, ONBO-04, ONBO-05, ONBO-06, ONBO-07
**Success Criteria** (what must be TRUE):
  1. Staff can create a cohort (max 5 students) and invite a student by email; invite link expires after 7 days
  2. Student accepts invite, completes multi-step onboarding (register → sign Pledge of Honor → create venture profile → join cohort) in one flow
  3. Student's Pledge of Honor signature is logged with a timestamp and the student cannot skip it
  4. Staff can view grant disbursement status per student: ¥300K on signing, ¥200K conditional release tracked at Month 3
**Plans**: TBD

### Phase 3: Attendance Logging
**Goal**: Mentors can log bi-weekly check-ins for their own cohort and students can anonymously report Town Hall attendance
**Depends on**: Phase 2
**Requirements**: ATTN-01, ATTN-02, ATTN-03, ATTN-04, ATTN-05, ATTN-06, ATTN-07
**Success Criteria** (what must be TRUE):
  1. Mentor can open a check-in session and mark each of their 5 students present or absent; mentor cannot see or modify attendance for any other cohort
  2. Staff creates a Town Hall event and students submit anonymous attendance forms; majority rule (≥3/5) determines attendance credit
  3. Staff sees aggregate Town Hall attendance per group with no individual attribution; mentor has no access to individual Town Hall submissions
**Plans**: TBD

### Phase 4: P&L Submission and Review
**Goal**: Students can submit monthly P&L reports with receipts and staff can review, score, and annotate them with a full audit trail
**Depends on**: Phase 3
**Requirements**: PNL-01, PNL-02, PNL-03, PNL-04, PNL-05, PNL-06, PNL-07, PNL-08, PNL-09, PNL-10
**Success Criteria** (what must be TRUE):
  1. A `PLSubmission` record is auto-generated for every student on the 1st of the month; non-submission by deadline is penalized immediately (Layer A)
  2. Student can submit revenue, expenses, and upload receipts directly to R2 via presigned URL when expenses exceed ¥50,000; net is auto-calculated
  3. System auto-scores completeness 0–100 on submission (Layer B) with transparent breakdown
  4. Staff can approve, flag, or request revision on P&Ls; can override completeness score with written reason logged as Layer C audit entry
  5. Staff can add internal annotations not visible to students; 10–20% of submissions are randomly flagged for spot audit
**Plans**: TBD

### Phase 5: Reflection
**Goal**: Students can submit anonymous monthly reflections that are AI-assessed for meaningfulness without the text ever being accessible to staff
**Depends on**: Phase 3
**Requirements**: REFL-01, REFL-02, REFL-03, REFL-04, REFL-05, REFL-06
**Success Criteria** (what must be TRUE):
  1. Student submits anonymous monthly reflection via the same form as Town Hall attendance; reflection text is never stored in any staff-queryable column
  2. AI assesses reflection as MEANINGFUL or NOT_MEANINGFUL; only the assessment result is stored, not the text
  3. If flagged NOT_MEANINGFUL, student has a 48-hour resubmission window (once per quarter); second flag in same quarter scores 0 with no window
  4. Students are informed upfront that AI (not staff) assesses the reflection
**Plans**: TBD

### Phase 6: Scoring Engine
**Goal**: Trust Scores are computed from all four signals and written as immutable records that form a bank-credible audit trail
**Depends on**: Phase 4, Phase 5
**Requirements**: SCOR-01, SCOR-02, SCOR-03, SCOR-04, SCOR-05, SCOR-06, SCOR-07, SCOR-08
**Success Criteria** (what must be TRUE):
  1. A Trust Score is written to the `TrustScore` table whenever attendance is marked, a P&L is finalized, a reflection is assessed, or an override is applied — never computed at read time
  2. Each score record is immutable; corrections create new override records with written reason, never mutations of existing records
  3. Traffic light (Green/Yellow/Red) is assigned correctly: 75–100 Green, 50–74 Yellow, 0–49 Red
  4. Every score write produces an `AuditLog` entry; a 6-consecutive-month Green streak is tracked per student
**Plans**: TBD

### Phase 7: Dashboards
**Goal**: Students, mentors, and admins each see role-appropriate views of Trust Score data with correct access boundaries enforced
**Depends on**: Phase 6
**Requirements**: SDSH-01, SDSH-02, SDSH-03, SDSH-04, SDSH-05, MDSH-01, MDSH-02, MDSH-03, MDSH-04, ADSH-01, ADSH-02, ADSH-03, ADSH-04, ADSH-05
**Success Criteria** (what must be TRUE):
  1. Student sees their own Trust Score (traffic light + number), signal breakdown bars, graduation progress checklist, and upcoming events
  2. Student sees cohort members' first names/initials and traffic lights within their cohort only; no org-wide score view
  3. Mentor sees their group's 5 students with traffic lights and risk flags; can open and log a check-in session; cannot access P&L data or other groups
  4. Admin sees all students sorted by risk (Red first), all P&L reviews pending, per-student detail (score history, P&L history, attendance, notes), and can override scores with written reason
**Plans**: TBD

### Phase 8: Graduation Tracking
**Goal**: The graduation state machine transitions students from eligible to introduced with a bank-ready exit interview package and a complete audit trail
**Depends on**: Phase 7
**Requirements**: GRAD-01, GRAD-02, GRAD-03, GRAD-04, GRAD-05, GRAD-06, GRAD-07
**Success Criteria** (what must be TRUE):
  1. System auto-detects when all 3 hard criteria are met (company incorporated, 3-month non-negative cash flow, 6-month Green streak) and sets status to ELIGIBLE; staff is notified automatically
  2. All graduation state transitions (INELIGIBLE → ELIGIBLE → INTERVIEW_SCHEDULED → GRADUATED) go through a single validated function that writes a `GraduationStatusLog` entry; no direct DB state change is possible
  3. Auto-generated exit interview package is available for staff before the interview: 6-month score chart, P&L summary, revenue trend, attendance record, aggregated staff notes
  4. APPI Article 23 consent is logged at the bank introduction trigger (third-party disclosure)
**Plans**: TBD

### Phase 9: Notifications and i18n
**Goal**: Email notifications keep students and staff informed on deadlines and triggers; EN/JP language toggle is available across all views
**Depends on**: Phase 8
**Requirements**: NOTF-01, NOTF-02, NOTF-03, NOTF-04, NOTF-05, I18N-01, I18N-02, I18N-03, I18N-04
**Success Criteria** (what must be TRUE):
  1. Student receives a P&L reminder 7 days before month end and an overdue alert the day after a missed deadline
  2. Staff receives a Red score alert when a student drops to Red and a check-in reminder 24 hours before a scheduled session; staff receives graduation eligible alert when all criteria are met
  3. User can toggle between English and Japanese in the navigation; selection persists via cookie across sessions
  4. All student-facing and admin/mentor-facing strings are available in both EN and JP; email notification links open in the recipient's current language
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation and Auth | 0/TBD | Not started | - |
| 2. Student Onboarding | 0/TBD | Not started | - |
| 3. Attendance Logging | 0/TBD | Not started | - |
| 4. P&L Submission and Review | 0/TBD | Not started | - |
| 5. Reflection | 0/TBD | Not started | - |
| 6. Scoring Engine | 0/TBD | Not started | - |
| 7. Dashboards | 0/TBD | Not started | - |
| 8. Graduation Tracking | 0/TBD | Not started | - |
| 9. Notifications and i18n | 0/TBD | Not started | - |
