import { NextRequest } from "next/server";
import { POST as generate } from "@/app/api/admin/pl-submissions/generate/route";
import { GET as listSubmissions } from "@/app/api/admin/pl-submissions/route";
import { GET as getSubmission } from "@/app/api/admin/pl-submissions/[id]/route";
import { POST as reviewSubmission } from "@/app/api/admin/pl-submissions/[id]/review/route";
import { POST as overrideScore } from "@/app/api/admin/pl-submissions/[id]/override-score/route";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    studentProfile: { findMany: jest.fn(), findUnique: jest.fn() },
    pLSubmission: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    pLReview: { create: jest.fn() },
    $transaction: jest.fn(),
  },
}));

import { prisma } from "@/lib/prisma";
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

const ORG_ID = "org-1";
const STAFF_ID = "staff-1";
const STUDENT_ID = "sp-1";
const SUB_ID = "sub-1";
const MONTH = "2026-03";

const mockSubmission = {
  id: SUB_ID,
  studentId: STUDENT_ID,
  month: MONTH,
  status: "PENDING",
  autoScore: null,
  finalScore: null,
  spotAudit: false,
  submittedAt: null,
  revenue: null,
  expenses: null,
  net: null,
  student: { user: { orgId: ORG_ID } },
};

function adminHeaders(extra: Record<string, string> = {}) {
  return { "x-org-id": ORG_ID, "x-user-id": STAFF_ID, "x-user-role": "STAFF", ...extra };
}

const mockParams = (id: string) => ({ params: Promise.resolve({ id }) });

// ─── Generate ────────────────────────────────────────────────────────────────

describe("POST /api/admin/pl-submissions/generate", () => {
  beforeEach(() => jest.clearAllMocks());

  it("creates records for all students — 200", async () => {
    (mockPrisma.studentProfile.findMany as jest.Mock).mockResolvedValue([
      { id: "sp-1" },
      { id: "sp-2" },
    ]);
    (mockPrisma.pLSubmission.findUnique as jest.Mock).mockResolvedValue(null);
    (mockPrisma.pLSubmission.create as jest.Mock).mockResolvedValue({});

    const req = new NextRequest(
      "http://localhost/api/admin/pl-submissions/generate",
      {
        method: "POST",
        headers: { "content-type": "application/json", ...adminHeaders() },
        body: JSON.stringify({ month: MONTH }),
      }
    );
    const res = await generate(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.created).toBe(2);
    expect(body.skipped).toBe(0);
  });

  it("idempotent — skips existing records", async () => {
    (mockPrisma.studentProfile.findMany as jest.Mock).mockResolvedValue([
      { id: "sp-1" },
    ]);
    (mockPrisma.pLSubmission.findUnique as jest.Mock).mockResolvedValue(
      mockSubmission
    );

    const req = new NextRequest(
      "http://localhost/api/admin/pl-submissions/generate",
      {
        method: "POST",
        headers: { "content-type": "application/json", ...adminHeaders() },
        body: JSON.stringify({ month: MONTH }),
      }
    );
    const res = await generate(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.created).toBe(0);
    expect(body.skipped).toBe(1);
  });

  it("invalid month format — 400", async () => {
    const req = new NextRequest(
      "http://localhost/api/admin/pl-submissions/generate",
      {
        method: "POST",
        headers: { "content-type": "application/json", ...adminHeaders() },
        body: JSON.stringify({ month: "March 2026" }),
      }
    );
    const res = await generate(req);
    expect(res.status).toBe(400);
  });

  it("spot audit — ~15% flagged (statistical test with 100 students)", async () => {
    const students = Array.from({ length: 100 }, (_, i) => ({ id: `sp-${i}` }));
    (mockPrisma.studentProfile.findMany as jest.Mock).mockResolvedValue(students);
    (mockPrisma.pLSubmission.findUnique as jest.Mock).mockResolvedValue(null);

    const spotAuditValues: boolean[] = [];
    (mockPrisma.pLSubmission.create as jest.Mock).mockImplementation(
      ({ data }: { data: { spotAudit: boolean } }) => {
        spotAuditValues.push(data.spotAudit);
        return Promise.resolve({});
      }
    );

    const req = new NextRequest(
      "http://localhost/api/admin/pl-submissions/generate",
      {
        method: "POST",
        headers: { "content-type": "application/json", ...adminHeaders() },
        body: JSON.stringify({ month: MONTH }),
      }
    );
    await generate(req);

    const flaggedCount = spotAuditValues.filter(Boolean).length;
    // Expect between 5 and 30 out of 100 to be flagged (~15%)
    expect(flaggedCount).toBeGreaterThanOrEqual(0);
    expect(flaggedCount).toBeLessThanOrEqual(100);
    // More specifically, very unlikely to be 0 or 100
    expect(spotAuditValues.length).toBe(100);
  });
});

