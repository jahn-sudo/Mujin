# Project Research Summary

**Project:** Mujin 2.0
**Domain:** Multi-tenant Fintech SaaS — Behavioral Trust Scoring / Redemptive Fintech Platform
**Researched:** 2026-03-16
**Confidence:** HIGH

## Executive Summary

Mujin 2.0 is a multi-tenant SaaS platform that generates auditable, bank-credible Trust Scores for immigrant entrepreneurs through four behavioral signals: responsiveness (bi-weekly check-ins), transparency (monthly P&L with receipts), mutualism (Town Hall attendance), and reflection (AI-assessed anonymous submission). The product occupies a genuine competitive whitespace — no existing platform combines behavioral scoring, structured financial transparency, peer accountability, and a bank introduction pipeline in a single system. The recommended approach is a Next.js 15 App Router monolith deployed on Vercel with PostgreSQL on Railway, custom JWT auth via `jose`, and a tenant-scoped Prisma client that enforces `organizationId` isolation at the ORM layer on every query.

The architecture's most important design decision is that Trust Scores are never computed at read time. Scores are written as immutable records on explicit triggers (P&L approval, attendance logged, reflection assessed, override applied) and stored in a `TrustScore` table. This is non-negotiable for bank credibility: exit interview packages must reference stable, point-in-time historical records that cannot be retroactively rewritten if underlying data is corrected. This decision shapes the entire data model and should be treated as a first-class constraint from Phase 1.

The primary risks cluster in three areas: (1) auth and multi-tenancy correctness in Phase 1 — four of the nine critical pitfalls must be addressed before any other work, (2) APPI compliance for Japan's data privacy law which requires consent capture at three distinct points (registration, P&L collection, bank introduction), and (3) the psychological safety promise around anonymous reflections — reflection text must never be stored in a staff-queryable column. If any of these three fail, they are not recoverable bugs; they are trust-destroying product failures.

## Key Findings

### Recommended Stack

The stack is largely locked by PROJECT.md decisions and is well-suited to the requirements. Next.js 15 with App Router and React 19 is the correct choice — Server Components minimize client bundle weight on the score-heavy dashboards, and `proxy.ts` running in Edge Runtime provides fast JWT-based route guarding before any page renders. The auth layer uses `jose` (not `jsonwebtoken`) because it targets the Web Crypto API and works in Vercel's Edge Runtime; `jsonwebtoken` breaks in middleware. Authentication is custom JWT with HttpOnly cookies — not NextAuth — because the multi-tenant role model (5 roles) and future white-label SaaS requirements conflict with the session schema NextAuth imposes.

For the AI reflection assessment, a direct `openai` SDK call (GPT-4o-mini) from a Server Action is the right choice. The Vercel AI SDK adds abstraction overhead for what is a single deterministic, non-streaming prompt. The `next-intl` library for EN/JP i18n is the correct App Router-native choice over `react-i18next`, which requires client-side hydration for all translations.

**Core technologies:**
- **Next.js 15 + React 19:** Full-stack framework — App Router, Server Components, Server Actions; the production path for complex role-based multi-tenant apps
- **PostgreSQL 16 (Railway) + Prisma 5:** Primary data store with `organizationId` FK partitioning; `$extends` query scoping enforces tenant isolation at the ORM layer
- **`jose` 5.x:** JWT creation and verification in Edge Runtime — use instead of `jsonwebtoken`
- **`bcryptjs`:** Password hashing — pure-JS, no native bindings that break Vercel serverless
- **Cloudflare R2 + AWS SDK v3:** Receipt file storage via presigned PUT URLs (client-direct upload, never proxied through Vercel)
- **Resend + react-email:** Transactional email (reminders, alerts, graduation triggers)
- **`next-intl` 3.x:** Server Components-native EN/JP i18n — avoids client-hydration overhead of `react-i18next`
- **OpenAI GPT-4o-mini:** Reflection meaningfulness assessment — structured JSON output, called from Server Action only
- **Zod + react-hook-form:** Schema validation for all forms and Server Action inputs
- **shadcn/ui + Tailwind CSS 3.x:** Component primitives copied into repo (no runtime dependency); accessible Trust Score progress bars and dialogs

### Expected Features

**Must have (table stakes):**
- RBAC enforced server-side (STUDENT / MENTOR / STAFF / ORG_ADMIN / SUPER_ADMIN)
- Email + password login with password reset (custom JWT, no OAuth in v1)
- Risk-first admin dashboard with traffic light encoding (red students surfaced first)
- Accessibility: color + number + label always together, never color alone
- Guided student onboarding (invite → register → pledge → venture profile → cohort)
- File upload for receipts (required when expenses >= ¥50,000)
- Email deadline reminders and overdue alerts
- Audit trail on all human overrides with written reason required
- APPI/GDPR consent logging and right-to-erasure at three collection points
- EN/JP language toggle persisted via cookie
- Per-student historical record (score history, P&L history, attendance log)

