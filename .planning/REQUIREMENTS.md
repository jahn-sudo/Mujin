# Requirements: Mujin 2.0

**Defined:** 2026-03-16
**Core Value:** Students who demonstrate trustworthiness through behavior — not financial history — get introduced to banks. The Trust Engine makes that credentialing objective, auditable, and scalable.

## v1 Requirements

### Authentication & RBAC

- [ ] **AUTH-01**: User can register with email and password (org-scoped)
- [ ] **AUTH-02**: User receives email verification after signup
- [ ] **AUTH-03**: User can log in and receive JWT access token (15-min) + HttpOnly refresh token (30-day)
- [ ] **AUTH-04**: User session persists across browser refresh via silent token refresh
- [ ] **AUTH-05**: User can log out from any page (refresh token revoked)
- [ ] **AUTH-06**: User can reset password via email link (one-time token, 24-hr expiry)
- [ ] **AUTH-07**: Role-based route access enforced server-side (STUDENT / MENTOR / STAFF / ORG_ADMIN / SUPER_ADMIN)
- [ ] **AUTH-08**: No user can hold MENTOR + STAFF/ADMIN roles simultaneously
- [ ] **AUTH-09**: Refresh token invalidated immediately on role change
- [ ] **AUTH-10**: APPI/GDPR consent logged at registration (platform data category, ToS version, timestamp)
- [ ] **AUTH-11**: Staff can soft-delete user + anonymize PII on erasure request (ConsentRecord updated)
- [ ] **AUTH-12**: Multi-tenant isolation: all queries scoped to Organization; cross-tenant data leakage is impossible

### Onboarding

- [ ] **ONBO-01**: Staff can create a Cohort (name, org, max 5 students)
- [ ] **ONBO-02**: Staff can invite student by email (invite token, 7-day expiry)
- [ ] **ONBO-03**: Student accepts invite, creates account, and completes onboarding flow
- [ ] **ONBO-04**: Student signs digital Pledge of Honor (checkbox + timestamp logged)
- [ ] **ONBO-05**: Student creates venture profile (name, description, co-founders)
- [ ] **ONBO-06**: Staff assigns student to cohort (max 5 per cohort)
- [ ] **ONBO-07**: Grant disbursement tracked: ¥300K on signing / ¥200K released at Month 3 (company incorporated + no Red score at M2 or M3)

### Attendance Logging

- [ ] **ATTN-01**: Staff creates bi-weekly CheckInSession (date, cohort)
- [ ] **ATTN-02**: Mentor marks present/absent per student in their cohort → AttendanceRecord written
- [ ] **ATTN-03**: Mentor can only see and log attendance for their own cohort
- [ ] **ATTN-04**: Staff creates monthly TownHall event (date, org-wide)
- [ ] **ATTN-05**: Student submits anonymous Town Hall form with attendance report (who was present — majority ≥3/5 rules; non-submission = absent)
- [ ] **ATTN-06**: Staff sees aggregate Town Hall attendance per group (no individual attribution)
- [ ] **ATTN-07**: Mentor cannot access Town Hall individual submissions

### P&L Submission & Review

- [ ] **PNL-01**: System generates monthly PLSubmission record per student on 1st of month
- [ ] **PNL-02**: Student submits P&L form (revenue, expenses, net auto-calculated, notes optional)
- [ ] **PNL-03**: Student uploads receipt(s) if expenses ≥ ¥50,000 (direct to Cloudflare R2 via presigned URL)
- [ ] **PNL-04**: System auto-scores completeness on submission (Layer B: revenue filled +25, expenses filled +25, notes provided +25, receipts uploaded if required +25 = 0–100)
- [ ] **PNL-05**: Layer A: binary submission check — no submission before deadline = score penalized immediately
- [ ] **PNL-06**: Staff can review submitted P&Ls (approve / flag for audit / request more info)
- [ ] **PNL-07**: Staff can override completeness score with written reason (Layer C; audit trail required)
- [ ] **PNL-08**: Staff can add internal annotation to P&L (not visible to student)
- [ ] **PNL-09**: 10–20% of submissions automatically flagged for random spot audit
- [ ] **PNL-10**: APPI consent logged at first P&L submission (financial data category)

