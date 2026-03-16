# Features Research

**Domain:** Multi-role SaaS — Behavioral Trust Scoring / Social Impact Fintech
**Researched:** 2026-03-16
**Confidence:** HIGH

## Feature Categories

### Table Stakes (Must Have — Users Leave Without These)

| Feature | Complexity | Notes |
|---------|------------|-------|
| RBAC enforced server-side (5 roles) | Medium | STUDENT / MENTOR / STAFF / ORG_ADMIN / SUPER_ADMIN |
| Email + password login + password reset | Low | Custom JWT; no OAuth v1 |
| Risk-first admin dashboard (traffic lights) | Medium | Red students surfaced first |
| Color + number + label encoding | Low | Never color alone — accessibility requirement |
| Form validation with inline errors | Low | Client + server validation |
| Email deadline reminders | Medium | P&L reminders, overdue alerts |
| Audit trail on all human overrides | Medium | Every score override requires written reason |
| APPI/GDPR consent logging + erasure | High | Japan-specific: bank intro requires separate consent |
| Mobile-responsive layout | Low | Desktop-first, but responsive |
| EN/JP localization | Medium | Toggle in nav, persists to localStorage |
| Guided student onboarding flow | Medium | Invite → register → pledge → venture profile → cohort |
| File upload (receipts) | Medium | Required if expenses ≥ ¥50,000 |
| Per-student historical record | Low | Score history, P&L history, attendance log |

### Differentiators (Competitive Advantage — What Makes Mujin Unique)

| Feature | Complexity | Notes |
|---------|------------|-------|
| 4-signal Trust Score (25% each) | High | Responsiveness + Transparency + Mutualism + Reflection |
| Scores stored per-month, never computed live | Medium | Immutable audit trail — bank credibility |
| AI-assessed anonymous reflection | High | GPT-4o-mini; text never visible to staff; psychological safety |
| Peer-led Town Hall with majority-rule anonymous attendance | High | Non-submission = absent; majority ≥3/5 rules |
| 3-layer P&L completeness scoring (A/B/C) | High | Binary + auto-score + staff override with reason |
| Graduation state machine | Medium | INELIGIBLE → ELIGIBLE → INTERVIEW_SCHEDULED → GRADUATED |
| Auto-generated exit interview package | Medium | Score history, P&L summary, attendance, staff notes |
| Mentor role isolation | Medium | Group-scoped, no P&L access, cannot hold STAFF role |
| Within-cohort score visibility only | Low | First names/initials; not org-wide leaderboard |
| Multi-tenant architecture from day one | High | Organization as tenancy root; future SaaS expansion |
| Recyclable grant 2-tranche disbursement gating | Medium | ¥300K on signing / ¥200K at Month 3 with conditions |

### Anti-Features (Deliberately NOT Building)

| Feature | Reason |
|---------|--------|
| Real-time chat | High complexity; not core to Trust Engine value |
| Staff access to reflection text | Destroys psychological safety promise |
| Hard revenue floor for graduation | Revenue trend = soft signal only (exit interview layer) |
| Public leaderboard | Competitive dynamic undermines mutualism signal |
| Native mobile app | Desktop-first; responsive web sufficient for pilot |
| OAuth login (v1) | Email/password sufficient; adds complexity |
| Automated appeals system | Needs human judgment; adds complexity out of proportion to pilot scale |
| Video reflection | Storage/bandwidth cost; text sufficient for meaningfulness assessment |
| Bank API integration (pre-MOU) | Bank MOU not until Q1 2027; premature |
| Asylum seekers in pilot | Visa status too precarious for 12-month program |

## Feature Dependencies

```
Auth (RBAC, JWT, multi-tenant)
  └── Onboarding (invite, pledge, venture profile, cohort assignment)
        ├── Attendance Logging (check-ins, town halls)
        ├── P&L Submission (form, receipts, 3-layer scoring)
        └── Reflection (anonymous form, AI assessment)
              └── Scoring Engine (4-signal calculation, stored monthly)
                    ├── Student Dashboard (score, breakdown, graduation checklist)
                    ├── Mentor Dashboard (group view, flags)
                    └── Admin Dashboard (risk view, P&L review, overrides)
                          └── Graduation Tracking (state machine, exit package)
                                └── Notifications (reminders, alerts, graduation triggers)
                                      └── i18n (EN/JP for all student + admin strings)
```

