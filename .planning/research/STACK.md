# Stack Research

**Domain:** Multi-tenant Fintech SaaS — Trust Engine / Behavioral Scoring Platform
**Researched:** 2026-03-16
**Confidence:** HIGH (core stack decisions locked by PROJECT.md; library choices verified against known ecosystem as of August 2025 + Next.js 15 official release)

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 15.x | Full-stack framework — App Router, Server Components, Server Actions, API routes | Stable as of Oct 2024. App Router is the production-ready path. React 19 included. Async request APIs (cookies, headers, params) are now standard — critical for JWT middleware. Decided and locked. |
| React | 19.x | UI rendering, Server Components | Ships with Next.js 15. Server Components reduce client bundle size — important for the Trust Score dashboard heavy on server-fetched data. |
| TypeScript | 5.x | Type safety across full stack | Required for shared types between Prisma models, API layer, and frontend. next.config.ts now natively supported. |
| PostgreSQL | 16.x | Primary relational database | Multi-tenant with `organizationId` FK partitioning. Strong JSONB support for P&L receipt metadata. ACID compliance critical for Trust Score audit trail. Decided and locked. |
| Prisma | 5.x (pin to 5.22+) | ORM — schema, migrations, type-safe queries | Best-in-class TypeScript ergonomics. Row-level multi-tenancy via `organizationId` on every model. Prisma Migrate handles schema evolution safely. Decided and locked. |
| Railway | current | PostgreSQL hosting | Managed PostgreSQL with simple Vercel integration. Decided and locked. |
| Vercel | current | Next.js hosting | Native Next.js platform — zero-config for App Router, Edge Middleware, ISR. Decided and locked. |

### Auth Layer

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `jose` | 5.x | JWT creation, signing, verification | The standard Web Crypto API-compatible JWT library for Next.js middleware (Edge Runtime). Does NOT require Node.js crypto — works in Vercel Edge Middleware. Do NOT use `jsonwebtoken` (Node.js-only, breaks in Edge). |
| `bcryptjs` | 2.x | Password hashing | Pure-JS bcrypt — works in both Node.js and Edge environments. `bcrypt` (native) fails in serverless cold starts with Prisma; bcryptjs avoids native binding issues. |

**JWT auth pattern for App Router:**
- Sign tokens in Route Handler (`/api/auth/login`) using `jose` SignJWT
- Store token in `HttpOnly` cookie (not localStorage) — XSS protection
- Verify in `middleware.ts` using `jose` jwtVerify — runs on Edge, intercepts every request before routing
- Attach decoded payload to request headers for downstream Server Components to read
- Refresh token stored separately with longer TTL; access token 15-minute TTL

### Multi-Tenant Data Layer

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Prisma | 5.x | Multi-tenant query scoping | Use `organizationId` as tenancy root on every model. Create a `createTenantPrismaClient` wrapper that enforces `where: { organizationId }` via Prisma middleware — prevents cross-tenant data leaks at the ORM layer, not the application layer. |
| PostgreSQL schemas (optional) | 16.x | Hard tenant isolation (post-pilot) | For the pilot (50 students, 1 org), shared schema with `organizationId` FK is sufficient and simpler. Schema-per-tenant adds complexity with Prisma that is not warranted until 10+ orgs. Revisit at SaaS launch. |

**Multi-tenant Prisma pattern:**

```typescript
// lib/prisma-tenant.ts
import { PrismaClient } from '@prisma/client'

export function createTenantClient(organizationId: string) {
  const prisma = new PrismaClient()

  prisma.$use(async (params, next) => {
    // Inject organizationId on all write operations
    if (params.action === 'create' || params.action === 'createMany') {
      params.args.data = { ...params.args.data, organizationId }
    }
    // Inject organizationId on all read operations
    if (['findFirst', 'findMany', 'findUnique', 'count', 'aggregate'].includes(params.action)) {
      params.args.where = { ...params.args.where, organizationId }
    }
    return next(params)
  })

  return prisma
}
```

Note: Prisma v5 deprecated `$use` middleware in favor of Prisma Client Extensions. Use `prisma.$extends` with query extensions for the same pattern in v5+.