### Reflection

- [ ] **REFL-01**: Student submits anonymous monthly reflection after Town Hall (same anonymous form as ATTN-05)
- [ ] **REFL-02**: AI assesses reflection for meaningfulness (≥50 words, coherent, topically relevant) → MEANINGFUL | NOT_MEANINGFUL
- [ ] **REFL-03**: Reflection text is NOT stored in any staff-queryable column; only assessment result stored
- [ ] **REFL-04**: If reflection flagged NOT_MEANINGFUL: student has 48-hour resubmission window (once per quarter)
- [ ] **REFL-05**: Second flag in same quarter = score 0 for that quarter, no resubmission window
- [ ] **REFL-06**: Students informed upfront that AI (not staff) assesses reflection meaningfulness

### Scoring Engine

- [ ] **SCOR-01**: `calculateTrustScore(studentId, month)` runs server-side on every trigger event
- [ ] **SCOR-02**: Score written as immutable record to TrustScore table (never computed live on read)
- [ ] **SCOR-03**: Scoring formula: Responsiveness 25% (check-ins attended / check-ins held, rolling 3mo) + Transparency 25% (final P&L completeness score) + Mutualism 25% (town halls attended / held, rolling 3mo) + Reflection 25% (MEANINGFUL = 1, NOT_MEANINGFUL = 0)
- [ ] **SCOR-04**: Traffic light assigned: 🟢 75–100 / 🟡 50–74 / 🔴 0–49
- [ ] **SCOR-05**: Score triggers: attendance marked, P&L finalized, reflection assessed, override applied
- [ ] **SCOR-06**: Staff can override Trust Score with written reason → TrustScoreOverride record (audit trail)
- [ ] **SCOR-07**: 6-consecutive-month Green streak tracked per student (graduation input)
- [ ] **SCOR-08**: Every score write creates an AuditLog entry

### Student Dashboard

- [ ] **SDSH-01**: Student views own Trust Score (traffic light + number)
- [ ] **SDSH-02**: Student views score breakdown (Responsiveness / Transparency / Mutualism / Reflection bars)
- [ ] **SDSH-03**: Student views graduation progress checklist (company incorporated, 3mo cash flow, 6mo Green streak, exit interview)
- [ ] **SDSH-04**: Student views upcoming events (P&L due date, next Town Hall, next check-in)
- [ ] **SDSH-05**: Student views cohort group members' scores (first names/initials + traffic light, within cohort only — no org-wide view)

### Mentor Dashboard

- [ ] **MDSH-01**: Mentor views their own group's 5 students with Trust Score traffic lights
- [ ] **MDSH-02**: Mentor sees flags: upcoming check-in session, students at risk (Red score)
- [ ] **MDSH-03**: Mentor opens bi-weekly check-in session and marks present/absent per student
- [ ] **MDSH-04**: Mentor cannot access P&L data, override scores, or view other groups

### Admin Dashboard

- [ ] **ADSH-01**: Admin views "Needs Attention" panel (Red students sorted by score ascending, across all groups)
- [ ] **ADSH-02**: Admin views all students grouped by cohort with traffic light per student
- [ ] **ADSH-03**: Admin views "Actions Due" panel (P&L reviews pending, next check-in date)
- [ ] **ADSH-04**: Admin views per-student detail (score history, P&L history, attendance record, staff notes)
- [ ] **ADSH-05**: Auto-generated exit interview package: Trust Score history (6-month chart), P&L summary (last 6 months), revenue trend, cash flow streak, attendance record, aggregated staff notes

### Graduation Tracking