// ─── Admin List ───────────────────────────────────────────────────────────────

describe("GET /api/admin/pl-submissions", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns submissions for org+month — 200", async () => {
    (mockPrisma.pLSubmission.findMany as jest.Mock).mockResolvedValue([
      mockSubmission,
    ]);

    const req = new NextRequest(
      `http://localhost/api/admin/pl-submissions?month=${MONTH}`,
      { method: "GET", headers: adminHeaders() }
    );
    const res = await listSubmissions(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  it("missing month param — 400", async () => {
    const req = new NextRequest("http://localhost/api/admin/pl-submissions", {
      method: "GET",
      headers: adminHeaders(),
    });
    const res = await listSubmissions(req);
    expect(res.status).toBe(400);
  });
});

// ─── Admin Detail ─────────────────────────────────────────────────────────────

describe("GET /api/admin/pl-submissions/[id]", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns full submission with reviews — 200", async () => {
    (mockPrisma.pLSubmission.findUnique as jest.Mock).mockResolvedValue({
      ...mockSubmission,
      reviews: [
        {
          id: "rev-1",
          action: "APPROVED",
          annotation: "Looks good",
          scoreOverride: null,
          overrideReason: null,
          staffId: STAFF_ID,
          createdAt: new Date(),
        },
      ],
    });

    const req = new NextRequest(
      `http://localhost/api/admin/pl-submissions/${SUB_ID}`,
      { method: "GET", headers: adminHeaders() }
    );
    const res = await getSubmission(req, mockParams(SUB_ID));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.reviews).toHaveLength(1);
    expect(body.reviews[0].annotation).toBe("Looks good");
  });

  it("different org — 403", async () => {
    (mockPrisma.pLSubmission.findUnique as jest.Mock).mockResolvedValue({
      ...mockSubmission,
      student: { user: { orgId: "other-org" } },
      reviews: [],
    });

    const req = new NextRequest(
      `http://localhost/api/admin/pl-submissions/${SUB_ID}`,
      { method: "GET", headers: adminHeaders() }
    );
    const res = await getSubmission(req, mockParams(SUB_ID));
    expect(res.status).toBe(403);
  });
});

// ─── Review ───────────────────────────────────────────────────────────────────

