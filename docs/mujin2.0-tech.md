# Mujin 2.0 — Technical Reference

All system architecture, infrastructure, schema, seed accounts, env vars, API routes, and deploy instructions. Extracted from the working doc after session 20.

---

## System Architecture

### Tech Stack

| Layer | Choice | Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 14+ (App Router, TypeScript) | Full-stack in one repo; strong ecosystem; solo-dev friendly |
| **Database** | PostgreSQL | Relational audit trails; JSON fields for flexibility |
| **ORM** | Prisma | Type-safe queries; migrations; excellent DX |
| **Auth** | Custom JWT (built from scratch) | Future white-label SaaS for non-profits; full control |
| **File Storage** | Cloudflare R2 | S3-compatible; cheap egress; Tokyo PoP |
| **Email** | Resend | Simple API; good deliverability |
| **Hosting** | Vercel (app) + Railway (Postgres) | Fast deploys; managed DB |
| **Language** | i18next (EN/JP toggle) | Persists in localStorage |

---

### Auth Architecture

- **Multi-tenant from day one** — `Organization` is the tenancy root (Mujin = org #1; future non-profits = additional orgs)
- **Roles:** `STUDENT | ALUMNI | MENTOR | STAFF | ORG_ADMIN | SUPER_ADMIN`
- **MENTOR constraint:** Cannot hold STAFF or ORG_ADMIN simultaneously (DB-level check constraint)
- **Flow:** Email + password → bcrypt verify → JWT access token (15min) + refresh token (30-day, DB-stored, rotated on use)
- **Compliance:** Consent logging (`ConsentRecord` table), soft-delete + PII anonymization on erasure requests, data retention configurable per org (default: archive 3 years post-graduation)
- **Auth flow:** Login → POST /api/auth/login → reads `Authorization: Bearer <token>` from response header → saved to localStorage as `mujin_session`. Dashboard pages are client-side auth-guarded.
- **Proxy middleware:** `src/proxy.ts` (renamed from middleware.ts; exports `proxy` function) — route-level auth guard, injects x-user-id, x-user-role, x-org-id headers

---

### Core Data Model

| Entity | Purpose |
| :--- | :--- |
| `Organization` | Tenancy root |
| `User` | Belongs to org; role-gated |
| `MentorCohortAssignment` | Links MENTOR user to exactly one Cohort (1:1 enforced) |
| `Cohort` | Group of 5 students within an org |
| `StudentProfile` | Extends User; venture profile, cohortId |
| `VentureProfile` | Venture name, description, coFounders |
| `PledgeRecord` | Immutable, versioned audit trail of pledge signing |
| `InviteToken` | Activation links for accepted students + mentors (7-day TTL) |
| `CheckInSession` | Bi-weekly event, staff creates; locked on submit |
| `AttendanceRecord` | Student × CheckInSession → present/absent |
| `CheckInNote` | Student 3-part form (agendaRecap/actionItems/reflection); editable until mentor grades |
| `CheckInGrade` | Mentor 1–5 star rating + feedback per note; visible to student after grading |
| `TownHall` | Monthly event, org-wide, staff creates |
| `TownHallSubmission` | Student anonymous form — attendance report + reflection text; text never returned to staff |
| `ReflectionAssessment` | AI result (`MEANINGFUL` / `NOT_MEANINGFUL`) + resubmission state |
| `PLSubmission` | Monthly; revenue/expenses/net/notes/receipts; autoScore/staffScore/finalScore |
| `PLReview` | Staff action on a PLSubmission |
| `TrustScore` | Computed monthly per student; stored (full audit trail) |
| `TrustScoreOverride` | Staff override + required written reason |
| `GraduationRecord` | Checklist state + graduation_status state machine |
| `BankIntroTracking` | 4-milestone bank journey post-graduation |
| `GrantTranche2` | Second tranche disbursement record (M3 release) |
| `ConsentRecord` | ToS version + timestamp (APPI/GDPR) |
| `Application` | Student application from Google Sheets sync |
| `SheetConfig` | Google Sheets connection config per org |

---

### Prisma Schema (Core — as of session 18/19)

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

// ─── Enums ────────────────────────────────────────────────────────────────────

enum Role {
  STUDENT
  ALUMNI
  MENTOR
  STAFF
  ORG_ADMIN
  SUPER_ADMIN
}

enum VentureCategory {
  FINTECH
  EDTECH
  HEALTHTECH
  SOCIAL_ENTERPRISE
  ECOMMERCE
  FOOD_BEVERAGE
  CREATIVE_MEDIA
  OTHER
}

enum PLSubmissionStatus {
  PENDING
  SUBMITTED
  APPROVED
  FLAGGED
  MORE_INFO
}

enum PLReviewAction {
  APPROVED
  FLAGGED
  MORE_INFO
  SCORE_OVERRIDE
}

enum ReflectionResult {
  MEANINGFUL
  NOT_MEANINGFUL
}

enum ResubmissionState {
  NONE
  WINDOW_OPEN
  WINDOW_EXPIRED
  RESUBMITTED
  LOCKED
}

enum GraduationStatus {
  INELIGIBLE
  ELIGIBLE
  INTERVIEW_SCHEDULED
  INTERVIEW_PASSED
  INTERVIEW_FAILED
  GRADUATED
}

enum ApplicationStatus {
  PENDING
  ACCEPTED
  REJECTED
  WAITLISTED
}

enum BankMeetingOutcome {
  PENDING
  SCHEDULED
  COMPLETED
  DECLINED
}

// ─── Core Tenant / Auth ───────────────────────────────────────────────────────

model Organization {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  users        User[]
  cohorts      Cohort[]
  inviteTokens InviteToken[]
  townHalls    TownHall[]
  sheetConfig  SheetConfig?
  applications Application[]
}

model User {
  id           String       @id @default(cuid())
  email        String       @unique
  passwordHash String
  role         Role
  orgId        String
  org          Organization @relation(fields: [orgId], references: [id])
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  deletedAt    DateTime?    // soft delete — PII anonymisation on erasure

  refreshTokens          RefreshToken[]
  passwordResetTokens    PasswordResetToken[]
  consentRecords         ConsentRecord[]
  mentorAssignment       MentorCohortAssignment?
  createdInviteTokens    InviteToken[]           @relation("InviteTokenCreator")
  studentProfile         StudentProfile?
  pledgeRecord           PledgeRecord?
  townHallSubmissions    TownHallSubmission[]    @relation("TownHallSubmitter")
  plReviews              PLReview[]              @relation("PLReviewer")
  trustScoreOverrides    TrustScoreOverride[]    @relation("TrustScoreOverrider")
  checkInGrades          CheckInGrade[]          @relation("CheckInGrader")
  applicationReviews     Application[]           @relation("ApplicationReviewer")
  tranche2Releases       GrantTranche2[]         @relation("Tranche2Releaser")

  @@index([orgId])
  @@index([email])
}
```

---

### Scoring Engine Formula

Runs server-side on every trigger (attendance marked, P&L finalised, reflection assessed, override applied). Writes to DB — never computed live on read.

```
score = (responsiveness_pct × 0.25) + (transparency_pct × 0.25) + (mutualism_pct × 0.25) + (reflection_pct × 0.25)

responsiveness_pct = check-ins attended / check-ins held (rolling 3 months)
transparency_pct   = final P&L completeness score (Layer B adjusted by Layer C)
mutualism_pct      = town halls attended / town halls held (rolling 3 months)
reflection_pct     = 100 if MEANINGFUL, 0 if NOT_MEANINGFUL or not submitted
```

**Traffic Light thresholds:** Green 75–100 / Yellow 50–74 / Red 0–49

**Layer B auto-score formula:** revenue(+25) + expenses(+25) + notes non-empty(+25) + receipts if expenses≥¥50k else free(+25)

**Majority-rule computation:** threshold = ceil(submissionCount / 2); re-computed on every new submission (idempotent)

**AI model for reflection assessment:** `claude-haiku-4-5-20251001` (binary classification, ~$0.0003/call)

---

## Seed Accounts (Local Dev + Production)

| Email | Password | Role | Notes |
| :--- | :--- | :--- | :--- |
| `admin@mujin.jp` | `mujin2026!` | ORG_ADMIN | org: org-mujin |
| `student@mujin.jp` | `student2026!` | STUDENT | Has StudentProfile, no cohort |
| `mentor@mujin.jp` | `mentor2026!` | MENTOR | No cohort assigned |
| `alumni@mujin.jp` | `alumni2026!` | ALUMNI | Venture: YenWise (FINTECH), 8-month GREEN streak, graduated 2027-01-22, bank: Kiraboshi Bank |
| `kai.watanabe@demo.mujin.jp` | `demo2027!` | STUDENT | PayRoute, GREEN_STRONG, INTERVIEW_SCHEDULED — demo snapshot target |
| `nana.kobayashi@demo.mujin.jp` | `demo2027!` | STUDENT | TsunagiNet, RED_ATRISK, Cohort Gamma |
| `mentor.alpha@demo.mujin.jp` | `mentor2026!` | MENTOR | Assigned to Cohort Alpha |
| `mentor.[cohort]@demo.mujin.jp` | `mentor2026!` | MENTOR | Beta through Kappa mentors |
| 50 demo students | `demo2027!` | STUDENT | `[firstname].[lastname]@demo.mujin.jp` — 10 cohorts Alpha–Kappa |

**Org ID:** `org-mujin`

**Demo cohort IDs:** `cohort-alpha` through `cohort-kappa` (stable, deterministic)

**Demo email domain:** `@demo.mujin.jp` — used for data isolation

---

## Infrastructure

### Railway (Postgres)
- **Public URL:** `ballast.proxy.rlwy.net:44544`
- **Internal URL:** `postgres.railway.internal:5432` (use for Railway deployment)
- **SSL:** `ssl: { rejectUnauthorized: false }` required in `src/lib/prisma.ts` for production (Railway SSL from Vercel AWS network)

### Vercel (App Hosting)
- **Production URL:** https://mujin2.vercel.app
- **GitHub:** https://github.com/jahn-sudo/Mujin.git
- **Deploy pattern (CRITICAL):**
  ```
  cd app && /Users/jonathanahn/.npm-global/bin/vercel --prod --yes
  /Users/jonathanahn/.npm-global/bin/vercel alias set <new-deployment-url> mujin2.vercel.app
  ```
  **IMPORTANT:** Always run the alias set step after deploy. Vercel only auto-aliases `www.mujin2vercel.app`, NOT `mujin2.vercel.app`.
- **Deployment Protection:** Must be set to None (Settings → Deployment Protection → None) or external requests are blocked by SSO.
- **`next.config.ts`:** `serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"]` — prevents Turbopack from bundling Prisma (fixes `fileURLToPath` crash on Vercel production).

### Google Sheets (Application Intake)
- **Service account:** `mujin-sheets-reader@calm-magpie-490613-n5.iam.gserviceaccount.com`
- **Auth pattern:** `google.auth.GoogleAuth` with `credentials: { client_email, private_key }` — do NOT use `google.auth.JWT` (invalid JWT signature issues on Vercel)
- **To regenerate `GOOGLE_PRIVATE_KEY_B64`:** `python3 -c "import base64,json; f=open('key.json'); print(base64.b64encode(json.load(f)['private_key'].encode()).decode(), end='')"`
- **Expected Sheet columns:** A=Timestamp, B=Full Name, C=Email, D=University, E=Nationality, F=Venture Category, G=Venture Category Other, H=Venture Name, I=Venture Description, J=Japan Pain Point, K=Faith Motivation
- **Google Form URL:** `https://docs.google.com/forms/d/e/1FAIpQLScp7GNJ9T58mHrY_zfrcPbWj5i51dffLYVaM72xfH02sCghqw/viewform?usp=sharing&ouid=103224701688413762370`
- **Sheet sharing:** Share the sheet with the service account email as Viewer before syncing

---

## Environment Variables

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Railway Postgres connection string (public URL for dev, internal for Railway deploy). Watch for trailing `\n` — reset via `vercel env add DATABASE_URL production --force` if needed. |
| `JWT_ACCESS_SECRET` | Signs 15-min access tokens |
| `JWT_REFRESH_SECRET` | Signs 30-day refresh tokens |
| `RESEND_API_KEY` | Email sending (Resend free tier: only sends to account owner's email; needs verified domain for production use) |
| `GOOGLE_CLIENT_EMAIL` | Google service account email |
| `GOOGLE_PRIVATE_KEY_B64` | Base64-encoded private key only (avoids newline escaping issues) |
| `ANTHROPIC_API_KEY` | Claude API for reflection assessment (claude-haiku-4-5-20251001) |
| `R2_ACCOUNT_ID` | Cloudflare R2 account |
| `R2_ACCESS_KEY_ID` | R2 access key |
| `R2_SECRET_ACCESS_KEY` | R2 secret |
| `R2_BUCKET_NAME` | R2 bucket for receipt uploads |

**Local dev:** `.env.local` at `app/.env.local`. DATABASE_URL points to Railway public URL. Must also update Vercel env vars with same JWT secrets.

---

## Migration History

| Migration | Sprint | Description |
| :--- | :--- | :--- |
| `20260316165517_init` | E1 | Base tables — Organization, User, RefreshToken, PasswordResetToken, ConsentRecord, InviteToken, MentorCohortAssignment, Cohort |
| `20260317141539_add_cohort_max_students` | E2 | maxStudents field on Cohort |
| `20260317143706_add_invite_token_venture_category` | E2 | VentureCategory enum + InviteToken expansion |
| `20260317144001_add_student_profile_venture_pledge` | E2 | StudentProfile, VentureProfile, PledgeRecord |
| `20260317153304_add_checkin_attendance` | E3 | CheckInSession, AttendanceRecord |
| `20260317154153_add_townhall_reflection` | E3 | TownHall, TownHallSubmission, ReflectionAssessment |
| `20260317155729_add_pl_submission_review` | E4 | PLSubmission, PLReview |
| `20260317161744_add_trust_score` | E5 | TrustScore, TrustScoreOverride |
| `20260317181832_add_graduation_record` | E8 | GraduationRecord |
| `20260317193634_add_checkin_notes_grades` | Session 10 | CheckInNote, CheckInGrade |
| `20260317204354_add_applications_sheet_config` | Session 11 | Application, SheetConfig, ApplicationStatus enum |
| `20260318155245_add_grant_tranche2` | Session 13 | GrantTranche2 model |
| `20260318161620_add_bank_intro_tracking` | Session 14 | BankIntroTracking, BankMeetingOutcome enum |
| `20260318162238_add_alumni_role` | Session 14 | ALUMNI added to Role enum |

---

## API Routes

### Auth
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/invite/[token]` — activation endpoint (validates InviteToken, creates User, sets password)

### Admin
- `GET /api/admin/dashboard` — cohorts with students + trust scores (excludes demo cohorts)
- `GET /api/admin/demo/dashboard` — demo-only dashboard (DEMO_COHORT_IDS only)
- `GET /api/admin/students` — all STUDENT-role users with cohort status (excludes demo + alumni)
- `GET /api/admin/students/[id]`
- `GET /api/admin/students/[id]/graduation` + `POST` — graduation state machine
- `POST /api/admin/students/[id]/graduation/schedule-interview`
- `POST /api/admin/students/[id]/graduation/record-interview`
- `POST /api/admin/students/[id]/graduation/trigger-bank-intro` — also transitions role to ALUMNI
- `GET/PUT /api/admin/students/[id]/graduation/bank-tracking`
- `GET /api/admin/students/[id]/grant`
- `POST /api/admin/students/[id]/grant/release-tranche2`
- `GET /api/admin/cohorts` (excludes demo cohorts)
- `GET /api/admin/applications`
- `GET /api/admin/applications/[id]`
- `POST /api/admin/applications/[id]/review` — Accept/Reject/Waitlist; Accept issues InviteToken + email
- `POST /api/admin/applications/sync` — pull from Google Sheets
- `GET/POST /api/admin/sheet-config`
- `GET /api/admin/pl-reviews`
- `GET /api/admin/townhalls/[id]`
- `GET /api/admin/checkin-sessions/[id]/metrics`

### Student
- `GET /api/student/me`
- `POST /api/student/pledge`
- `GET /api/student/demo/snapshot` — always returns Kai Watanabe's data (accessible to any STUDENT)
- `GET/POST /api/student/checkin-sessions/[id]/notes`
- `GET/POST /api/student/pl/[month]`
- `GET /api/student/townhall/[id]` + `POST`
- `GET /api/student/inbox`

### Mentor
- `GET /api/mentor/cohort-summary` — cohort + students + trust scores + attendance + check-in notes
- `GET /api/mentor/checkin-sessions/[id]/notes`
- `POST /api/mentor/checkin-sessions/[id]/notes/[noteId]/grade`

### Alumni
- `GET /api/alumni/me`
- `GET /api/alumni/directory`

### Cron
- `POST /api/cron/send-notifications` — Vercel daily at 09:00; RED alerts + graduation eligibility emails

---

## Key Pages

### Public Site
- `/` — homepage (dark hero, Cormorant Garamond + IBM Plex Mono, scroll animations, FadeUp, grain texture)
- `/about`, `/program`, `/team`, `/alumni`, `/faq`

### Dashboard — Student
- `/dashboard/student` — main dashboard (pledge guard: redirects to /pledge if not signed)
- `/dashboard/student/pledge` — 7-clause Pledge of Honor (EN + JP title, versioned 1.0)
- `/dashboard/student/pl/[month]`
- `/dashboard/student/townhall/[id]`
- `/dashboard/student/inbox`
- `/dashboard/student/checkin/[id]`
- `/dashboard/student/demo` — calls `/api/student/demo/snapshot` (always shows Kai Watanabe's data)

### Dashboard — Admin
- `/dashboard/admin`
- `/dashboard/admin/students/[id]`
- `/dashboard/admin/pl-reviews`
- `/dashboard/admin/townhalls/[id]`
- `/dashboard/admin/cohorts` — create cohorts, assign students, invite mentors
- `/dashboard/admin/applications` — review queue + Sheet config + sync
- `/dashboard/admin/applications/[id]`
- `/dashboard/admin/demo` — calls `/api/admin/demo/dashboard` (50 real demo students)

### Dashboard — Mentor
- `/dashboard/mentor`
- `/dashboard/mentor/checkin/[id]`
- `/dashboard/mentor/demo` — hardcoded constants (YenWise + Cohort Alpha preview)

### Dashboard — Alumni
- `/dashboard/alumni`
- `/dashboard/alumni/directory`
- `/dashboard/alumni/demo` — hardcoded YenWise seed data

### Activation
- `/activate?token=...` — token validation, password set, ToS checkbox → `/login?activated=1`
- `/login` — green success banner on `?activated=1`

---

## Demo Data Isolation

**`src/lib/demo.ts`** exports:
```ts
export const DEMO_COHORT_IDS = [
  "cohort-alpha", "cohort-beta", "cohort-gamma", "cohort-delta", "cohort-epsilon",
  "cohort-zeta", "cohort-eta", "cohort-theta", "cohort-iota", "cohort-kappa",
] as const;
export const DEMO_EMAIL_DOMAIN = "@demo.mujin.jp";
```

- Regular admin routes (`/api/admin/dashboard`, `/api/admin/cohorts`, `/api/admin/students`) filter OUT demo cohorts and demo email domain
- Demo-only routes (`/api/admin/demo/dashboard`, `/api/student/demo/snapshot`) filter IN demo data only
- **Important:** Always spread `[...DEMO_COHORT_IDS]` in Prisma `in:` filters — TypeScript rejects `readonly` tuples directly

---

## Key Dependencies

- `@anthropic-ai/sdk` — reflection AI assessment
- `@aws-sdk/client-s3` — Cloudflare R2 receipt upload
- `googleapis` — Google Sheets API v4
- `i18next` + `react-i18next` — EN/JP toggle (persists to localStorage)
- `@prisma/adapter-pg` + `pg` — Prisma 7.x PostgreSQL adapter pattern
- `bcryptjs` — password hashing
- `resend` — transactional email

**Fonts:** `Cormorant_Garamond` (`--font-cormorant`, `.font-display`) + `IBM_Plex_Mono` (`--font-ibm-mono`, `.font-data`) via `next/font/google`

**CSS classes:** `.grain` (noise overlay), `.fade-up` + `.visible` (scroll reveal), `.pulse-live` (green pulse), `.bar-fill` (animated width)

**Test framework:** Jest + ts-jest. 231 tests passing across 22 suites.

**i18n:** Locale files at `src/locales/en.json` + `src/locales/ja.json`. Keys: nav, common, student.*, admin.*, mentor.*, demo.*

**Receipt storage key pattern:** `receipts/{orgId}/{studentId}/{month}/{uuid}`