- [ ] **GRAD-01**: System detects when all 3 hard criteria met → graduation_status = ELIGIBLE (company incorporated + product live, 3mo non-negative cash flow, 6mo Green streak)
- [ ] **GRAD-02**: System auto-notifies staff when ELIGIBLE criteria met
- [ ] **GRAD-03**: Staff schedules exit interview (date logged, status → INTERVIEW_SCHEDULED)
- [ ] **GRAD-04**: Staff marks interview pass or fail (fail resets Green streak; status → INTERVIEW_FAILED)
- [ ] **GRAD-05**: Staff triggers bank introduction after interview passed (status → GRADUATED, bank_intro_date written)
- [ ] **GRAD-06**: All graduation state transitions go through a single validated function with GraduationStatusLog audit trail
- [ ] **GRAD-07**: APPI consent logged at bank introduction trigger (third-party disclosure, APPI Article 23)

### Notifications

- [ ] **NOTF-01**: Student receives P&L submission reminder email 7 days before month end
- [ ] **NOTF-02**: Student receives P&L overdue alert email day after deadline missed
- [ ] **NOTF-03**: Staff receives graduation eligible alert when all 3 criteria met
- [ ] **NOTF-04**: Staff receives Red score alert when student drops to Red
- [ ] **NOTF-05**: Staff receives check-in session reminder 24hrs before scheduled session

### Internationalisation