### File Storage

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `@aws-sdk/client-s3` | 3.x | Cloudflare R2 file uploads (P&L receipts) | R2 is S3-compatible — the AWS SDK v3 is the standard client. Use `S3Client` pointed at `https://<account-id>.r2.cloudflarestorage.com`. V3 uses modular imports (tree-shakeable) and returns streams not buffers — correct for Next.js App Router Server Actions. |
| `@aws-sdk/s3-request-presigner` | 3.x | Presigned upload/download URLs | Generate short-lived presigned URLs for direct browser → R2 uploads. Avoids routing file bytes through Next.js server (avoids Vercel function payload limits). Critical for receipt uploads (PDF/image, potentially multi-MB). Decided and locked (Cloudflare R2). |

**R2 pattern for receipt uploads:**
1. Client requests presigned PUT URL from Server Action
2. Server generates presigned URL (5-minute TTL) via `@aws-sdk/s3-request-presigner`
3. Client uploads file directly to R2 (browser → R2, no server middleman)
4. Client sends R2 object key back to server to store in DB

### Email

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `resend` | 3.x | Transactional email (P&L reminders, red alerts, graduation triggers) | First-class React email templates, simple SDK, excellent deliverability. `resend.emails.send()` from Server Actions is idiomatic in Next.js 15. Decided and locked. |
| `react-email` | 3.x | Email template components | Co-designed with Resend. Write email templates as React components, preview in browser. Prevents HTML email maintenance hell. |

### Internationalization (i18n)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `next-intl` | 3.x | EN/JP language toggle with App Router support | The dominant i18n library for Next.js App Router as of 2025. Designed from the ground up for Server Components — translations can be loaded in Server Components without client bundle overhead. Supports `localStorage` persistence via cookie. Do NOT use `react-i18next` for this project — it requires client-side hydration for all translations, inflating bundle size unnecessarily. |

**next-intl App Router pattern:**
- Locale in URL segment (`/en/...`, `/ja/...`) OR cookie-based with middleware rewrite
- For Mujin: use cookie-based approach (no URL change) since EN/JP toggle should persist without changing routes
- Middleware reads `NEXT_LOCALE` cookie, rewrites internally to locale-aware routing
- Server Components use `useTranslations()` (server-safe) for zero client bundle cost on static text

### AI / Reflection Assessment

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `openai` | 4.x | AI assessment of monthly reflection submissions | Official OpenAI SDK. Use GPT-4o-mini for reflection scoring (cost-effective, sufficient for 50-200 word assessment). Call from Server Action — never expose API key to client. |

Assessment prompt pattern: assess whether text is 50+ words, coherent, and topically relevant to venture/business — return structured JSON `{ meaningful: boolean, wordCount: number, reason: string }`. Store result, not the reflection text accessible to staff (privacy requirement).

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `zod` | 3.x | Schema validation — forms, API inputs, env vars | Validate all Server Action inputs and API route bodies. Use `z.infer<>` to derive TypeScript types from Zod schemas — single source of truth. Also use for `env.ts` validation at startup. |
| `react-hook-form` | 7.x | Form state management (P&L submission, onboarding) | Pairs with Zod via `@hookform/resolvers`. Reduces controlled component boilerplate. Use for complex forms (P&L, venture profile). Simple forms (attendance toggle) can use plain Server Actions without RHF. |
| `@hookform/resolvers` | 3.x | Zod integration for react-hook-form | Bridges Zod schemas to react-hook-form validation. |
| `tailwindcss` | 3.x (or 4.x if stable) | Utility-first CSS | Standard for Next.js projects. Use v3 unless v4 PostCSS issues are resolved. Combine with `shadcn/ui` for component primitives. |
| `shadcn/ui` | latest | Accessible component library | Not a dependency — copy-paste components into the project. Built on Radix UI primitives. Produces accessible, unstyled-by-default components (progress bars for Trust Score, dialogs for score override). Avoids full component library lock-in. |
| `date-fns` | 3.x | Date arithmetic (cohort cycles, overdue calculations) | Lightweight, tree-shakeable. Required for bi-weekly check-in scheduling, monthly P&L deadline calculations, and graduation timeline. |
| `sharp` | latest | Image optimization (receipt image processing) | Auto-used by Next.js 15 for image optimization. Required if doing server-side receipt thumbnail generation. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `eslint` + `@typescript-eslint` | Linting | Next.js 15 ships with ESLint 9 config. Use flat config format. |
| `prettier` | Code formatting | Add `prettier-plugin-tailwindcss` for class sorting. |
| `prisma studio` | Database GUI | `npx prisma studio` — inspect multi-tenant data during development. |
| `dotenv-cli` | Environment management | Run `dotenv-cli -e .env.local -- prisma migrate dev` to avoid env var confusion between Railway (prod) and local DB. |
| `vitest` | Unit testing | Faster than Jest for TypeScript. Use for Trust Score calculation logic — deterministic business rules must be unit-tested. |
| `playwright` | E2E testing | Test auth flows, role-based routing, graduation state machine transitions. |

