# Architecture Research

**Domain:** Multi-tenant Next.js SaaS — Behavioral Scoring / Fintech Trust Engine
**Researched:** 2026-03-16
**Confidence:** HIGH (verified against Next.js 15 official docs, Next.js v16 proxy migration docs)

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      BROWSER / CLIENT                        │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐               │
│  │  Student  │  │  Mentor   │  │   Admin   │               │
│  │  Views    │  │  Views    │  │  Views    │               │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘               │
└────────┼──────────────┼──────────────┼───────────────────────┘
         │              │              │
┌────────▼──────────────▼──────────────▼───────────────────────┐
│                  proxy.ts (Edge Runtime)                      │
│  JWT decode → route guard → tenant header injection           │
├───────────────────────────────────────────────────────────────┤
│                 Next.js App Router (Server)                    │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌──────────┐  │
│  │  Server   │  │  Server   │  │  Route    │  │  Email   │  │
│  │  Actions  │  │Components │  │ Handlers  │  │  Queue   │  │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └────┬─────┘  │
│        │              │              │              │        │
│  ┌─────▼──────────────▼──────────────▼──────────────▼─────┐  │
│  │               lib/dal.ts (Data Access Layer)            │  │
│  │         Authorization check close to data               │  │
│  │         Tenant-scoped Prisma client ($extends)          │  │
│  └────────────────────────────┬────────────────────────────┘  │
│                               │                               │
│  ┌────────────────────────────▼────────────────────────────┐  │
│  │              lib/scoring/engine.ts                       │  │
│  │         Trust Score computation (server-side)            │  │
│  │         Triggered on: P&L approved, attendance marked,   │  │
│  │         reflection submitted, override applied           │  │
│  └────────────────────────────┬────────────────────────────┘  │
├───────────────────────────────┼───────────────────────────────┤
│                    DATA LAYER │                               │
│  ┌────────────────┐  ┌────────▼──────┐  ┌──────────────────┐ │
│  │  PostgreSQL    │  │  AuditLog     │  │  Cloudflare R2   │ │
│  │  (Railway)     │  │  (append-only)│  │  (receipt files) │ │
│  └────────────────┘  └───────────────┘  └──────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| `proxy.ts` | JWT decode, route guard, tenant header injection (Edge) | `jose` verifyJWT, `NextResponse.next()` with headers |
| `lib/dal.ts` | Per-resource authorization, tenant-scoped DB queries | React `cache()` + Prisma `$extends` scoped client |
| `lib/scoring/engine.ts` | Trust Score computation on triggers | Pure function → writes `TrustScore` record to DB |
| Server Actions | Form submissions, attendance marking, P&L review | `use server`, validates session, calls DAL |
| Route Handlers | R2 presigned URL generation, webhook endpoints | `GET /api/upload-url`, `POST /api/webhooks/*` |
| `lib/email/` | Email notification dispatch | Resend SDK + react-email templates |
| `AuditLog` table | Append-only event log for all human overrides | Written by every Server Action on mutation |

## Recommended Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group: login, register, reset
│   ├── (student)/                # Student-facing pages (RBAC guarded)
│   │   ├── dashboard/
│   │   ├── reports/              # P&L submission
│   │   └── town-hall/            # Anonymous reflection form
│   ├── (mentor)/                 # Mentor-facing pages
│   │   └── attendance/
│   ├── (admin)/                  # Admin-facing pages
│   │   ├── students/
│   │   ├── pl-review/
│   │   └── graduation/
│   └── api/
│       ├── upload-url/           # R2 presigned URL endpoint
│       └── cron/                 # Vercel Cron: monthly score batch
├── lib/
│   ├── auth/                     # JWT sign/verify, session helpers
│   ├── dal.ts                    # Data Access Layer (tenant-scoped)
│   ├── prisma.ts                 # Prisma client singleton + $extends
│   ├── scoring/
│   │   ├── engine.ts             # calculateTrustScore() pure function
│   │   └── triggers.ts           # Event → score recalculation mapping
│   ├── email/
│   │   ├── templates/            # react-email templates
│   │   └── send.ts               # Resend dispatch wrapper
│   └── ai/
│       └── reflection.ts         # AI meaningfulness assessment
├── components/
│   ├── ui/                       # Primitive components
│   ├── trust-score/              # TrustScore display components
│   └── dashboard/                # Dashboard-specific components
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── messages/                     # i18n locale files
│   ├── en.json
│   └── ja.json
└── proxy.ts                      # Edge auth guard (replaces middleware.ts in Next.js v16)
```

### Structure Rationale

- **Route groups `(auth)`, `(student)`, `(mentor)`, `(admin)`:** Separate layouts per role without URL segments; RBAC enforced at both proxy.ts + DAL
- **`lib/dal.ts` as single data access point:** Prevents scattered auth checks; all DB queries go through tenant-scoped Prisma client
- **`lib/scoring/engine.ts` isolated:** Pure function, independently testable; no HTTP context, no side effects — just inputs → TrustScore record
- **`lib/ai/reflection.ts` isolated:** AI assessment decoupled from scoring engine; can be mocked in tests

## Architectural Patterns

### Pattern 1: Two-Layer Auth (Proxy + DAL)

**What:** `proxy.ts` handles routing/redirect decisions (fast, no DB). `lib/dal.ts` handles per-resource authorization close to the data (with DB).

**When to use:** Every route. Never skip either layer.

**Trade-offs:** Slight duplication but critical — proxy alone can't do per-resource checks, DAL alone is too late for UX redirects.

**Example:**
```typescript
// proxy.ts — fast JWT decode, no DB
export async function proxy(request: NextRequest) {
  const token = request.cookies.get('access-token')?.value
  const payload = await verifyJWT(token) // jose, no DB
  if (!payload) return NextResponse.redirect('/login')

  // Inject tenant context for downstream use
  const response = NextResponse.next()
  response.headers.set('x-org-id', payload.orgId)
  return response
}

