# Phase 1: Foundation and Auth - Context

**Gathered:** 2026-03-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver a secure, multi-tenant authentication system: user registration, email verification, login, session management (JWT access + refresh tokens), password reset, 5-role RBAC enforced server-side, and APPI/GDPR consent logging. This is infrastructure — no product features are delivered here, but every subsequent phase builds on this foundation. The multi-tenant Prisma client and audit trail scaffolding are also established in this phase.

</domain>

<decisions>
## Implementation Decisions

### Session Handling
- Silent background refresh — access token (15-min) refreshed automatically in the background before expiry; user never sees a "session expired" prompt unless the refresh token itself expires (30 days)
- Refresh token stored as HttpOnly, Secure, SameSite=Strict cookie only — never in response body, localStorage, or sessionStorage
- On refresh token expiry: redirect to /login with a generic "Session expired, please log in again" message
- On logout: refresh token revoked immediately in DB; all cookies cleared

### Password Policy
- Minimum 8 characters — no forced complexity (uppercase, symbols, etc.)
- Rationale: international student cohort across devices; overly complex rules increase support burden for a 50-student pilot
- Bcrypt hash via `bcryptjs` (pure-JS, no native bindings that break Vercel serverless)

### Multi-Device Sessions
- Concurrent sessions allowed — same user can be logged in on multiple devices simultaneously
- Each device gets its own refresh token record in DB
- Logout on one device does not invalidate other device sessions
- Rationale: students use both laptop and phone; adding device management complexity is premature for pilot

### Auth Error UX
- Generic error messages only: "Invalid email or password" for login failures
- No distinction between "email not found" and "wrong password" — prevents user enumeration
- Registration: does surface "Email already in use" (acceptable — this doesn't expose password knowledge)
- Password reset: always shows "If that email exists, a reset link has been sent" regardless of whether email is in system

### RBAC Route Protection
- Two-tier auth: `proxy.ts` (Edge Runtime) for fast route-level JWT decode + redirect; `lib/dal.ts` for per-resource DB authorization
- `proxy.ts` decodes JWT claims only — no DB calls; injects `x-org-id`, `x-user-id`, `x-role` headers
- `lib/dal.ts` reads those headers; performs DB check for sensitive mutations
- Route groups: `(auth)` for public, `(student)` for STUDENT only, `(mentor)` for MENTOR only, `(admin)` for STAFF/ORG_ADMIN/SUPER_ADMIN
- Hard rule: MENTOR + STAFF/ADMIN role conflict checked at registration and role assignment (DB constraint + application check)

### Multi-Tenant Isolation
- `organizationId` FK on every model; Prisma `$extends` client auto-injects `organizationId` on all queries
- All DB access goes through `lib/dal.ts` — no raw `prisma.*` calls in routes, components, or Server Actions
- Organization seed: Mujin org created in migration as Org #1
- Cross-tenant read is structurally impossible via the scoped client

### APPI/GDPR Consent
- `ConsentRecord` table: `userId`, `dataCategory`, `purpose`, `tosVersion`, `consentedAt`, `ipAddress`
- Consent captured at registration: `dataCategory = "platform"`, `purpose = "account_management"`
- Soft-delete + PII anonymization on erasure request: name → "DELETED", email → hashed value, phone → null
- AuditLog entries for all consent events

### Claude's Discretion
- Exact email template design for verification and password reset
- Loading state handling for auth forms
- Exact token rotation implementation details (the pattern is decided; implementation approach is flexible)
- Error boundary behavior for auth failures

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project context
- `.planning/PROJECT.md` — Core constraints, tech stack decisions, multi-tenant rationale
- `.planning/REQUIREMENTS.md` §Authentication & RBAC — AUTH-01 through AUTH-12 (all requirements for this phase)

### Research findings
- `.planning/research/STACK.md` — `jose` vs `jsonwebtoken` Edge compatibility, `bcryptjs` rationale, Next.js 15 async request API changes
- `.planning/research/ARCHITECTURE.md` — Two-layer auth pattern (proxy.ts + DAL), Prisma `$extends` tenant scoping example, recommended project structure
- `.planning/research/PITFALLS.md` — Pitfalls #1 (JWT role re-validation), #2 (multi-tenant leakage), #4 (refresh token storage), #5 (APPI consent) — all must be addressed in this phase
- `.planning/research/SUMMARY.md` §Phase 1 — Phase-specific rationale and pitfall mapping

### No external specs
No external ADRs or design docs yet — all requirements captured in REQUIREMENTS.md and decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, no existing code

### Established Patterns
- Next.js 15 App Router with TypeScript (App Router, not Pages Router)
- `proxy.ts` for Edge middleware (Next.js v16 naming — replaces `middleware.ts`)
- Prisma 5 with `$extends` for multi-tenant scoping (not deprecated `$use`)
- `jose` for JWT operations (not `jsonwebtoken` — Edge Runtime incompatibility)
- `bcryptjs` for password hashing (pure-JS, serverless-safe)
- Server Actions for form submissions and mutations
- `shadcn/ui` + Tailwind CSS for UI components

### Integration Points
- `proxy.ts` → injects headers for all downstream routes
- `lib/prisma.ts` → Prisma client singleton with `$extends` scoping; all other files import from here
- `lib/dal.ts` → all DB queries; reads headers from proxy
- `lib/auth/` → JWT sign/verify helpers; called by auth Server Actions and proxy
- `app/(auth)/` → login, register, reset-password pages; public routes
- `AuditLog` table → written by all mutations; established in this phase as infrastructure

</code_context>

<specifics>
## Specific Ideas

- All auth decisions align with the research team's documented recommendations — see `.planning/research/STACK.md` for specific library rationale
- The APPI consent model anticipates three collection points total: registration (this phase), P&L submission (Phase 4), bank introduction trigger (Phase 8) — the table structure should support all three from the start

</specifics>

<deferred>
## Deferred Ideas

- Social/OAuth login — explicitly out of scope (PROJECT.md decision; email/password sufficient for pilot)
- 2FA — future consideration post-pilot
- Self-serve org registration (multi-org SaaS onboarding) — v2 feature; only Mujin as Org #1 in pilot

</deferred>

---

*Phase: 01-foundation-and-auth*
*Context gathered: 2026-03-16*