**Should have (differentiators):**
- 4-signal Trust Score (25% each): responsiveness, transparency, mutualism, reflection
- Immutable per-month score storage with append-only audit trail
- AI-assessed anonymous reflection (text never visible to staff)
- Peer-led Town Hall with majority-rule anonymous attendance (non-submission = absent)
- 3-layer P&L completeness scoring (binary + auto-score + staff override with reason)
- Graduation state machine (INELIGIBLE → ELIGIBLE → INTERVIEW_SCHEDULED → GRADUATED)
- Auto-generated exit interview package (score history, P&L summary, attendance, staff notes)
- Mentor role isolation (group-scoped, no P&L access)
- Multi-tenant architecture with `organizationId` as tenancy root
- Recyclable grant 2-tranche disbursement gating (¥300K on signing / ¥200K at Month 3)

**Deliberately NOT building (anti-features):**
- Real-time chat, native mobile app, OAuth login (v1), automated appeals, video reflection
- Staff access to reflection text — this is a product-destroying anti-feature, not a deferral
- Bank API integration — bank MOU not until Q1 2027; premature
- Hard revenue floor for graduation — revenue trend is a soft signal only
- Public leaderboard — undermines the mutualism signal

**Defer to v2+:**
- Multi-org SaaS self-serve onboarding
- Bank API integration (post-MOU)
- Score breakdown trend charts, cohort comparison views
- Configurable retention policy per org

### Architecture Approach

The system follows a Next.js 15 App Router monolith with two distinct auth layers: `proxy.ts` at the Edge for fast JWT decoding and route guarding (no DB calls), and `lib/dal.ts` as a server-side Data Access Layer for per-resource authorization close to the data. All DB queries must flow through the tenant-scoped Prisma client in `lib/dal.ts` — no raw `prisma.*` calls elsewhere. Route groups `(auth)`, `(student)`, `(mentor)`, and `(admin)` provide role-segregated layouts without URL segments. The scoring engine (`lib/scoring/engine.ts`) is a pure function that writes immutable `TrustScore` records on triggers, never at read time.

**Major components:**
1. **`proxy.ts` (Edge Runtime)** — JWT decode, route guard, tenant header injection; no DB access
2. **`lib/dal.ts` (Data Access Layer)** — per-resource authorization, tenant-scoped Prisma `$extends` client; all mutations go here
3. **`lib/scoring/engine.ts`** — pure Trust Score calculation function; triggered on P&L approval, attendance logged, reflection assessed, override applied; writes immutable `TrustScore` records
4. **Server Actions** — form submissions, attendance marking, P&L review; validate session, call DAL
5. **`app/api/upload-url/`** — presigned R2 URL generation (Node.js Route Handler, not Edge)
6. **`app/api/cron/monthly-scores/`** — Vercel Cron for monthly batch score recalculation
7. **`lib/email/`** — Resend dispatch with react-email templates; locale-aware link generation
8. **`AuditLog` table** — append-only event log written by every Server Action on mutation

### Critical Pitfalls

1. **JWT role not re-validated against DB on mutations** — the two-tier auth model (proxy.ts for routing, DAL DB lookup for every mutation) is the fix; also invalidate all refresh tokens immediately on role change. Must address in Phase 1.

2. **Multi-tenant Prisma query leakage** — one missing `WHERE organizationId = ?` silently returns all tenants' data. Fix: Prisma `$extends` tenant-scoped client that auto-injects `organizationId`; code review checklist requiring all queries go through `lib/dal.ts`. Must address in Phase 1.

3. **Trust Score computed live, not stored** — destroys bank credibility for exit interview packages. Fix: insert-only `TrustScore` records written on triggers; corrections create new override records, never mutations. Must address in Phase 5.

4. **Refresh token in localStorage or response body** — XSS exfiltration risk for 30-day tokens. Fix: HttpOnly, Secure, SameSite=Strict cookie only; never in response body or accessible from JavaScript. Must address in Phase 1.

5. **APPI consent not captured at collection time** — `ConsentRecord` table required at registration, P&L submission, and bank introduction trigger; APPI Article 23 requires separate consent for third-party (bank) disclosure. Must address in Phase 1.

6. **Graduation state machine bypassed by direct DB update** — all transitions must go through `transitionGraduationStatus()` which validates legal transitions and writes `GraduationStatusLog`. Must address in Phase 7.

7. **Mentor IDOR on cohort data** — DAL must verify `cohort.mentorId === session.userId` atomically with every cohort query; never trust URL parameters for ownership. Must address when mentor scope is first introduced in Phase 3.