// lib/dal.ts — per-resource check with DB
export const getStudentDashboard = cache(async (studentId: string) => {
  const session = await getSession() // reads headers set by proxy
  if (session.role !== 'STUDENT' || session.userId !== studentId) {
    throw new UnauthorizedError()
  }
  return db.student.findUnique({ where: { id: studentId } })
})
```

### Pattern 2: Scoring Engine as Triggered Write

**What:** Trust Score is never computed at read time. A pure server function `calculateTrustScore()` is called on explicit triggers and writes an immutable `TrustScore` record to the DB.

**When to use:** Every scoring event — attendance marked, P&L finalized, override applied, reflection assessed.

**Trade-offs:** Storage overhead (one record per student per month) vs. guaranteed audit trail and fast dashboard reads.

**Example:**
```typescript
// lib/scoring/engine.ts
export async function recalculateTrustScore(studentId: string, month: string) {
  const inputs = await gatherScoringInputs(studentId, month) // rolling 3mo window
  const score = {
    responsiveness: inputs.checkInsAttended / inputs.checkInsHeld,
    transparency: inputs.plFinalScore / 100,
    mutualism: inputs.townHallsAttended / inputs.townHallsHeld,
    reflection: inputs.reflectionMeaningful ? 1 : 0,
  }
  const total = (score.responsiveness + score.transparency + score.mutualism + score.reflection) * 25

  return db.trustScore.create({
    data: { studentId, month, ...score, total, trafficLight: toTrafficLight(total) }
  })
}
```

### Pattern 3: R2 Presigned URL Upload

**What:** Client requests a presigned PUT URL from a Route Handler. Client uploads directly to R2. Server Action confirms upload and records metadata.

**When to use:** All file uploads (P&L receipts). Never proxy file bytes through Next.js/Vercel.

**Trade-offs:** Two-step UX vs. avoiding Vercel's 4.5MB request limit and egress costs.

**Example:**
```typescript
// app/api/upload-url/route.ts
export async function GET(req: Request) {
  const { fileKey } = await validateSession(req) // check auth first
  const presignedUrl = await r2.sign(
    new Request(`https://${R2_BUCKET}.r2.cloudflarestorage.com/${fileKey}`, { method: 'PUT' }),
    { expiresIn: 300 }
  )
  return Response.json({ url: presignedUrl, key: fileKey })
}
```

## Data Flow

### Trust Score Calculation Flow

```
[Trigger Event: e.g., Staff approves P&L]
    ↓
Server Action: approvePL(submissionId)
    ↓
DAL: updatePLSubmission(finalScore) → writes PLSubmission
    ↓
Trigger: recalculateTrustScore(studentId, month)
    ↓
engine.ts: gatherInputs() → calculate() → TrustScore.create()
    ↓
AuditLog.create({ event: 'TRUST_SCORE_CALCULATED', ... })
    ↓
[Dashboard reads: db.trustScore.findFirst({ orderBy: { createdAt: 'desc' } })]
```

### File Upload Flow

```
[Student clicks "Upload Receipt"]
    ↓
Client: GET /api/upload-url?type=receipt
    ↓
Route Handler: verifySession → generate R2 presigned PUT URL
    ↓
Client: PUT <presigned-url> with file bytes (direct to R2)
    ↓