---

## Installation

```bash
# Core framework
npm install next@15 react@19 react-dom@19 typescript

# Auth
npm install jose bcryptjs
npm install -D @types/bcryptjs

# Database
npm install prisma @prisma/client
npx prisma init

# File storage (Cloudflare R2 via S3 SDK)
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner

# Email
npm install resend react-email @react-email/components

# i18n
npm install next-intl

# AI reflection assessment
npm install openai

# Validation + forms
npm install zod react-hook-form @hookform/resolvers

# UI
npm install tailwindcss postcss autoprefixer
npx shadcn@latest init

# Utilities
npm install date-fns

# Dev dependencies
npm install -D vitest playwright @playwright/test eslint prettier prettier-plugin-tailwindcss
```

---

## Alternatives Considered

| Recommended | Alternative | Why Not |
|-------------|-------------|---------|
| `jose` (JWT) | `jsonwebtoken` | `jsonwebtoken` uses Node.js `crypto` module — breaks in Next.js Edge Middleware (Vercel). `jose` uses Web Crypto API and works everywhere. |
| `jose` (JWT) | NextAuth / Auth.js | PROJECT.md explicitly requires custom JWT for future white-label SaaS control. NextAuth imposes session shape and DB schema constraints that conflict with multi-tenant role model. |
| `next-intl` | `react-i18next` | `react-i18next` requires client-side bootstrap; Server Components receive no translations until hydration. `next-intl` is designed for App Router's server-first model. |
| `next-intl` | `next-i18next` | `next-i18next` is Pages Router-native; App Router support is a workaround, not first-class. Abandoned for `next-intl`. |
| Prisma `$extends` (query extensions) | Prisma middleware `$use` | `$use` is deprecated in Prisma v5. `$extends` with query extensions is the current pattern for tenant-scoped clients. |
| `bcryptjs` | `bcrypt` (native) | Native `bcrypt` requires compilation; fails in Vercel's serverless environment on cold starts when combined with Prisma's native binary. `bcryptjs` is pure JS, zero native deps. |
| `@aws-sdk/client-s3` v3 | Cloudflare's `workers-sdk` / `@cloudflare/r2` | AWS SDK v3 is the mature, well-documented path for R2 (R2 is S3-compatible by design). Cloudflare's own SDK targets Workers runtime, not Node.js/Vercel. |
| `vitest` | Jest | Vitest is faster, native ESM, shares Vite's transform pipeline. Next.js 15 + TypeScript + ESM works better with Vitest. Jest requires additional transform config. |
| `shadcn/ui` | Chakra UI / MUI | shadcn/ui copies components into your repo (no runtime dependency), making the Trust Score dashboard fully customizable without overriding library internals. MUI/Chakra add significant bundle weight and opinionated design tokens that conflict with Tailwind. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `jsonwebtoken` | Node.js crypto module only — throws in Edge Middleware and Cloudflare Workers. The single most common JWT mistake in Next.js App Router projects. | `jose` |
| NextAuth / Auth.js | Forces a specific session shape and adds `Account`, `Session` tables to your schema. Conflicts with custom multi-tenant role model (STUDENT/MENTOR/STAFF/ORG_ADMIN/SUPER_ADMIN). Difficult to extract from later for white-label. | Custom JWT with `jose` |
| Prisma `$use` middleware | Deprecated in Prisma v5. Will be removed. | `prisma.$extends({ query: { ... } })` |
| `next-i18next` | Pages Router library. App Router support is a community hack, not maintained. | `next-intl` |
| `react-i18next` (standalone) | Works, but requires `I18nextProvider` client wrapper — forces all translation consumers to be Client Components or use workarounds. Defeats Server Components. | `next-intl` |
| Prisma schema-per-tenant (for pilot) | Extreme complexity with Prisma migrations across dynamic schemas. Requires raw SQL migration scripts, breaks `prisma migrate dev`. Not warranted until 10+ organizations. | `organizationId` FK on every model + Prisma Client Extensions query scoping |
| `localStorage` for JWT tokens | Exposed to XSS. Storing JWT in localStorage is a security anti-pattern for fintech. | `HttpOnly` cookie with `Secure` + `SameSite=Strict` flags |
| Vercel AI SDK (for reflection assessment) | Adds abstraction overhead for what is a single deterministic prompt. Overkill for one AI call per monthly submission. | Direct `openai` SDK call from Server Action |