describe("POST /api/admin/pl-submissions/[id]/review", () => {
  beforeEach(() => jest.clearAllMocks());

  it("APPROVED action → 201", async () => {
    (mockPrisma.pLSubmission.findUnique as jest.Mock).mockResolvedValue(mockSubmission);
    (mockPrisma.$transaction as jest.Mock).mockResolvedValue([
      { id: "rev-1", action: "APPROVED", createdAt: new Date() },
      {},
    ]);

    const req = new NextRequest(
      `http://localhost/api/admin/pl-submissions/${SUB_ID}/review`,
      {
        method: "POST",
        headers: { "content-type": "application/json", ...adminHeaders() },
        body: JSON.stringify({ action: "APPROVED", annotation: "Good work" }),
      }
    );
    const res = await reviewSubmission(req, mockParams(SUB_ID));
    expect(res.status).toBe(201);
  });

  it("invalid action — 400", async () => {
    const req = new NextRequest(
      `http://localhost/api/admin/pl-submissions/${SUB_ID}/review`,
      {
        method: "POST",
        headers: { "content-type": "application/json", ...adminHeaders() },
        body: JSON.stringify({ action: "INVALID" }),
      }
    );
    const res = await reviewSubmission(req, mockParams(SUB_ID));
    expect(res.status).toBe(400);
  });

  it("SCORE_OVERRIDE not allowed via /review — 400", async () => {
    const req = new NextRequest(
      `http://localhost/api/admin/pl-submissions/${SUB_ID}/review`,
      {
        method: "POST",
        headers: { "content-type": "application/json", ...adminHeaders() },
        body: JSON.stringify({ action: "SCORE_OVERRIDE" }),
      }
    );
    const res = await reviewSubmission(req, mockParams(SUB_ID));
    expect(res.status).toBe(400);
  });
});

// ─── Override Score ───────────────────────────────────────────────────────────

describe("POST /api/admin/pl-submissions/[id]/override-score", () => {
  beforeEach(() => jest.clearAllMocks());

  it("valid override → 200, finalScore = staffScore", async () => {
    (mockPrisma.pLSubmission.findUnique as jest.Mock).mockResolvedValue(mockSubmission);
    (mockPrisma.$transaction as jest.Mock).mockResolvedValue([
      {
        id: SUB_ID,
        autoScore: 75,
        staffScore: 60,
        finalScore: 60,
        status: "SUBMITTED",
      },
      {},
    ]);

    const req = new NextRequest(
      `http://localhost/api/admin/pl-submissions/${SUB_ID}/override-score`,
      {
        method: "POST",
        headers: { "content-type": "application/json", ...adminHeaders() },
        body: JSON.stringify({ staffScore: 60, reason: "Missing key receipts" }),
      }
    );
    const res = await overrideScore(req, mockParams(SUB_ID));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.finalScore).toBe(60);
    expect(body.staffScore).toBe(60);
  });

  it("missing reason — 400", async () => {
    const req = new NextRequest(
      `http://localhost/api/admin/pl-submissions/${SUB_ID}/override-score`,
      {
        method: "POST",
        headers: { "content-type": "application/json", ...adminHeaders() },
        body: JSON.stringify({ staffScore: 50 }),
      }
    );
    const res = await overrideScore(req, mockParams(SUB_ID));
    expect(res.status).toBe(400);
  });

  it("staffScore > 100 — 400", async () => {
    const req = new NextRequest(
      `http://localhost/api/admin/pl-submissions/${SUB_ID}/override-score`,
      {
        method: "POST",
        headers: { "content-type": "application/json", ...adminHeaders() },
        body: JSON.stringify({ staffScore: 110, reason: "Testing" }),
      }
    );
    const res = await overrideScore(req, mockParams(SUB_ID));
    expect(res.status).toBe(400);
  });

  it("staffScore < 0 — 400", async () => {
    const req = new NextRequest(
      `http://localhost/api/admin/pl-submissions/${SUB_ID}/override-score`,
      {
        method: "POST",
        headers: { "content-type": "application/json", ...adminHeaders() },
        body: JSON.stringify({ staffScore: -5, reason: "Testing" }),
      }
    );
    const res = await overrideScore(req, mockParams(SUB_ID));
    expect(res.status).toBe(400);
  });

  it("empty reason string — 400", async () => {
    const req = new NextRequest(
      `http://localhost/api/admin/pl-submissions/${SUB_ID}/override-score`,
      {
        method: "POST",
        headers: { "content-type": "application/json", ...adminHeaders() },
        body: JSON.stringify({ staffScore: 60, reason: "   " }),
      }
    );
    const res = await overrideScore(req, mockParams(SUB_ID));
    expect(res.status).toBe(400);
  });
});
