# Pitfalls Research

**Domain:** Multi-tenant Next.js SaaS — JWT Auth, RBAC, Behavioral Scoring, APPI/GDPR Compliance
**Researched:** 2026-03-16
**Confidence:** HIGH (all pitfalls are Mujin-specific, not generic advice)

## Critical Pitfalls

### Pitfall 1: JWT Role Not Re-Validated Against DB on Mutations

**Warning signs:** Role embedded in JWT; no DB check on Server Actions that mutate scores or graduation state.

**Why it matters for Mujin:** A demoted STAFF user retains their old role in the cookie for up to 7 days (refresh token lifetime). They can continue to override Trust Scores and trigger graduation state transitions during that window.

**Prevention:**
- Two-tier auth: cookie JWT for UI routing (proxy.ts), DB role lookup for every mutation in DAL
- On role change: invalidate all refresh tokens immediately (`WHERE userId = ? AND revokedAt IS NULL`)
- Phase: **Phase 1 (Foundation & Auth)**

**Recovery if ignored:** Data integrity violation in audit trail; potential legal exposure (score manipulated post-demotion).

---

### Pitfall 2: Multi-Tenant Prisma Query Leakage

**Warning signs:** Queries using `prisma.student.findMany()` without explicit `organizationId` filter.

**Why it matters for Mujin:** A single missing `WHERE organizationId = ?` silently returns all tenants' data. When you add Org 2 (second non-profit), their student data becomes visible to Org 1 admin.

**Prevention:**
- Prisma `$extends` client that injects `organizationId` on every model query automatically
- PostgreSQL Row-Level Security as defense-in-depth
- Code review checklist: any raw `prisma.*` call outside `lib/dal.ts` is a red flag
- Phase: **Phase 1 (Foundation & Auth)**

**Recovery if ignored:** Catastrophic data breach; loss of all future SaaS customers.

---

### Pitfall 3: Trust Score Computed Live, Not Stored

**Warning signs:** `/api/trust-score` endpoint that calculates score on read; no `TrustScore` table.

**Why it matters for Mujin:** Banks reviewing exit interview packages need a stable, point-in-time historical record. If a P&L is corrected retroactively, live computation rewrites the score history, destroying the audit trail. The exit interview package becomes unreliable.

**Prevention:**
- Insert-only `TrustScore` records: one row per student per month, written on triggers
- Never compute at read time
- Corrections create a new override record, not a mutation of the original
- Phase: **Phase 5 (Scoring Engine)**

**Recovery if ignored:** Cannot produce credible exit interview package; bank introduction credibility destroyed.

---

### Pitfall 4: Refresh Token in localStorage or Response Body

**Warning signs:** `localStorage.setItem('refresh_token', ...)` or `return { refreshToken }` in login response.

**Why it matters for Mujin:** Any XSS vulnerability (including third-party script injection) exfiltrates long-lived tokens. With a 30-day refresh token, an attacker has a month of access to student financial data and score override capabilities.

**Prevention:**
- Refresh token: HttpOnly, Secure, SameSite=Strict cookie only — never response body
- Access token: short-lived (15 min), can be in memory or HttpOnly cookie
- Never access either token from JavaScript
- Phase: **Phase 1 (Foundation & Auth)**

---

### Pitfall 5: APPI Consent Not Captured at Collection Time

**Warning signs:** No `ConsentLog` table; consent is a checkbox with no audit record; bank introduction has no separate consent.

**Why it matters for Mujin:** APPI right-to-erasure requests become impossible to fulfill without knowing what data was collected and when. Japan-specific: sharing personal data with a bank (the graduation event) is a third-party disclosure under APPI Article 23, requiring separate, specific consent.

**Prevention:**
- `ConsentRecord` table: `userId`, `dataCategory`, `purpose`, `version`, `consentedAt`, `ipAddress`
- Capture at: registration (platform data), P&L submission (financial data), bank introduction trigger (bank disclosure)
- Right to erasure: soft-delete + PII anonymization (keep anonymized audit trail)
- Phase: **Phase 1 (Foundation & Auth)**

---

### Pitfall 6: R2 Path Traversal / Tenant Isolation Failure

**Warning signs:** R2 keys contain user-supplied filenames (e.g., `uploads/${filename}`).

**Why it matters for Mujin:** A filename like `../../org2/student1/q1.pdf` can overwrite another tenant's receipts. Even without malicious intent, filename collisions corrupt the audit trail.