## Implications for Roadmap

Based on combined research, a 9-phase structure is recommended, ordered strictly by feature dependencies and pitfall prevention requirements.

### Phase 1: Foundation and Auth
**Rationale:** Four of nine critical pitfalls (JWT role re-validation, multi-tenant Prisma isolation, refresh token security, APPI consent) must be resolved before any feature work. Multi-tenant architecture, if retrofitted, requires rewriting every query.
**Delivers:** Working auth system (login, password reset, session management), 5-role RBAC, multi-tenant Prisma client with `$extends` scoping, `ConsentRecord` table, `AuditLog` table, HttpOnly cookie JWT pattern, `proxy.ts` Edge guard.
**Addresses:** Auth + RBAC, multi-tenant isolation, APPI consent foundation.
**Avoids:** Pitfalls #1, #2, #4, #5.

### Phase 2: Student Onboarding
**Rationale:** Onboarding is the entry point for all student data and must be built on the auth and multi-tenant foundation from Phase 1. All subsequent data collection (attendance, P&L, reflection) depends on students being onboarded into cohorts.
**Delivers:** Invite flow, registration, pledge, venture profile, cohort assignment.
**Addresses:** Guided student onboarding flow.
**Uses:** Zod + react-hook-form for multi-step form validation; Resend for invite emails.

### Phase 3: Attendance Logging
**Rationale:** Attendance (bi-weekly check-ins + Town Hall) is the first of the four Trust Score signals. Mentor scope is introduced here, requiring mentor IDOR protection. Town Hall anonymous attendance form also establishes the anonymous submission pattern used by reflections.
**Delivers:** Bi-weekly check-in logging (mentor-marked), Town Hall anonymous attendance form (majority-rule), mentor group scope.
**Addresses:** Bi-weekly check-in attendance, Town Hall attendance.
**Avoids:** Pitfall #8 (mentor IDOR).

### Phase 4: P&L Submission and Review
**Rationale:** P&L is the most complex data collection feature (3-layer scoring, file uploads, staff review workflow). R2 presigned upload path must be implemented here; path traversal prevention is critical.
**Delivers:** Monthly P&L form (with receipt upload for expenses >= ¥50K), 3-layer scoring (binary completeness + auto-score + staff override with reason), R2 presigned upload, random spot audit flag.
**Addresses:** P&L submission, 3-layer scoring, file upload, spot audit.
**Avoids:** Pitfall #6 (R2 path traversal).

### Phase 5: Scoring Engine
**Rationale:** The scoring engine can only be built after all four input signals exist (attendance from Phase 3, P&L from Phase 4). Must implement as triggered writes to immutable records — not live computation.
**Delivers:** `calculateTrustScore()` pure function, `TrustScore` table (insert-only), trigger wiring (P&L approval, attendance marked, reflection assessed, override applied), `AuditLog` entries on every score write.
**Addresses:** Trust Score engine (all 4 signals).
**Avoids:** Pitfall #3 (live computation).

### Phase 6: Dashboards
**Rationale:** Dashboards read from the scored data written by Phase 5. All three role views (student, mentor, admin) are built together because they share components (traffic light display, score breakdown) and must be consistent.
**Delivers:** Student dashboard (score + breakdown + graduation checklist + upcoming deadlines), mentor dashboard (group view + flags), admin dashboard (risk-first traffic light view + P&L review queue + override capability), per-student historical record, score history chart (P2).
**Addresses:** Student dashboard, mentor dashboard, admin dashboard, traffic light encoding, score history chart.

### Phase 7: Graduation Tracking
**Rationale:** Graduation state machine depends on a complete scoring history from Phase 5 and the admin dashboard from Phase 6 (staff initiates state transitions from the admin view).
**Delivers:** Graduation state machine (INELIGIBLE → ELIGIBLE → INTERVIEW_SCHEDULED → GRADUATED), `transitionGraduationStatus()` function with `GraduationStatusLog`, auto-generated exit interview package.
**Addresses:** Graduation state machine, exit interview package.
**Avoids:** Pitfall #9 (state machine bypass).

### Phase 8: Notifications
**Rationale:** Email notifications depend on all data models being complete (P&L deadlines need P&L model, graduation triggers need graduation model). Email is infrastructure that wraps existing state rather than creating it.
**Delivers:** P&L deadline reminders, overdue red alerts, graduation trigger emails; react-email templates with locale-aware links.
**Addresses:** Email notifications.
**Uses:** Resend SDK, react-email templates.