Client: Server Action confirmUpload(fileKey)
    ↓
Server Action: create ReceiptRecord in DB with fileKey
```

### APPI Erasure Flow

```
[Erasure Request: student account deletion]
    ↓
Server Action: requestErasure(userId)
    ↓
Soft-delete User record (deleted_at set)
    ↓
PII anonymization: name → "DELETED", email → hash, phone → null
    ↓
AuditLog records: RETAIN with hashed reference (not deleted — audit trail preserved)
    ↓
R2: Delete receipt files for this user
    ↓
ConsentRecord: mark erasure_requested_at + erasure_completed_at
```

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-500 users (pilot) | Monolith is fine. Vercel Cron for monthly batch. Single Railway Postgres instance. |
| 500-5k users (post-pilot SaaS) | Add connection pooling (PgBouncer / Prisma Accelerate). Separate scoring batch to a queue (Inngest or similar). |
| 5k+ users | Schema-per-tenant becomes viable. Consider read replicas for dashboards. |

### Scaling Priorities

1. **First bottleneck:** Monthly Trust Score batch for 500+ students in one Cron invocation — switch to queue-based processing (one job per student) before this becomes an issue
2. **Second bottleneck:** Dashboard queries hitting N+1 on cohort view — ensure `include: { trustScores: { take: 1 } }` is used, not separate fetches per student

## Anti-Patterns

### Anti-Pattern 1: DB Queries in proxy.ts

**What people do:** Check user roles in middleware/proxy against the database on every request.

**Why it's wrong:** Proxy runs in Edge Runtime — latency spikes, and DB connections aren't designed for Edge. Also creates single point of failure.

**Do this instead:** Proxy only decodes JWT and checks claims already in the token. DAL handles per-resource DB checks after routing.

### Anti-Pattern 2: Computing Trust Score at Read Time

**What people do:** Build a `GET /api/trust-score` endpoint that calculates the score on every request.

**Why it's wrong:** Banks reviewing exit interview packages need a stable, auditable historical record. Live computation means scores can retroactively change if historical data is corrected. Also slow.

**Do this instead:** Write scores on triggers, read from `TrustScore` table. Immutable records = audit trail = bank credibility.

### Anti-Pattern 3: Missing Tenant Isolation in Prisma

**What people do:** Use the default Prisma client and manually add `where: { organizationId }` to each query.

**Why it's wrong:** One missed `where` clause = cross-tenant data leak. Catastrophic for a multi-tenant platform.

**Do this instead:** Use Prisma `$extends` to create a tenant-scoped client that injects `organizationId` on every query automatically. All queries must go through this client.

### Anti-Pattern 4: Exposing Reflection Text

**What people do:** Store reflection text in a queryable column that staff can access via admin queries.

**Why it's wrong:** The psychological safety promise is the product. Violating it — even accidentally — destroys student trust.

**Do this instead:** Store only `{ is_meaningful: boolean, assessed_at: datetime, word_count: int }`. Text can be discarded after assessment or stored encrypted with a key staff cannot access.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Cloudflare R2 | Presigned PUT URL (client-direct upload); `aws-sdk/client-s3` for presign + admin ops | Never proxy bytes through Vercel |
| Resend | `resend.emails.send()` in Server Actions; react-email templates | Fire-and-forget for reminders; log failures to AuditLog |
| OpenAI / GPT-4o-mini | HTTP call in `lib/ai/reflection.ts`; returns `{ meaningful: boolean }` | Structured output, no streaming needed; handle 429/timeout gracefully |
| Railway (Postgres) | Prisma connection pooling URL; `DATABASE_URL` + `DIRECT_URL` for migrations | Use `DIRECT_URL` for migrations, connection pool URL for queries |
| Vercel Cron | `app/api/cron/monthly-scores/route.ts` with `vercel.json` cron config | Protect with `CRON_SECRET` header check |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Server Actions ↔ DAL | Direct function calls (same process) | Never call DAL from client components |
| Scoring Engine ↔ Triggers | Explicit function call after trigger completes | Not event-driven for pilot; add queue for scale |
| proxy.ts ↔ Server Components | HTTP headers (`x-org-id`, `x-user-id`, `x-role`) | Read via `headers()` in DAL |

## Sources

- Next.js 15 App Router official docs (authentication patterns, Server Actions, proxy/middleware)
- Next.js v16 proxy.ts migration docs (2026-02-27 release)
- Prisma v5 Client Extensions docs (`$extends` for multi-tenant scoping)
- Cloudflare R2 presigned URL documentation

---
*Architecture research for: Multi-tenant Next.js Trust Engine SaaS*
*Researched: 2026-03-16*