**Prevention:**
- Server-generated keys only: `${orgId}/${userId}/${submissionId}/${uuid}.${ext}`
- Validate file extension server-side before generating presigned URL
- R2 bucket: private, no public access, presigned URLs only
- Phase: **Phase 4 (P&L Submission)**

---

### Pitfall 7: i18n Middleware Breaking Auth Redirects

**Warning signs:** Separate i18n and auth middleware; auth redirects to `/login` without locale prefix; email links don't match current locale.

**Why it matters for Mujin:** With `next-intl` cookie-based locale, auth redirects that go to `/login` instead of the current locale's equivalent cause redirect loops or drop users into the wrong language. Email links generated without locale context always land in the default language.

**Prevention:**
- Single `proxy.ts`: locale detection first, then auth check; all redirects include locale
- Email templates: generate links with current user's preferred locale from DB
- Phase: **Phase 9 (Internationalisation)**

---

### Pitfall 8: Mentor IDOR on Cohort Data

**Warning signs:** Cohort ID passed as URL parameter without server-side ownership check; `GET /mentor/cohort?id=2` returns data for any cohort.

**Why it matters for Mujin:** Mentors must only see their own cohort's students. An IDOR vulnerability means Mentor A can view Mentor B's students' Trust Scores — violating the role isolation guarantee that prevents bias.

**Prevention:**
- DAL enforces: `cohort.mentorId === session.userId` atomically with the cohort query
- Never trust URL parameters for ownership — always verify in DAL
- Phase: **Phase 3 (Attendance Logging) when mentor scope is first introduced**

---

### Pitfall 9: Graduation State Machine Bypassed by Direct DB Update

**Warning signs:** `prisma.graduationRecord.update({ status: 'GRADUATED' })` called directly; no state transition log.

**Why it matters for Mujin:** The graduation state machine (INELIGIBLE → ELIGIBLE → INTERVIEW_SCHEDULED → GRADUATED) has business logic at each transition (e.g., fail resets Green streak). Direct DB updates bypass this logic and leave no audit trail — critical if a bank ever requests the graduation history.

**Prevention:**
- Single `transitionGraduationStatus(studentId, to, reason)` function
- Validates legal transitions, writes `GraduationStatusLog` entry
- All transitions inside `prisma.$transaction`
- No direct `graduationRecord.update` outside this function
- Phase: **Phase 7 (Graduation Tracking)**

---

## Technical Debt Traps

| Trap | When It Bites | Prevention |
|------|--------------|------------|
| No connection pooling | When Railway Postgres hits connection limit under load | Add PgBouncer / Prisma Accelerate before launch |
| Vercel Cron timeout for 50+ students | Monthly scoring batch times out at > ~10s | Queue-based scoring (Inngest/Trigger.dev) before pilot launch |
| Hard-coded ¥ amounts (¥50k receipt threshold, ¥300K/¥200K tranches) | When amounts change for second cohort | Config table or environment variable from day one |
| Missing index on `TrustScore(studentId, month)` | Dashboard queries slow at 500+ score records | Add index in initial migration |

## "Looks Done But Isn't" Checklist

Before calling any phase complete, verify:

- [ ] All DB queries go through tenant-scoped DAL (no raw `prisma.*` outside `lib/dal.ts`)
- [ ] Refresh tokens are HttpOnly cookies only (check Network tab — no token in response body)
- [ ] Every score mutation writes an AuditLog entry (check DB after test mutation)
- [ ] Reflection text is NOT stored in a staff-queryable column
- [ ] R2 keys are server-generated UUIDs (no user input in key path)
- [ ] Graduation transitions go through `transitionGraduationStatus()` (grep for direct `update({ status:`)
- [ ] APPI consent captured at: registration, bank introduction trigger

## Phase → Pitfall Mapping

| Phase | Pitfalls to Address |
|-------|-------------------|
| Phase 1: Foundation & Auth | #1 (JWT role), #2 (multi-tenant Prisma), #4 (refresh token), #5 (APPI consent) |
| Phase 3: Attendance | #8 (mentor IDOR) |
| Phase 4: P&L | #6 (R2 path traversal) |
| Phase 5: Scoring Engine | #3 (live computation) |
| Phase 7: Graduation | #9 (state machine bypass) |
| Phase 9: i18n | #7 (redirect loops) |

---
*Pitfalls research for: Multi-tenant Next.js Trust Engine SaaS — Mujin 2.0*
*Researched: 2026-03-16*