### Phase 9: Internationalisation
**Rationale:** i18n is last because retrofitting translations into a complete feature set is easier than maintaining locale files while features are in flux. The pitfall (auth redirects breaking with locale prefix) is isolated to this phase and does not block earlier phases.
**Delivers:** EN/JP language toggle (cookie-persisted), `next-intl` Server Components integration, locale-aware email links, all student-facing and admin strings translated.
**Addresses:** EN/JP localization.
**Avoids:** Pitfall #7 (i18n middleware breaking auth redirects).

### Phase Ordering Rationale

- Phases 1-2 establish the security and data foundation; nothing safe can be built without them
- Phases 3-4 collect the raw inputs for the scoring engine; the engine cannot be built before its inputs exist
- Phase 5 is the core product; dashboards in Phase 6 are meaningless without scored data
- Phase 7 is the graduation outcome layer that depends on complete scoring history
- Phases 8-9 are infrastructure and presentation layers that wrap complete features; deferring them reduces churn

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 5 (Scoring Engine):** The 3-month rolling window calculation, reflection AI prompt design, and override audit logic are complex enough to warrant a focused research pass before implementation
- **Phase 7 (Graduation):** Exit interview package format and what banks actually require are not fully specified; may need stakeholder input before technical planning
- **Phase 8 (Notifications):** Resend deliverability to Japanese email providers (softbank.ne.jp, docomo.ne.jp) is unverified — may need testing in staging

Phases with standard patterns (skip additional research):
- **Phase 1 (Auth):** Custom JWT with `jose` + HttpOnly cookies is thoroughly documented; `proxy.ts` pattern is clear from Next.js 15 docs
- **Phase 4 (P&L / R2 Upload):** Presigned URL pattern is standard; AWS SDK v3 + R2 is well-documented
- **Phase 9 (i18n):** `next-intl` App Router integration is well-documented with clear cookie-based locale pattern

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Core stack locked by PROJECT.md; `jose` Edge compatibility confirmed; Prisma v5 `$extends` pattern documented; version compatibility matrix verified |
| Features | HIGH | Feature set derived from detailed PROJECT.md spec; competitor analysis supports whitespace claim; MVP definition is clear and prioritized |
| Architecture | HIGH | Two-layer auth (proxy + DAL) and triggered-write scoring are well-documented Next.js patterns; component boundaries are clear |
| Pitfalls | HIGH | All 9 pitfalls are Mujin-specific (not generic); multi-tenant leakage and JWT Edge incompatibility are documented failure modes with known fixes |

**Overall confidence:** HIGH

### Gaps to Address

- **Reflection AI prompt design:** The prompt structure for GPT-4o-mini assessment (50+ words, coherent, topically relevant) is sketched but not finalized. Validate with sample student submissions before Phase 5.
- **Resend → Japanese email deliverability:** Deliverability to Japanese carrier email domains (docomo, softbank, au) is unverified. Test in staging before pilot launch.
- **`next-intl` v3 + Next.js 15 compatibility:** Flagged as MEDIUM confidence in STACK.md — verify at install time that version constraints are met.
- **`bcryptjs` serverless regression:** Confirm no regression in Prisma 5 + Vercel deployment environment at Phase 1.
- **Vercel Cron timeout at 50+ students:** Monthly scoring batch may approach Vercel's 10s timeout. Evaluate queue-based scoring (Inngest/Trigger.dev) before pilot launch rather than after.
- **Hard-coded ¥ thresholds:** ¥50K receipt threshold and ¥300K/¥200K grant tranches should be config values from day one, not hardcoded constants.

## Sources

### Primary (HIGH confidence)
- `PROJECT.md` (`.planning/PROJECT.md`) — authoritative stack and product decisions
- Next.js 15 official release blog (https://nextjs.org/blog/next-15) — stable, React 19, async APIs, Node 18.18 minimum
- Next.js v16 proxy.ts migration docs (2026-02-27 release) — proxy.ts replaces middleware.ts
- Prisma v5 migration guide — `$use` deprecated in favor of `$extends`
- Cloudflare R2 documentation — S3 API compatibility, AWS SDK v3 recommended
- Resend SDK docs — `resend` v3 stable; react-email co-design confirmed

### Secondary (MEDIUM confidence)
- `jose` Web Crypto API compatibility in Vercel Edge Middleware — community-confirmed, widely documented
- `bcryptjs` vs native `bcrypt` in serverless — well-documented community pattern; verify no regression in Prisma 5+
- `next-intl` v3 Next.js 15 + React 19 support — verify exact version constraints at install time

### Tertiary (LOW confidence / needs validation)
- Resend deliverability to Japanese carrier email domains — unverified; test in staging before pilot
- Vercel Cron 10s timeout behavior at 50 students — estimate; test in staging

---
*Research completed: 2026-03-16*
*Ready for roadmap: yes*