- [ ] **I18N-01**: EN/JP language toggle in navigation (persists via cookie across sessions)
- [ ] **I18N-02**: All student-facing strings translated to English and Japanese
- [ ] **I18N-03**: All admin/mentor-facing strings translated to English and Japanese
- [ ] **I18N-04**: Email notification links locale-aware (open in recipient's current language)

## v2 Requirements

### Multi-Tenant SaaS Expansion

- **SAAS-01**: Self-serve organization onboarding (second non-profit can create own account)
- **SAAS-02**: Per-org configurable data retention policy (default: archive 3 years post-graduation)
- **SAAS-03**: Org-level branding (logo, accent color)

### Analytics & Reporting

- **ANLT-01**: Score breakdown trend charts per student (6-month history visualization)
- **ANLT-02**: Cohort comparison view (admin — aggregate stats, no individual attribution)
- **ANLT-03**: Program-level success metric: Business Manager Visa obtainment tracking (org-wide lagging indicator)

### Bank Integration

- **BANK-01**: Bank introduction package export (PDF/structured data for bank partner) — post-MOU only
- **BANK-02**: Bank API integration for introduction status tracking — post-MOU only

### Reflection Resubmission Management

- **REFL-07**: Per-quarter resubmission window management with expiry notifications

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real-time chat | High complexity; not core to Trust Engine; adds scope without improving graduation outcomes |
| Staff access to reflection text | Product-destroying anti-feature — psychological safety promise is the product |
| Hard revenue floor for graduation | Revenue trend = soft signal in exit interview only; hard floor creates perverse incentives |
| Public trust score leaderboard | Undermines the mutualism signal; competitive dynamic is antithetical to the model |
| Native mobile app | Desktop-first; mobile-responsive web sufficient for pilot and near-term |
| OAuth login (v1) | Email/password sufficient; OAuth adds complexity without pilot value |
| Automated appeals system | Needs human judgment at pilot scale; adds complexity disproportionate to 50 students |
| Video reflection submissions | Storage/bandwidth cost; text sufficient for AI meaningfulness assessment |
| Bank API integration (v1) | Bank MOU not until Q1 2027; premature to build the integration |
| Asylum seekers in pilot cohort | Visa status too precarious for 12-month program; revisit post-pilot |
| Automated fraud detection | Out of scope for pilot; social collateral model is the fraud prevention layer |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| AUTH-05 | Phase 1 | Pending |
| AUTH-06 | Phase 1 | Pending |
| AUTH-07 | Phase 1 | Pending |
| AUTH-08 | Phase 1 | Pending |
| AUTH-09 | Phase 1 | Pending |
| AUTH-10 | Phase 1 | Pending |
| AUTH-11 | Phase 1 | Pending |
| AUTH-12 | Phase 1 | Pending |
| ONBO-01 | Phase 2 | Pending |
| ONBO-02 | Phase 2 | Pending |
| ONBO-03 | Phase 2 | Pending |
| ONBO-04 | Phase 2 | Pending |
| ONBO-05 | Phase 2 | Pending |
| ONBO-06 | Phase 2 | Pending |
| ONBO-07 | Phase 2 | Pending |
| ATTN-01 | Phase 3 | Pending |
| ATTN-02 | Phase 3 | Pending |
| ATTN-03 | Phase 3 | Pending |
| ATTN-04 | Phase 3 | Pending |
| ATTN-05 | Phase 3 | Pending |
| ATTN-06 | Phase 3 | Pending |
| ATTN-07 | Phase 3 | Pending |
| PNL-01 | Phase 4 | Pending |
| PNL-02 | Phase 4 | Pending |
| PNL-03 | Phase 4 | Pending |
| PNL-04 | Phase 4 | Pending |
| PNL-05 | Phase 4 | Pending |
| PNL-06 | Phase 4 | Pending |
| PNL-07 | Phase 4 | Pending |
| PNL-08 | Phase 4 | Pending |
| PNL-09 | Phase 4 | Pending |
| PNL-10 | Phase 4 | Pending |
| REFL-01 | Phase 5 | Pending |
| REFL-02 | Phase 5 | Pending |
| REFL-03 | Phase 5 | Pending |
| REFL-04 | Phase 5 | Pending |
| REFL-05 | Phase 5 | Pending |
| REFL-06 | Phase 5 | Pending |
| SCOR-01 | Phase 6 | Pending |
| SCOR-02 | Phase 6 | Pending |
| SCOR-03 | Phase 6 | Pending |
| SCOR-04 | Phase 6 | Pending |
| SCOR-05 | Phase 6 | Pending |
| SCOR-06 | Phase 6 | Pending |
| SCOR-07 | Phase 6 | Pending |
| SCOR-08 | Phase 6 | Pending |
| SDSH-01 | Phase 7 | Pending |
| SDSH-02 | Phase 7 | Pending |
| SDSH-03 | Phase 7 | Pending |
| SDSH-04 | Phase 7 | Pending |
| SDSH-05 | Phase 7 | Pending |
| MDSH-01 | Phase 7 | Pending |
| MDSH-02 | Phase 7 | Pending |
| MDSH-03 | Phase 7 | Pending |
| MDSH-04 | Phase 7 | Pending |
| ADSH-01 | Phase 7 | Pending |
| ADSH-02 | Phase 7 | Pending |
| ADSH-03 | Phase 7 | Pending |
| ADSH-04 | Phase 7 | Pending |
| ADSH-05 | Phase 7 | Pending |
| GRAD-01 | Phase 8 | Pending |
| GRAD-02 | Phase 8 | Pending |
| GRAD-03 | Phase 8 | Pending |
| GRAD-04 | Phase 8 | Pending |
| GRAD-05 | Phase 8 | Pending |
| GRAD-06 | Phase 8 | Pending |
| GRAD-07 | Phase 8 | Pending |
| NOTF-01 | Phase 9 | Pending |
| NOTF-02 | Phase 9 | Pending |
| NOTF-03 | Phase 9 | Pending |
| NOTF-04 | Phase 9 | Pending |
| NOTF-05 | Phase 9 | Pending |
| I18N-01 | Phase 9 | Pending |
| I18N-02 | Phase 9 | Pending |
| I18N-03 | Phase 9 | Pending |
| I18N-04 | Phase 9 | Pending |

**Coverage:**
- v1 requirements: 78 total
- Mapped to phases: 78
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-16*
*Last updated: 2026-03-16 — traceability updated after roadmap creation (REFL-01–06 corrected from Phase 4 to Phase 5)*
