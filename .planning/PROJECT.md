# Mujin 2.0

## What This Is

A "Redemptive Fintech" platform that modernizes Japan's historical mutual aid (mujin) systems. Mujin 2.0 provides international students and credit-invisible individuals in Japan with a ¥500,000 Recyclable Grant, co-working space access via church partnerships, and a Trust Engine that scores behavior over time — ultimately introducing graduates to regional banks for traditional capital access.

The core digital product is the **Trust Engine**: a scoring dashboard used by students, mentors, and staff to track trustworthiness signals (attendance, P&L transparency, peer participation, reflection) and surface graduation readiness.

## Core Value

Students who demonstrate trustworthiness through behavior — not financial history — get introduced to banks. The Trust Engine makes that credentialing objective, auditable, and scalable.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Multi-tenant auth system (STUDENT / MENTOR / STAFF / ORG_ADMIN / SUPER_ADMIN roles)
- [ ] Student onboarding: accept grant, sign Pledge of Honor, create venture profile, join cohort
- [ ] Bi-weekly check-in attendance logging (mentor-led, per cohort of 5)
- [ ] Monthly Town Hall attendance via anonymous form (majority ≥3/5 rules)
- [ ] Monthly P&L submission (structured form + receipts ≥¥50k + 3-layer completeness scoring)
- [ ] Monthly anonymous reflection (AI-assessed: 50+ words, coherent, topically relevant)
- [ ] Trust Score engine: 4 signals × 25% each (Responsiveness, Transparency, Mutualism, Reflection)
- [ ] Trust Score stored per student per month (never computed live — full audit trail)
- [ ] Traffic light display: 🟢 75–100 / 🟡 50–74 / 🔴 0–49
- [ ] Student dashboard: score, breakdown bars, graduation checklist, upcoming events, cohort view
- [ ] Mentor dashboard: own group's scores + flags (no P&L access, no cross-group access)
- [ ] Admin dashboard: all students sorted by risk, P&L review, score override (with reason)
- [ ] Graduation state machine: INELIGIBLE → ELIGIBLE → INTERVIEW_SCHEDULED → GRADUATED
- [ ] Auto-generated exit interview package (score history, P&L summary, attendance, staff notes)
- [ ] Email notifications: P&L reminders, overdue alerts, graduation triggers, Red score alerts
- [ ] EN/JP language toggle (persists to localStorage)
- [ ] APPI/GDPR compliance: consent logging, right to erasure, configurable retention

### Out of Scope

- Real-time chat — high complexity, not core to Trust Engine value
- Video posts — storage/bandwidth cost, defer post-pilot
- OAuth login — email/password sufficient for MVP
- Mobile native app — desktop-first, mobile-responsive web only
- Asylum seekers in pilot cohort — visa status too precarious for 12-month program
- Hard revenue floor for graduation — revenue trend is a soft signal (exit interview layer)

## Context

- **Org structure:** Religious Corporation (Shukyo Hojin) as legal entity. Grants are structured as "Venture Scholarships" with non-binding Pledge of Honor — explicitly not loans, avoids Money Lending Business Act.
- **Distribution channel:** Christian student ministry and church networks are the trust pipeline and recruitment channel.
- **Physical layer:** Church assets near universities serve as "Mujin Commons" co-working (Mon–Fri) + church (Sat–Sun). ¥10,000/mo usage agreement satisfies Immigration Bureau physical office requirement for Business Manager Visa.
- **Grant model:** ¥500K per student, 2-tranche: ¥300K on signing / ¥200K at Month 3 (company incorporated + no Red score at M2 or M3). Allowable use: venture operations only (no personal living expenses).
- **Pilot:** 50 students (10 cohorts × 5), target launch Q2 2027. $1M USD funding target.
- **Bank relationship:** No warm lead yet. Bank MOU by Q1 2027 is a foundational risk — need a bank expressing interest before we build.
- **Multi-tenant from day one:** Future SaaS for other non-profits. `Organization` is the tenancy root.

## Constraints

- **Tech Stack:** Next.js 14+ (App Router, TypeScript), PostgreSQL, Prisma, Cloudflare R2, Resend, Vercel + Railway — decided and locked
- **Auth:** Custom JWT (not NextAuth) — required for future white-label SaaS control
- **Legal:** DRAFT, pending legal review. FSA classification risk if grant is treated as a de facto loan.
- **Timeline:** Build Q1 2027, launch pilot Q2 2027. Legal/ops Q2 2026, fundraising Q3 2026.
- **Compliance:** APPI (Japan) + GDPR-aligned. Consent logging, right to erasure, data minimization mandatory.
- **Roles:** Hard rule — no user can hold MENTOR + STAFF/ADMIN roles simultaneously (bias prevention).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Recyclable Grant (not loan) | Bypasses Money Lending Business Act; non-binding pledge maintains FSA separation | — Pending legal opinion |
| Custom JWT auth | Full control for future white-label SaaS; avoids vendor dependency | — Pending |
| Multi-tenant from day one | Future non-profit SaaS expansion; Organization as tenancy root | — Pending |
| Trust Score = 4 signals × 25% | Responsiveness + Transparency + Mutualism + Reflection; equal weights; stored not computed live | — Pending |
| 3-layer P&L scoring | Layer A (binary) + Layer B (auto) + Layer C (staff override with reason) — auditable | — Pending |
| Reflection text hidden from staff | AI assesses meaningfulness only; preserves student psychological safety | — Pending |
| Mentor role isolated | Group-scoped, no P&L access, cannot hold STAFF role — bias prevention | — Pending |
| No hard revenue floor | Revenue trend = soft signal in exit interview package, not graduation gate | — Pending |
| Desktop-first, EN/JP toggle | Target users are Japan-based; EN primary, JP secondary for international + local students | — Pending |

---
*Last updated: 2026-03-16 after initialization*