---

## Stack Patterns by Variant

**For Trust Score calculation (monthly batch):**
- Use Server Action triggered by cron (Vercel Cron) or manual admin trigger
- Read all signals from DB, compute score, write to `TrustScoreRecord` — never compute live
- This is a pure database read/write operation — no external API calls except optional AI reflection assessment

**For P&L receipt upload:**
- Use presigned URL pattern (client → R2 direct upload)
- Never proxy file bytes through Next.js/Vercel (4.5MB payload limit on Hobby plan, 50MB on Pro)
- Store R2 object key in `PlStatement.receiptKeys: String[]` (Prisma JSON or array field)

**For role-based routing:**
- Enforce in `middleware.ts` (Edge, runs before every request)
- Decode JWT, check role, redirect unauthorized access before page renders
- Secondary enforcement in Server Components via `getCurrentUser()` helper that reads from request headers populated by middleware

**For APPI/GDPR compliance:**
- Store consent timestamp and version in `ConsentRecord` table on every user
- Implement soft-delete (`deletedAt`) on all PII-bearing models
- `right-to-erasure` = set `deletedAt`, anonymize name/email fields, retain aggregate Trust Score records (legitimate interest for bank MOU audit trail)

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `next@15` | `react@19`, `react-dom@19` | Next.js 15 ships with React 19. Do not mix React 18 in App Router. |
| `next@15` | `node >= 18.18.0` | Minimum Node version raised in Next.js 15. Railway/Vercel both meet this. |
| `prisma@5` | `@prisma/client@5` | Must keep `prisma` and `@prisma/client` versions in sync. |
| `next-intl@3` | `next@15` | next-intl v3 added full Next.js 15 + React 19 support. Do not use next-intl v2. |
| `jose@5` | Edge Runtime | jose v5 fully supports Web Crypto — confirmed working in Vercel Edge Middleware. jose v4 also works but v5 has better TypeScript types. |
| `@aws-sdk/client-s3@3` | Node.js >= 16 | V3 is ESM-compatible and works in Vercel Node.js functions. Does NOT work in Edge Runtime — R2 uploads must go through Node.js Route Handlers or Server Actions, not Edge Middleware. |
| `react-hook-form@7` | `react@19` | RHF v7.51+ added React 19 compatibility. Pin to 7.51+. |

---

## Sources

- Next.js 15 official release blog (https://nextjs.org/blog/next-15) — confirmed stable, React 19, async APIs, Node 18.18 minimum [HIGH confidence]
- PROJECT.md (`.planning/PROJECT.md`) — stack decisions locked: Next.js 14+, PostgreSQL, Prisma, Cloudflare R2, Resend, Vercel + Railway, custom JWT [authoritative]
- `jose` library — Web Crypto JWT, Edge-compatible; widely documented as the correct JWT library for Next.js middleware. `jsonwebtoken` incompatibility with Edge is a documented and widely-confirmed issue [HIGH confidence]
- Prisma v5 deprecation of `$use` in favor of `$extends` — documented in Prisma v5 migration guide [HIGH confidence as of training cutoff August 2025]
- `next-intl` v3 App Router support — library has been the community standard for App Router i18n since 2024 [MEDIUM confidence — verify version compat with next 15 at install time]
- `bcryptjs` vs `bcrypt` in serverless — well-documented community pattern; native bindings cause issues in Vercel serverless [MEDIUM confidence — verify no regression in Prisma 5+ deployment]
- R2 S3-compatibility — Cloudflare R2 documentation confirms S3 API compatibility; AWS SDK v3 is the recommended client [HIGH confidence]
- Resend SDK — `resend` npm package v3 is the current stable version; react-email co-design with Resend is documented [HIGH confidence]

---

*Stack research for: Mujin 2.0 — Multi-tenant Fintech SaaS (Trust Engine)*
*Researched: 2026-03-16*