## MVP Definition

### v1 — Pilot Launch (Q2 2027, 50 students)

**P1 — Core (must ship):**
- Auth + RBAC (all 5 roles)
- Student onboarding flow
- Bi-weekly check-in attendance logging (mentor)
- Monthly P&L submission + 3-layer scoring
- Monthly Town Hall attendance (anonymous form)
- Monthly anonymous reflection (AI-assessed)
- Trust Score engine (4 signals, stored monthly)
- Traffic light display (🟢/🟡/🔴)
- Student dashboard (score + breakdown + graduation checklist + upcoming)
- Mentor dashboard (group view + flags)
- Admin dashboard (risk view + P&L review + override)
- Graduation state machine + exit interview package
- Email notifications (P&L reminders, Red alerts, graduation triggers)
- EN/JP language toggle

**P2 — High value, ship if possible:**
- Random spot audit flag (10–20% of P&L submissions)
- Mentor attendance session management (open/close session)
- Per-student detail view (score history chart)

**P3 — Post-pilot:**
- Multi-org SaaS onboarding (self-serve org creation)
- Bank API integration (post-MOU)
- Digital mission alignment intake flow

### v1.x — Triggered by real usage data

- Score breakdown trend charts
- Cohort comparison view (admin)
- Bulk action on P&L reviews
- Configurable retention policy per org
- Notification preference management
- Mentor performance dashboards

### v2+ — Post-pilot SaaS expansion

- Multi-org onboarding
- Bank MOU API integration
- Refugee cohort differentiation (if needed)
- Advanced analytics (cohort completion rates, bank intro rates)

## Prioritization Matrix

| Feature | Priority | Phase |
|---------|----------|-------|
| Auth + RBAC | P1 | Phase 1 |
| Multi-tenant isolation | P1 | Phase 1 |
| Student onboarding | P1 | Phase 2 |
| Check-in attendance | P1 | Phase 3 |
| Town Hall attendance | P1 | Phase 3 |
| P&L submission + 3-layer scoring | P1 | Phase 4 |
| Anonymous reflection + AI assessment | P1 | Phase 4 |
| Scoring engine (all 4 signals) | P1 | Phase 5 |
| Student dashboard | P1 | Phase 6 |
| Mentor dashboard | P1 | Phase 6 |
| Admin dashboard | P1 | Phase 6 |
| Graduation state machine | P1 | Phase 7 |
| Exit interview package | P1 | Phase 7 |
| Email notifications | P1 | Phase 8 |
| EN/JP i18n | P1 | Phase 9 |
| Spot audit flag | P2 | Phase 4 |
| Score history chart | P2 | Phase 6 |
| Configurable retention policy | P3 | Post-pilot |
| Multi-org SaaS onboarding | P3 | Post-pilot |

## Competitor Analysis

| Platform | Category | What They Do | What's Missing |
|----------|----------|--------------|----------------|
| Apricot / Bonterra | NPO case management | Tracks clients, services, outcomes | No behavioral scoring; no bank introduction pipeline |
| F6S / Gust | Accelerator management | Application, portfolio tracking | No trust scoring; no graduation-to-bank pipeline |
| Salesforce NPSP | CRM for nonprofits | Donor + program management | No student-facing dashboard; not built for credit credentialing |
| SCORE mentorship platforms | Mentorship tracking | Check-in logging | No scoring engine; no financial reporting |

**Competitive whitespace:** No platform combines (1) behavioral trust scoring, (2) structured financial transparency (P&L), (3) peer accountability (Town Hall), AND (4) bank introduction pipeline. Mujin owns this intersection.

---
*Features research for: Multi-role Trust Engine SaaS — Mujin 2.0*
*Researched: 2026-03-16*
